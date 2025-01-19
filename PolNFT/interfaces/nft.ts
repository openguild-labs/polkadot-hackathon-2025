export interface NFTInfo {
    name: string; // "Axie #12042712"
    img: string; // "https://image-cdn.lootrush.com/unsafe/311x0/smart/filters:format(webp)/https%3A%2F%2Fcdn.axieinfinity.com%2Fmarketplace-website%2Faxie-eggs%2Freptile-dusk.png"
    author: string;
    contractAddress: string;
    tokenId: number;
    feePerDay: number;
}

export enum NFTStatus {
    AVAILABLE = "AVAILABLE TO RENT",
    RENTED = "RENTED",
}
