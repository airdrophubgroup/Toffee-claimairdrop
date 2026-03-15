// index.js
console.log("Toffee Web3 Script Loaded!");

const connectButton = document.getElementById('connectButton');
const statusText = document.getElementById('status');
const walletDisplay = document.getElementById('walletAddress');

async function connectWallet() {
    console.log("Attempting to connect...");
    
    if (typeof window.ethereum !== 'undefined') {
        try {
            // 1. Request accounts
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            
            // 2. Double check if accounts array is not empty
            if (accounts.length > 0) {
                const account = accounts[0];
                console.log("Connected Successfully:", account);
                
                // UI Updates
                statusText.innerText = "Wallet Connected ✅";
                walletDisplay.innerText = account;
                connectButton.innerText = "Check Eligibility";
                connectButton.style.background = "#bb86fc";
                
                // Fix for the 'undefined' alert
                alert("Success! Wallet connected: " + account);
            } else {
                // If accounts array is empty, try a fallback
                const fallbackAccounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (fallbackAccounts.length > 0) {
                    alert("Success! Wallet connected: " + fallbackAccounts[0]);
                } else {
                    alert("No accounts found. Please unlock MetaMask.");
                }
            }
            
        } catch (error) {
            console.error("Connection Error:", error);
            if (error.code === 4001) {
                alert("Please connect your wallet to continue.");
            } else {
                alert("Error: " + error.message);
            }
        }
    } else {
        alert("MetaMask not found! Please install MetaMask extension.");
    }
}

// Ensure button is ready
window.addEventListener('load', () => {
    if (connectButton) {
        connectButton.onclick = connectWallet;
        console.log("Button Listener Attached.");
    }
});
