export const getNFTMarket = (nft : any[]) => ({
    type: "GETNFTMARKET",
    nfts: nft
})
export const getAddressID = (nft : any[]) => ({
    type: "GETADDRESSID",
    nfts: nft
})