// Check karein ki browser mein MetaMask (Ethereum) hai ya nahi
const connectButton = document.getElementById('connectButton');
const statusText = document.querySelector('p');

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // User se permission mangein wallet connect karne ki
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            
            // Pehla account lein
            const account = accounts[0];
            
            // UI Update karein
            statusText.innerText = `Connected: ${account.substring(0, 6)}...${account.substring(account.length - 4)}`;
            connectButton.innerText = "Wallet Connected ✅";
            connectButton.style.background = "#4CAF50"; // Green color
            
            console.log("Connected account:", account);
        } catch (error) {
            console.error("User rejected connection", error);
            alert("Connection rejected by user.");
        }
    } else {
        // Agar MetaMask installed nahi hai
        alert("MetaMask not found! Please install MetaMask extension.");
        window.open("https://metamask.io/download/", "_blank");
    }
}

// Button par click event listener lagayein
connectButton.addEventListener('click', connectWallet);

// Agar user account switch kare toh page refresh ho jaye (Best Practice)
if (window.ethereum) {
    window.ethereum.on('accountsChanged', () => {
        window.location.reload();
    });
}
