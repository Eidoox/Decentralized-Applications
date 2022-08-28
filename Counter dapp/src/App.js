import './App.css';
import { useState } from 'react';
import { ethers, providers } from 'ethers';
import { waitForElementToBeRemoved } from '@testing-library/react';

function App() {
  const [WalletAddress, SetWalletAddress] = useState("");
  const [BalanceOfAddress, SetBalanceOfAddress] = useState();
  const [GreetString, SetGreetString] = useState("");
  const [BalanceStatement, SetBalanceStatement] = useState("");
  const [Counter, SetCounter] = useState();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer =  provider.getSigner();
  
  ///// Function to connect with wallet and get the connected address msg.sender
  async function connectwallet () {
    if (window.ethereum){
      try {
        await provider.send("eth_requestAccounts",[]);
        const connected_address= await signer.getAddress();
        const balance = await signer.getBalance();
        SetWalletAddress(connected_address);
        SetBalanceOfAddress (balance.toString()/1e18);
        document.getElementById('connectwallet').innerHTML =  "Connected";
        SetGreetString("Welcome");
        SetBalanceStatement("Your balance is: ");
      } catch(error){
        console.log("metmask not worked, try again please!!");
      }
    }
    else{
      alert("Metamask Not installed");
    }
  }

  ///// Function to connect with the smart contract after deploying it and increase the counter
  async function ConnectContract (choice) {

    const contractaddress = '0x759448431424419Af1D5F9dBe079BCe6Efe00D6D';
    const contractabi = [
      {
        "inputs": [],
        "name": "DecreaseMyCounter",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "IncreaseMyCounter",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "inputs": [],
        "name": "GetMyCounter",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "_counter",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ];

    try{
      const connectwithcontract = new ethers.Contract(contractaddress, contractabi, signer);
      if  (choice == 1 ){
        await connectwithcontract.IncreaseMyCounter();

      }
      else if  (choice == 2){
        await connectwithcontract.DecreaseMyCounter();

      }
      else if  (choice == 3){
        const counter = await connectwithcontract.GetMyCounter();
        console.log(counter.toString());

      }
    }
    catch (error){
      console.log(error);
      alert("User rejected transacation");
    
    }

  } 

  return (
    <div className="App">
      <button id='connectwallet' onClick={connectwallet}> Connect Wallet</button> <br></br>
      <br></br> 
      <h2 >{GreetString}</h2>
      <h2 >{WalletAddress}</h2>
      <h2 >{BalanceStatement}{BalanceOfAddress}</h2>
      <br></br> 
      <button id='increasecounter' onClick={() => { ConnectContract(1); }} > Increase counter</button>
      <button id='showcounter' onClick={() => { ConnectContract(3); }}> Show counter</button>
      <button id='decreasecounter' onClick={() => { ConnectContract(2); }}> Decrease counter</button>
      
    </div>
  );
}

export default App;
