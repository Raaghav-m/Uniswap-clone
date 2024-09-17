import { FeeAmount } from "@uniswap/v3-sdk";
import { DAI_TOKEN, WETH_TOKEN } from "./assets/libs/Constants";

// Example Configuration
const CurrentConfig = {
  rpc: {
    local: "http://localhost:8545",
    mainnet:
      "https://eth-mainnet.g.alchemy.com/v2/7LHopYRpqnEpAavMFHoWggsnWgle3GBg",
  },
  tokens: {
    in: WETH_TOKEN,
    out: DAI_TOKEN,
    poolFee: FeeAmount.MEDIUM,
  },
};

export default CurrentConfig;
