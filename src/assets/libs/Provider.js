import { JsonRpcProvider } from "ethers";
import CurrentConfig from "../../CurrentConfig";

// Provider Functions

export async function getProvider() {
  const x = new JsonRpcProvider(CurrentConfig.rpc.mainnet);
  console.log(x._detectNetwork);
  console.log(x);
  return x;
}
