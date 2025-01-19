export const uploadImageToIPFS = async (file:File) => {
  try {
    // Validate file
    
    if (!file) {

      throw new Error("No file provided");
    }

    // Create form data
    const formData = new FormData();
    formData.append("file", file);

    // Upload to Pinata
    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT_SECRET_ACCESS_TOKEN}`,
      },
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Upload failed with status: ${res.status}`);
    }

    const data = await res.json();
    
    return {
      ipfsHash: data.IpfsHash,
      url: `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${data.IpfsHash}`
    };
  } catch (error) {
    console.error("Error uploading image to IPFS:", error);
    throw error;
  }
};