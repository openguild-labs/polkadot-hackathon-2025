import * as dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@nomicfoundation/hardhat-ethers';

dotenv.config();

const MOONBASE_ALPHA_PRIVATE_KEY =
    'e74faafc9c25c93b156ef8f7bc3f55617ac4c9c6073fab21ec70878ea1989e26';

const MOONBASE_ALPHA_URL = 'https://rpc.api.moonbase.moonbeam.network';

const config: HardhatUserConfig = {
    networks: {
        hardhat: {},
        moonbaseAlpha: {
            url: MOONBASE_ALPHA_URL,
            accounts: [MOONBASE_ALPHA_PRIVATE_KEY],
        },
    },
    solidity: {
        version: '0.8.28',
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    paths: {
        sources: './contracts',
        tests: './test',
        cache: './cache',
        artifacts: './artifacts',
    },
    mocha: {
        timeout: 20000,
    },
};

export default config;
