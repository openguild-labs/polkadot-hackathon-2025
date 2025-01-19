import { NFTInfo } from "@/interfaces/nft";
import Image from "next/image";
import { NftMetadata, NftProvider, useNft } from "use-nft";
import { JsonRpcProvider } from "@ethersproject/providers";
import { ChainInfo } from "@/interfaces/chain";
import { useEffect } from "react";
import { isUndefined } from "lodash";

type NFTImageProps = Pick<NFTInfo, 'contractAddress' | 'tokenId'> & { className?: string } & Pick<ChainInfo, 'rpcUrl'> & {onNFT?: (nft: NftMetadata) => void};

export default function NFTImage(props: NFTImageProps) {

    const chainConfig = {
        provider: new JsonRpcProvider(props.rpcUrl),
    }
    return (
        <NftProvider fetcher={["ethers", chainConfig]}>
            <Inner {...props} />
        </NftProvider>
    )
}

function Inner({
    contractAddress,
    tokenId,
    className,
    onNFT
}: NFTImageProps) {
    const { nft, loading } = useNft(contractAddress, tokenId.toString());

    console.log({nft, loading});
    useEffect(() => {
        if (!isUndefined(nft)) {
            onNFT?.(nft);
        }
    }, [nft, onNFT]);
    return (
        <>
            {loading || !nft ? (
                <div className="animate-pulse bg-gray-700 rounded-xl w-20 h-20" />
            ) : (
                <Image
                    src={nft.image}
                    alt={nft.name}
                    className={className}
                    width={100}
                    height={100}
                />
            )}
        </>
    )
}

