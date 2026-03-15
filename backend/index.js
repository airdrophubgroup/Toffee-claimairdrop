// 1. Contract ki details (Inhe badalna zaroori hai)
const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS"; // Deploy karne ke baad yahan address daalein
const abi = [ 
    "function claim() external",
    "function hasClaimed(address) view returns (bool)" 
]; // Ye simple ABI hai jo claim function ke liye kaafi hai

const connectButton = document.getElementById('connectButton');
const statusText = document.getElementById('status');
const walletDisplay = document.getElementById('walletAddress');

let userAccount = "";

// Connection Function
async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = accounts[0];
            
            // UI Updates
            statusText.innerText = "Wallet Connected ✅";
            walletDisplay.innerText = userAccount;
            
            // Ab button ka kaam badal kar "Claim Tokens" kar dete hain
            connectButton.innerText = "Claim Airdrop Now";
            connectButton.style.background = "#bb86fc";
            
            // Button ka click event badal kar claimTokens function par set karein
            connectButton.onclick = claimTokens;
            
            console.log("Connected:", userAccount);
        } catch (error) {
            alert("Connection failed: " + error.message);
        }
    } else {
        alert("MetaMask not found!");
    }
}

// Claim Function (Naya function jo aapne pucha tha)
async function claimTokens() {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        
        // Contract ke saath connection
        const contract = new ethers.Contract(contractAddress, abi, signer);

        statusText.innerText = "Processing Claim... Please wait.";
        connectButton.disabled = true;
        connectButton.innerText = "Sending Transaction...";

        // Contract ka claim function call karna
        const tx = await contract.claim();
        console.log("Transaction Hash:", tx.hash);
        
        alert("Transaction sent! Hash: " + tx.hash);

        // Transaction confirm hone ka wait karein
        await tx.wait();
        
        statusText.innerText = "Tokens Claimed Successfully! 🎉";
        connectButton.innerText = "Claimed ✅";
        alert("Congratulations! Tokens have been sent to your wallet.");

    } catch (error) {
        console.error(error);
        statusText.innerText = "Claim Failed ❌";
        connectButton.disabled = false;
        connectButton.innerText = "Try Claim Again";
        alert("Error: " + (error.data?.message || error.message));
    }
}

// Initial Listener
window.addEventListener('load', () => {
    if (connectButton) {
        connectButton.onclick = connectWallet;
    }
});
