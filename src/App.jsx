import { useRef, useState } from "react";
import "./App.css";
import { quote } from "./assets/libs/Quoting";
import { executeTrade, createTrade } from "./assets/libs/Trading";
// import { ConnectButton } from "@web3uikit/web3";

function App() {
  let [trade, setTrade] = useState();
  let inputVal = useRef(null);
  let [expectedVal, setExpectedVal] = useState(0);

  async function handleInputChange() {
    let value = inputVal.current.value;
    console.log(inputVal.current.value);
    let quoteAmount = await quote(value);
    console.log(quoteAmount);
    setExpectedVal(quoteAmount);
  }
  async function handleSwap() {
    setTrade(await createTrade(inputVal.current.value));
    await executeTrade(trade);
  }

  return (
    <>
      <div>Uniswap Clone</div>
      <div>
        <h1>This app converts ETH to DAI</h1>
        {/* <ConnectButton /> */}
      </div>
      <div className="uniswap-form">
        <div className="form-element">
          <label for="input1">Token 1</label>
          <input
            type="text"
            id="input1"
            placeholder="0.0"
            ref={inputVal}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-element">
          <label for="input2">Token 2</label>
          <input type="text" id="input2" placeholder={expectedVal} />
        </div>
        <button type="submit" onClick={handleSwap}>
          Swap
        </button>
      </div>
    </>
  );
}

export default App;
