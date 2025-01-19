export type TUser = {
    name: string,
    avatar: string,
    wallets: any,
    asserts: any,
    market?: null,
    totalNFTs: number
}

export type TAsset = {
    id: string,
    nftId: string,
    createdAt: string,
    updatedAt: string,
    startAt: string,
    endAt: string,
    highest_bid: number,
    userId: string,
    image: string,
    type: string,
    auction_marketId: null | string
}

export type listDto = {
    index: number,
    id: number,
    amount: number,
    price: number,
    deadline: number
}

