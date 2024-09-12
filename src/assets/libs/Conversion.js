import { ethers } from "ethers";

export function toReadableAmount(amount) {
  return ethers.parseUnits(amount, 18);
}
export function fromReadableAmount(amount) {
  return ethers.formatUnits(amount, 18).slice(0, 4);
}
