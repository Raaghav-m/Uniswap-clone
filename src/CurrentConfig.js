import { FeeAmount } from "@uniswap/v3-sdk";
import { USDC_TOKEN, WETH_TOKEN } from "./assets/libs/Constants";

// Example Configuration

export const Environment = {
  LOCAL: "0",
  MAINNET: "1",
  WALLET_EXTENSION: "2",
};

const CurrentConfig = {
  env: Environment.LOCAL,
  rpc: {
    local: "http://localhost:8545",
    mainnet:
      "https://eth-mainnet.g.alchemy.com/v2/7LHopYRpqnEpAavMFHoWggsnWgle3GBg",
  },
  wallet: {
    address: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
    privateKey:
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  },
  tokens: {
    in: WETH_TOKEN,
    amount: 1000,
    out: USDC_TOKEN,
    poolFee: FeeAmount.MEDIUM,
  },
};

export default CurrentConfig;
