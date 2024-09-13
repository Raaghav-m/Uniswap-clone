import React from "react";
import Quoter from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";
import {
  QUOTER_CONTRACT_ADDRESS,
  POOL_FACTORY_CONTRACT_ADDRESS,
} from "./Constants";
import { ethers } from "ethers";
import { getProvider } from "./Provider";
import { toReadableAmount, fromReadableAmount } from "./Conversion";
import CurrentConfig from "../../CurrentConfig";
import { computePoolAddress } from "@uniswap/v3-sdk";
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";

export default async function quote(value) {
  let quoterContract = new ethers.Contract(
    QUOTER_CONTRACT_ADDRESS,
    Quoter.abi,
    await getProvider()
  );

  let amount = toReadableAmount(value);
  let poolConstants = await getPoolConstants();
  try {
    let quoteAmount = await quoterContract.callStatic.quoteExactInputSingle(
      poolConstants.token0,
      poolConstants.token1,
      poolConstants.fee,
      amount.toString(),
      0
    );
    let quoteVal = fromReadableAmount(quoteAmount);
    return quoteVal;
  } catch (err) {
    console.log(err);
    return;
  }
}

async function getPoolConstants() {
  const currentPoolAddress = computePoolAddress({
    factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
    tokenA: CurrentConfig.tokens.in,
    tokenB: CurrentConfig.tokens.out,
    fee: CurrentConfig.tokens.poolFee,
  });
  console.log(currentPoolAddress);

  const poolContract = new ethers.Contract(
    currentPoolAddress,
    IUniswapV3PoolABI.abi,
    getProvider()
  );
  const [token0, token1, fee] = await Promise.all([
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee(),
  ]);

  return {
    token0,
    token1,
    fee,
  };
}
