import { ethers } from "ethers";
import CurrentConfig from "../../CurrentConfig";

export function getProvider() {
  let x = new ethers.providers.JsonRpcProvider(CurrentConfig.rpc.mainnet);
  console.log(x);
  return x;
}
