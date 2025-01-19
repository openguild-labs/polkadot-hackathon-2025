const formatTokenId = (tokenId: any) => {
  // Convert to BigInt to handle very large numbers
  const bigTokenId = BigInt(tokenId);
  
  // If the number is small enough, return it as is
  if (bigTokenId < BigInt(1000)) {
    return tokenId.toString();
  }
  
  // For larger numbers, create a shortened version
  if (bigTokenId < BigInt(1000000)) {
    // For numbers < 1M, show first 3 digits + k
    return `${(Number(bigTokenId) / 1000).toFixed(1)}k`;
  }
  
  if (bigTokenId < BigInt(1000000000)) {
    // For numbers < 1B, show first 3 digits + M
    return `${(Number(bigTokenId) / 1000000).toFixed(1)}M`;
  }
  
  // For very large numbers, show first 4 digits + ellipsis + last 4 digits
  const idString = tokenId.toString();
  return `${idString.slice(0, 4)}...${idString.slice(-4)}`;
};

export { formatTokenId };