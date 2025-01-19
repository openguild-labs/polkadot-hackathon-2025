export const getNFTVault = (nft : any[]) => ({
    type: "GETNFTVAULT",
    nfts: nft
})

export const getAddressNFTVault = (nft : any[]) => ({
    type: "GETADDRESSNFTVAULT",
    nfts: nft
})

export const getCurrentNFTBorrow = (nft : object) => ({
    type: "GETCURRENTNFTBORROW",
    currentNFT: nft
})
