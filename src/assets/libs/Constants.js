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

export const QUOTER_CONTRACT_ADDRESS_2 =
  "0x61fFE014bA17989E743c5F6cB21bF9697530B21e";
// Currencies and Tokens

export const WETH_TOKEN = new Token(
  ChainId.MAINNET,
  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  18,
  "WETH",
  "Wrapped Ether"
);

export const USDC_TOKEN = new Token(
  ChainId.MAINNET,
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  6,
  "DAI",
  "DAI"
);

export const TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER = 2000;
export const ERC20_ABI = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",

  // Authenticated Functions
  "function transfer(address to, uint amount) returns (bool)",
  "function approve(address _spender, uint256 _value) returns (bool)",

  // Events
  "event Transfer(address indexed from, address indexed to, uint amount)",
];
export const SWAP_ROUTER_ADDRESS = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
export const MAX_PRIORITY_FEE_PER_GAS = 100000000000;
export const MAX_FEE_PER_GAS = 100000000000;
