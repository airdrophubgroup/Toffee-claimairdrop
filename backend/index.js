// backend/index.js

const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS"; 
const abi = ["function claim() external", "function hasClaimed(address) view returns (bool)"];

const connectButton = document.getElementById('connectButton');
const statusText = document.getElementById('status');
const walletDisplay = document.getElementById('walletAddress');

let userAccount = "";

// Ye function kisi bhi injected wallet (Trust, MetaMask, Phantom) ko dhoond lega
async function connectAnyWallet() {
    // 1. Check if any wallet is available
    if (window.ethereum) {
        try {
            statusText.innerText = "Opening wallet selection...";
            
            // Ye automatically user ke default wallet (jo bhi chrome/mobile mein hai) ko kholega
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = accounts[0];

            statusText.innerText = "Wallet Connected! 🎉";
            walletDisplay.innerText = userAccount;
            walletDisplay.style.display = "block";
            
            connectButton.innerText = "Claim Airdrop Now";
            connectButton.style.background = "#bb86fc";
            connectButton.onclick = claimTokens;

        } catch (error) {
            console.error(error);
            statusText.innerText = "Connection failed. Try again.";
            alert("Connection Error: " + error.message);
        }
    } else {
        // Agar mobile par hai aur wallet nahi mila toh deep link use karein
        alert("No crypto wallet found! If you are on mobile, please open this site inside Trust Wallet or World App browser.");
        window.open("https://metamask.app.link/dapp/" + window.location.hostname);
    }
}

async function claimTokens() {
    const ethers = window.ethers;
    if (!ethers) return alert("Ethers library missing!");

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        connectButton.disabled = true;
        connectButton.innerText = "Confirm in Wallet...";
        
        const tx = await contract.claim();
        statusText.innerText = "Transaction pending...";
        await tx.wait();

        statusText.innerText = "Success! Tokens Sent. 🎉";
        connectButton.innerText = "Claimed ✅";
    } catch (error) {
        console.error(error);
        connectButton.disabled = false;
        connectButton.innerText = "Try Again";
        alert("Error: " + (error.data?.message || error.message));
    }
}

window.addEventListener('load', () => {
    if (connectButton) {
        connectButton.onclick = connectAnyWallet;
    }
});
