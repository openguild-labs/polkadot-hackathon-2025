export const updateAddress = (address: string) => (
    {
        type : "UPDATEADDRESS",
        address_Signer: address
    }
)

export const updateNFTs = (nfts: any[]) => (
    {
        type : "UPDATENFTS",
        nfts_Signer: nfts
    }
)
export const updateNFTBorrow = (nfts: any[]) => (
    {
        type : "UPDATENFTBORROW",
        nfts_Signer: nfts
    }
)

