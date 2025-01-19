import { NFTInfo } from "./nft";

export interface CollectionInfo {
    id: number;
    nfts: NFTInfo[];
    img: string;
    name: string;
    contract: string;
    chainId: number;
}
