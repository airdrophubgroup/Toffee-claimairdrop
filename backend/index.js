// backend/index.js

const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS"; 
const abi = ["function claim() external"];

const connectButton = document.getElementById('connectButton');
const statusText = document.getElementById('status');

let web3Modal;

function checkLibraries() {
    if (window.ethers && window.Web3Modal) {
        console.log("Libraries loaded!");
        statusText.innerText = "Libraries Ready ✅";
        connectButton.innerText = "Select Wallet";
        connectButton.disabled = false;
        initModal();
    } else {
        console.log("Retrying library check...");
        setTimeout(checkLibraries, 1000); // Har 1 second mein check karega
    }
}

function initModal() {
    const providerOptions = {
        walletconnect: {
            package: window.WalletConnectProvider ? window.WalletConnectProvider.default : null,
            options: {
                rpc: { 480: "https://worldchain-mainnet.g.alchemy.com/public" }
            }
        }
    };

    web3Modal = new window.Web3Modal.default({
        cacheProvider: false,
        providerOptions,
        theme: "dark"
    });

    connectButton.onclick = onConnect;
}

async function onConnect() {
    try {
        const provider = await web3Modal.connect();
        const ethersLib = window.ethers;
        const library = new ethersLib.providers.Web3Provider(provider);
        const accounts = await library.listAccounts();
        const signer = library.getSigner();

        statusText.innerText = "Connected: " + accounts[0].substring(0, 6) + "...";
        connectButton.innerText = "Claim Now";
        connectButton.onclick = () => claimTokens(ethersLib, signer);
    } catch (e) {
        console.error(e);
    }
}

async function claimTokens(ethersLib, signer) {
    try {
        const contract = new ethersLib.Contract(contractAddress, abi, signer);
        connectButton.disabled = true;
        connectButton.innerText = "Confirming...";
        const tx = await contract.claim();
        await tx.wait();
        alert("Claimed Successfully!");
        connectButton.innerText = "Claimed ✅";
    } catch (error) {
        alert("Error: " + error.message);
        connectButton.disabled = false;
    }
}

// Start checking when page loads
window.addEventListener('DOMContentLoaded', () => {
    connectButton.disabled = true;
    checkLibraries();
});
