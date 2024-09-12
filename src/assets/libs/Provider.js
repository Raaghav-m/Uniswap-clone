import { ethers } from "ethers";
import CurrentConfig from "../../CurrentConfig";

export async function getProvider() {
  console.log(ethers);
  let x = new ethers.JsonRpcProvider(CurrentConfig.rpc.mainnet);
  console.log(ethers.JsonRpcProvider.network);
  console.log(x);
  return x;
}
