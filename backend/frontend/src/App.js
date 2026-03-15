import React, { useState } from 'react';
import { ethers } from 'ethers';
import confetti from 'canvas-confetti';

function App() {
  const [address, setAddress] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  // World Chain ID: 480 (Hex: 0x1e0)
  const WORLD_CHAIN_ID = "0x1e0";

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        
        // Network Switch karne ki koshish (World Chain par)
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: WORLD_CHAIN_ID }],
          });
        } catch (switchError) {
          // Agar wallet mein network added nahi hai toh
          console.log("Adding World Chain to wallet...");
        }

        const accs = await provider.send("eth_requestAccounts", []);
        setAddress(accs[0]);
      } catch (error) {
        alert("Connection failed: " + error.message);
      }
    } else {
      alert("Wallet not found! Please use Bitget or MetaMask browser.");
    }
  };

  const claim = async () => {
    if (!address || !code) {
      alert("Pehle wallet connect karein aur code daalein!");
      return;
    }

    setLoading(true);
    try {
      // API URL check: Agar env nahi hai toh relative path use karega
      const apiUrl = process.env.REACT_APP_API_URL || ""; 
      
      const res = await fetch(`${apiUrl}/api/claim-toffee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAddress: address, code: code.trim() })
      });

      const data = await res.json();

      if (data.success) {
        confetti({ particleCount: 150, spread: 70 });
        alert("Success! Tokens aapke wallet mein bhej diye gaye hain. Hash: " + data.txHash);
      } else {
        alert("Error: " + (data.error || data.message || "Kuch galat hua"));
      }
    } catch (err) {
      console.error("Claim Error:", err);
      alert("Backend se connect nahi ho paa raha!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', textAlign: 'center', padding: '50px', fontFamily: 'Arial' }}>
      <h1>HGNVH World Chain 🍬</h1>
      
      <div style={{ margin: '20px' }}>
        <button 
          onClick={connectWallet} 
          style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: address ? '#2ecc71' : '#3498db', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          {address ? `Connected: ${address.substring(0,6)}...${address.substring(38)}` : "Connect Wallet"}
        </button>
      </div>

      <br />
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
        <input 
          placeholder="Enter Toffee Code (e.g. TF-123)" 
          value={code}
          onChange={(e) => setCode(e.target.value)} 
          style={{ padding: '12px', borderRadius: '8px', width: '250px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }}
        />
        
        <button 
          onClick={claim} 
          disabled={loading}
          style={{ 
            padding: '12px 30px', 
            borderRadius: '8px', 
            cursor: loading ? 'not-allowed' : 'pointer',
            backgroundColor: '#e74c3c',
            color: 'white',
            fontWeight: 'bold',
            border: 'none'
          }}
        >
          {loading ? "Processing..." : "Claim Coins 🍬"}
        </button>
      </div>
    </div>
  );
}

export default App;
