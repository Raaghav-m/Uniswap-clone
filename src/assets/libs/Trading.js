import { ethers } from "ethers";
import {
  POOL_FACTORY_CONTRACT_ADDRESS,
  QUOTER_CONTRACT_ADDRESS_2,
  TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
  ERC20_ABI,
  SWAP_ROUTER_ADDRESS,
  MAX_FEE_PER_GAS,
  MAX_PRIORITY_FEE_PER_GAS,
} from "./Constants";
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import {
  getWalletProvider,
  getWalletAddress,
  sendTransaction,
  TransactionState,
} from "./Provider";
import {
  computePoolAddress,
  Pool,
  Route,
  SwapQuoter,
  SwapRouter,
  Trade,
} from "@uniswap/v3-sdk";
import CurrentConfig from "../../CurrentConfig";
import { CurrencyAmount, TradeType } from "@uniswap/sdk-core";
import { fromReadableAmount } from "./Conversion";
import { Percent } from "@uniswap/sdk-core";
import JSBI from "jsbi";

export async function createTrade(val) {
  const poolInfo = await getPoolConstants();

  const pool = new Pool(
    CurrentConfig.tokens.in,
    CurrentConfig.tokens.out,
    CurrentConfig.tokens.poolFee,
    poolInfo.sqrtPriceLimitX96.toString(),
    poolInfo.liquidity.toString(),
    poolInfo.tick
  );
  let route = new Route(
    [pool],
    CurrentConfig.tokens.in,
    CurrentConfig.tokens.out
  );
  console.log(route);

  const outputQuote = await getOutputQuote(route, val);
  const uncheckeredTrade = Trade.createUncheckedTrade({
    route: route,
    inputAmount: CurrencyAmount.fromRawAmount(
      CurrentConfig.tokens.in,
      fromReadableAmount(val, CurrentConfig.tokens.in.decimals).toString()
    ),
    outputAmount: CurrencyAmount.fromRawAmount(
      CurrentConfig.tokens.out,
      JSBI.BigInt(outputQuote)
    ),

    tradeType: TradeType.EXACT_INPUT,
  });
  return uncheckeredTrade;
}
async function getPoolConstants() {
  let poolAddress = computePoolAddress({
    factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
    tokenA: CurrentConfig.tokens.in,
    tokenB: CurrentConfig.tokens.out,
    fee: CurrentConfig.tokens.poolFee,
  });
  let poolContract = new ethers.Contract(
    poolAddress,
    IUniswapV3PoolABI.abi,
    getWalletProvider()
  );
  let [token0, token1, fee, tickSpacing, liquidity, slot0] = await Promise.all([
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee(),
    poolContract.tickSpacing(),
    poolContract.liquidity(),
    poolContract.slot0(),
  ]);

  return {
    token0,
    token1,
    fee,
    tickSpacing,
    liquidity,
    sqrtPriceLimitX96: slot0[0],
    tick: slot0[1],
  };
}

async function getOutputQuote(route, val) {
  const provider = getWalletProvider();

  if (!provider) {
    throw new Error("Provider required to get pool state");
  }

  const { calldata } = await SwapQuoter.quoteCallParameters(
    route,
    CurrencyAmount.fromRawAmount(
      CurrentConfig.tokens.in,
      fromReadableAmount(val, CurrentConfig.tokens.in.decimals).toString()
    ),
    TradeType.EXACT_INPUT,
    {
      useQuoterV2: true,
    }
  );
  console.log(calldata, QUOTER_CONTRACT_ADDRESS_2);

  const quoteCallReturnData = await provider.call({
    to: QUOTER_CONTRACT_ADDRESS_2,
    data: calldata,
  });
  const x = ethers.utils.defaultAbiCoder.decode(
    ["uint256"],
    quoteCallReturnData
  );
  console.log(x.toString());
  return x;
}

export async function executeTrade(trade) {
  console.log(trade);
  const walletAddress = await getWalletAddress();
  const tokenApproval = await getTokenTransferApproval(CurrentConfig.tokens.in);
  console.log(tokenApproval);
  const options = {
    slippageTolerance: new Percent(50, 10_000), // 50 bips, or 0.50%
    deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
    recipient: walletAddress,
  };

  const methodParameters = SwapRouter.swapCallParameters([trade], options);

  const tx = {
    data: methodParameters.calldata,
    to: SWAP_ROUTER_ADDRESS,
    value: methodParameters.value,
    from: walletAddress,
    maxFeePerGas: MAX_FEE_PER_GAS,
    maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
  };

  const res = await sendTransaction(tx);
  console.log(res);
}
export async function getTokenTransferApproval(token) {
  const provider = getWalletProvider();
  const address = getWalletAddress();
  if (!provider || !address) {
    console.log("No Provider Found");
    return TransactionState.Failed;
  }

  try {
    const tokenContract = new ethers.Contract(
      token.address,
      ERC20_ABI,
      provider
    );

    const transaction = await tokenContract.populateTransaction.approve(
      SWAP_ROUTER_ADDRESS,
      fromReadableAmount(
        TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
        token.decimals
      ).toString()
    );
    console.log(transaction);
    console.log(address);
    return sendTransaction({
      ...transaction,
      from: address,
    });
  } catch (e) {
    console.error(e);
    return TransactionState.Failed;
  }
}
