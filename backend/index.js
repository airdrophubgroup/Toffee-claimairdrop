console.log("JS file successfully loaded!"); // Ye check karne ke liye ki file link hui ya nahi

// Function jo wallet connect karega
async function connectWallet() {
    console.log("Connect button was clicked!");
    
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            
            // UI Update
            document.querySelector('p').innerText = `Connected: ${account.substring(0, 6)}...${account.substring(account.length - 4)}`;
            const btn = document.getElementById('connectButton');
            btn.innerText = "Connected ✅";
            btn.style.background = "#4CAF50";
            
            console.log("Wallet Connected:", account);
        } catch (error) {
            console.error("User rejected the request", error);
        }
    } else {
        alert("MetaMask not found. Please install MetaMask!");
    }
}

// Button par click event lagane ka sahi tarika (DOMContentLoaded)
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('connectButton');
    if (btn) {
        btn.addEventListener('click', connectWallet);
        console.log("Event listener attached to button.");
    } else {
        console.error("Error: Button with ID 'connectButton' not found!");
    }
});
