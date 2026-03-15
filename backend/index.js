// index.js
console.log("Toffee Web3 Script Loaded!");

const connectButton = document.getElementById('connectButton');
const statusText = document.getElementById('status');
const walletDisplay = document.getElementById('walletAddress');

async function connectWallet() {
    console.log("Attempting to connect...");
    
    if (typeof window.ethereum !== 'undefined') {
        try {
            // MetaMask Pop-up trigger
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            
            console.log("Connected Successfully:", account);
            
            // UI Updates
            statusText.innerText = "Wallet Connected ✅";
            walletDisplay.innerText = account;
            connectButton.innerText = "Check Eligibility";
            connectButton.style.background = "#bb86fc";
            
            alert("Success! Wallet connected: " + account);
            
        } catch (error) {
            console.error("Connection Error:", error);
            if (error.code === 4001) {
                alert("Please connect your wallet to continue.");
            } else {
                alert("An error occurred. Check console.");
            }
        }
    } else {
        alert("MetaMask not found! Please install MetaMask extension.");
        window.open("https://metamask.io/", "_blank");
    }
}

// Ensure button is ready before adding event
window.addEventListener('load', () => {
    if (connectButton) {
        connectButton.onclick = connectWallet;
        console.log("Button Listener Attached.");
    } else {
        console.error("Critical Error: Connect Button not found in HTML!");
    }
});
