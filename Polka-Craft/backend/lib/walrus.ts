import axios from 'axios';

const ADDRESS = '127.0.0.1:31415';
const EPOCHS = '5';

export async function uploadBlob(data: string | Buffer): Promise<string> {
  try {
    const storeUrl = `http://${ADDRESS}/v1/store?epochs=${EPOCHS}`;
    const response = await axios.put(storeUrl, data);

    if (response.status !== 200) {
      throw new Error(`Failed to upload blob: ${response.statusText}`);
    }

    const blobId = response.data.newlyCreated.blobObject.blobId;
    return blobId;
  } catch (error) {
    throw new Error(`Error uploading blob: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to download a blob from the Walrus service
 */
export async function downloadBlob(blobId: string): Promise<Buffer> {
  try {
    const readUrl = `http://${ADDRESS}/v1/${blobId}`;
    const response = await axios.get(readUrl, {
      responseType: 'arraybuffer'
    });

    if (response.status !== 200) {
      throw new Error(`Failed to download blob: ${response.statusText}`);
    }

    return Buffer.from(response.data);
  } catch (error) {
    throw new Error(`Error downloading blob: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
} 
