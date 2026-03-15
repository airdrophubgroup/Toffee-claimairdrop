// backend/index.js

const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS"; 
const abi = ["function claim() external"];

const connectButton = document.getElementById('connectButton');
const statusText = document.getElementById('status');
const walletDisplay = document.getElementById('walletAddress');

let web3Modal;
let provider;
let signer;

// 1. Library ko dhoondne ka naya tarika
function getEthers() {
    const lib = window.ethers;
    if (!lib) {
        console.error("Ethers NOT found in window object!");
        return null;
    }
    return lib;
}

function init() {
    // Check if libraries are loaded
    if (!window.Web3Modal) {
        console.error("Web3Modal library missing!");
        statusText.innerText = "Error: Libraries not loaded. Please refresh.";
        return;
    }

    const providerOptions = {
        walletconnect: {
            package: window.WalletConnectProvider ? window.WalletConnectProvider.default : null,
            options: {
                // World Chain ke liye RPC URL
                rpc: {
                    480: "https://worldchain-mainnet.g.alchemy.com/public" 
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

async function onConnect() {
    const ethersLib = getEthers();
    if (!ethersLib) {
        alert("Ethers library is still loading. Please wait 2 seconds and try again.");
        return;
    }

    try {
        provider = await web3Modal.connect();
        const library = new ethersLib.providers.Web3Provider(provider);
        const accounts = await library.listAccounts();
        signer = library.getSigner();
        
        const address = accounts[0];
        statusText.innerText = "Connected! 🎉";
        walletDisplay.innerText = address;
        walletDisplay.style.display = "block";
        connectButton.innerText = "Claim Now";
        connectButton.style.background = "#bb86fc";
        
        connectButton.onclick = claimTokens;
    } catch (e) {
        console.log("Connection closed", e);
    }
}

async function claimTokens() {
    const ethersLib = getEthers();
    try {
        const contract = new ethersLib.Contract(contractAddress, abi, signer);
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

// Ensure libraries are ready
window.addEventListener('load', () => {
    // Thoda delay taaki sari scripts load ho jayein
    setTimeout(() => {
        init();
        if (connectButton) connectButton.onclick = onConnect;
    }, 1000); 
});
