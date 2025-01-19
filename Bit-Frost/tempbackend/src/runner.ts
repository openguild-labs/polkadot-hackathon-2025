import { bitcoin_priv_key, eth_priv_key } from "./contants.js";
import { generateTaprootAddress } from "./utils/bitcoinUtils.js";

function main() {
    const { address , privateKey } = generateTaprootAddress();
    // console.log({ address , privateKey });

    console.log(eth_priv_key  )
    console.log(bitcoin_priv_key )
}

main();