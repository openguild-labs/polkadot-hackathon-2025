
// import type { Chain } from "../src/types";

// # RPC_ENDPOINT="https://evm.shibuya.astar.network/"
// # RPC_ENDPOINT=https://shibuya-rpc.dwellir.com
// # RPC_ENDPOINT=https://evm.astar.network/
// # RPC_ENDPOINT="https://astar.public.blastapi.io/"
// # RPC_ENDPOINT=https://astar-mainnet.g.alchemy.com/v2/YXeTvtAle8Rm_JfIQ4cEOj1iO-o4Ydrg
// RPC_ENDPOINT=https://astar.api.onfinality.io/public

export const AssetHubWestend = {
    "chain": "Westend",
    "chainId": 420420421,
    "explorers": [
        {
            "name": "subscan",
            "url": "https://assethub-westend.subscan.io",
            "standard": "none",
            "icon": {
                "url": "ipfs://Qma2GfW5nQHuA7nGqdEfwaXPL63G9oTwRTQKaGTfjNtM2W",
                "width": 400,
                "height": 400,
                "format": "png"
            }
        }
    ],
    "faucets": [],
    "features": [],
    "icon": {
        "url": "ipfs://Qmdvmx3p6gXBCLUMU1qivscaTNkT6h3URdhUTZCHLwKudg",
        "width": 1000,
        "height": 1000,
        "format": "png"
    },
    "infoURL": "https://evm.shibuya.astar.network/",
    "name": "Asset-Hub Westend Testnet",
    "nativeCurrency": {
        "name": "Westend",
        "symbol": "WND",
        "decimals": 12
    },
    "networkId": 420420421,
    "redFlags": [],
    "rpc": [
        "https://assethub-westend.subscan.io",
    ],
    "shortName": "sby",
    "slug": "shibuya",
    "testnet": true
}
// as const satisfies Chain;