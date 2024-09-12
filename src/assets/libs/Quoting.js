import React from "react";
import Quoter from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";
import { QUOTER_ADDRESS } from "./Constants";
import { ethers } from "ethers";
import { getProvider } from "./Provider";
import { toReadableAmount, fromReadableAmount } from "./Conversion";
import CurrentConfig from "../../CurrentConfig";

export default async function quote(value) {
  let quoterContract = new ethers.Contract(
    QUOTER_ADDRESS,
    Quoter.abi,
    getProvider()
  );
  let amount = toReadableAmount(value);
  console.log(quoterContract);

  let quoteAmount = await quoterContract.callStatic.quoteExactInputSingle(
    CurrentConfig.tokens.in,
    CurrentConfig.tokens.out,
    CurrentConfig.tokens.poolFee,
    amount,
    0
  );
  let quoteVal = fromReadableAmount(quoteAmount);

  return quoteVal;
}
