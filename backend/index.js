// backend/index.js

const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS"; 
const abi = ["function claim() external"];

const connectButton = document.getElementById('connectButton');
const statusText = document.getElementById('status');
const walletDisplay = document.getElementById('walletAddress');

let web3Modal;
let provider;
let signer;

// 1. Initialize Web3Modal
function init() {
    const providerOptions = {
        walletconnect: {
            package: window.WalletConnectProvider.default,
            options: {
                // WalletConnect project ID (Aap walletconnect.com se free le sakte hain)
                // Abhi ke liye ye test ID hai:
                rpc: {
                    1: "https://mainnet.infura.io/v3/YOUR_INFURA_KEY", 
                    // World Chain RPC yahan add karein
                }
            }
        }
    };

    web3Modal = new window.Web3Modal.default({
        cacheProvider: false, 
        providerOptions,
        theme: "dark"
    });
}

// 2. Connect Wallet Function
async function onConnect() {
    try {
        // Ye line professional popup dikhayegi
        provider = await web3Modal.connect();
        const library = new ethers.providers.Web3Provider(provider);
        const accounts = await library.listAccounts();
        signer = library.getSigner();
        const address = accounts[0];

        // UI Updates
        statusText.innerText = "Connected! 🎉";
        walletDisplay.innerText = address;
        walletDisplay.style.display = "block";
        connectButton.innerText = "Claim Now";
        connectButton.style.background = "#bb86fc";
        
        // Switch function to claim
        connectButton.onclick = claimTokens;

    } catch (e) {
        console.log("Could not get a wallet connection", e);
    }
}

async function claimTokens() {
    try {
        const contract = new ethers.Contract(contractAddress, abi, signer);
        connectButton.disabled = true;
        connectButton.innerText = "Confirming...";
        
        const tx = await contract.claim();
        await tx.wait();
        
        alert("Airdrop Claimed Successfully!");
        connectButton.innerText = "Claimed ✅";
    } catch (error) {
        alert("Error: " + error.message);
        connectButton.disabled = false;
        connectButton.innerText = "Try Again";
    }
}

window.addEventListener('load', () => {
    init();
    connectButton.onclick = onConnect;
});
