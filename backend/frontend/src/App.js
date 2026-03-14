import React, { useState } from 'react';
import { ethers } from 'ethers';
import confetti from 'canvas-confetti';

function App() {
  const [address, setAddress] = useState("");
  const [code, setCode] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accs = await provider.send("eth_requestAccounts", []);
      setAddress(accs[0]);
    }
  };

  const claim = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/claim-toffee`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ userAddress: address, code })
    });
    const data = await res.json();
    if (data.signature) {
      confetti({ particleCount: 150, spread: 70 });
      alert("Success! Now sign in Metamask to receive coins.");
    } else {
      alert(data.error);
    }
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', textAlign: 'center', padding: '50px' }}>
      <h1>HGNVH World Chain 🍬</h1>
      <button onClick={connectWallet}>{address ? address : "Connect Wallet"}</button>
      <br /><br />
      <input 
        placeholder="Toffee Code" 
        onChange={(e) => setCode(e.target.value)} 
        style={{ padding: '10px', borderRadius: '8px' }}
      />
      <button onClick={claim} style={{ marginLeft: '10px' }}>Claim Coins</button>
    </div>
  );
}
export default App;
