import { ethers, BigNumber } from "ethers";
import CurrentConfig from "../../CurrentConfig";
import { Environment } from "../../CurrentConfig";

const browserExtensionProvider = await createBrowserExtensionProvider();
const wallet = await createWallet();

export const TransactionState = {
  Failed: "Failed",
  New: "New",
  Rejected: "Rejected",
  Sending: "Sending",
  Sent: "Sent",
};

export function getProvider() {
  let x = new ethers.providers.JsonRpcProvider(CurrentConfig.rpc.mainnet);
  console.log(x);
  return x;
}
export function getWalletProvider() {
  return CurrentConfig.env === Environment.WALLET_EXTENSION
    ? browserExtensionProvider
    : wallet.provider;
}
async function createBrowserExtensionProvider() {
  try {
    return new ethers.providers.Web3Provider(window?.ethereum, "any");
  } catch (error) {
    console.log("No wallet extension found");
  }
}
async function createWallet() {
  let provider = getProvider();
  if (CurrentConfig.env == Environment.LOCAL) {
    provider = new ethers.providers.JsonRpcProvider(CurrentConfig.rpc.local);
  }
  return new ethers.Wallet(CurrentConfig.wallet.privateKey, provider);
}

export function getWalletAddress() {
  return CurrentConfig.env === Environment.WALLET_EXTENSION
    ? walletExtensionAddress
    : wallet.address;
}

export async function sendTransaction(transaction) {
  if (CurrentConfig.env === Environment.WALLET_EXTENSION) {
    return sendTransactionViaExtension(transaction);
  } else {
    if (transaction.value) {
      transaction.value = BigNumber.from(transaction.value);
    }
    return sendTransactionViaWallet(transaction);
  }
}
async function sendTransactionViaExtension(transaction) {
  try {
    const receipt = await browserExtensionProvider?.send(
      "eth_sendTransaction",
      [transaction]
    );
    if (receipt) {
      return TransactionState.Sent;
    } else {
      return TransactionState.Failed;
    }
  } catch (e) {
    console.log(e);
    return TransactionState.Rejected;
  }
}

async function sendTransactionViaWallet(transaction) {
  if (transaction.value) {
    transaction.value = BigNumber.from(transaction.value);
  }
  const txRes = await wallet.sendTransaction(transaction);

  let receipt = null;
  const provider = getWalletProvider();
  if (!provider) {
    return TransactionState.Failed;
  }

  while (receipt === null) {
    try {
      receipt = await provider.getTransactionReceipt(txRes.hash);

      if (receipt === null) {
        continue;
      }
    } catch (e) {
      console.log(`Receipt error:`, e);
      break;
    }
  }

  // Transaction was successful if status === 1
  if (receipt) {
    return TransactionState.Sent;
  } else {
    return TransactionState.Failed;
  }
}
