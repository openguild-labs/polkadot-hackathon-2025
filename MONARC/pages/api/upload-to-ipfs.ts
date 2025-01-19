import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fetch from 'node-fetch'
import fs from 'fs'
import FormData from 'form-data'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  
  const form = new formidable.IncomingForm()
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Formidable parsing error:', err);
      return res.status(500).json({ error: 'Error parsing form data', details: err.message })
    }
    
    // Validate environment variables
    if (!process.env.JWT_SECRET_ACCESS_TOKEN) {
      console.error('Missing JWT_SECRET_ACCESS_TOKEN');
      return res.status(500).json({ error: 'Missing Pinata JWT token' })
    }

    const fileArray = files.file as formidable.File[] | undefined
    if (!fileArray || fileArray.length === 0) {
      return res.status(400).json({ error: 'No file provided' })
    }

    const file = fileArray[0] // We'll process only the first file

    try {
      const fileBuffer = fs.readFileSync(file.filepath)
      const formData = new FormData()
      formData.append('file', fileBuffer, {
        filename: file.originalFilename || 'file',
        contentType: file.mimetype || 'application/octet-stream',
      })

      console.log('Uploading file to Pinata:', {
        filename: file.originalFilename,
        size: fileBuffer.length,
        mimetype: file.mimetype
      });

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.JWT_SECRET_ACCESS_TOKEN}`,
          ...formData.getHeaders(),
        },
        body: formData,
      })

      const responseText = await response.text();
      console.log('Pinata API Response:', {
        status: response.status,
        body: responseText
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}, response: ${responseText}`)
      }

      const data = JSON.parse(responseText)
      
      res.status(200).json({
        ipfsHash: data.IpfsHash,
        url: `${process.env.GATEWAY_URL}/ipfs/${data.IpfsHash}`
      })
    } catch (error) {
      console.error('Comprehensive error uploading to IPFS:', error);
      res.status(500).json({ 
        error: 'Failed to upload to IPFS', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      })
    }
  })
}