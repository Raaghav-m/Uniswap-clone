import { ethers } from "ethers";

const READABLE_FORM_LEN = 4;

export function fromReadableAmount(amount, decimals) {
  console.log(amount.toString(), decimals);
  const x = ethers.utils.parseUnits(amount.toString(), decimals);
  return x;
}

export function toReadableAmount(rawAmount, decimals) {
  console.log(rawAmount, decimals);
  const x = ethers.utils
    .formatUnits(rawAmount, decimals)
    .slice(0, READABLE_FORM_LEN);
  console.log(x);
  return x;
}
