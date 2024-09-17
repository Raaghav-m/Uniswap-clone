// export const QUOTER_ADDRESS = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6";
// export const POOL_FACTORY_CONTRACT_ADDRESS =
//   "0x1F98431c8aD98523631AE4a59f267346ea31F984";
// export const WETH_TOKEN = "0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1";
// export const DAI_TOKEN = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

import { ChainId, Token } from "@uniswap/sdk-core";

// Addresses

export const POOL_FACTORY_CONTRACT_ADDRESS =
  "0x1F98431c8aD98523631AE4a59f267346ea31F984";
export const QUOTER_CONTRACT_ADDRESS =
  "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6";

// Currencies and Tokens

export const WETH_TOKEN = new Token(
  ChainId.MAINNET,
  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  18,
  "WETH",
  "Wrapped Ether"
);

export const DAI_TOKEN = new Token(
  ChainId.MAINNET,
  "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  6,
  "DAI",
  "DAI"
);
