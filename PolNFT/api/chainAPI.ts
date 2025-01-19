import { ChainInfo } from "@/interfaces/chain";

export class ChainAPI {
    static async getChainById(id: number): Promise<ChainInfo> {
        return {
            id: id,
            name: "Moonbase Alpha",
            img: "https://moonbase.moonscan.io/assets/moonbase/images/svg/logos/chain-light.svg?v=24.12.4.2",
            rpcUrl: ""
        }
    }
}
