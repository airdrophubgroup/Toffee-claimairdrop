require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { ethers } = require('ethers');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI);

// Schemas
const User = mongoose.model('User', new mongoose.Schema({
    address: { type: String, unique: true },
    lastMined: { type: Number, default: 0 },
    streakCount: { type: Number, default: 0 }
}));

const ToffeeCode = mongoose.model('ToffeeCode', new mongoose.Schema({
    code: { type: String, unique: true },
    isUsed: { type: Boolean, default: false },
    reward: { type: Number, default: 500 }
}));

const wallet = new ethers.Wallet(process.env.SIGNER_PRIVATE_KEY);

// Claim Toffee API
app.post('/api/claim-toffee', async (req, res) => {
    const { userAddress, code } = req.body;
    const codeData = await ToffeeCode.findOne({ code, isUsed: false });
    if (!codeData) return res.status(400).json({ error: "Invalid Code" });

    const amountInWei = ethers.parseUnits(codeData.reward.toString(), 18);
    const messageHash = ethers.solidityPackedKeccak256(["address", "uint256", "string"], [userAddress, amountInWei, code]);
    const signature = await wallet.signMessage(ethers.getBytes(messageHash));

    codeData.isUsed = true;
    await codeData.save();
    res.json({ signature, amount: amountInWei.toString(), code });
});

// Admin Code Generator API
app.post('/api/admin/generate', async (req, res) => {
    const { count, password } = req.body;
    if (password !== process.env.ADMIN_SECRET) return res.status(401).send("Unauthorized");
    
    let codes = [];
    for(let i=0; i<count; i++) {
        const c = `HGNVH-${Math.random().toString(36).substring(2,7).toUpperCase()}`;
        codes.push({ code: c });
    }
    await ToffeeCode.insertMany(codes);
    res.json({ success: true, codes });
});

app.listen(5000, () => console.log("Backend Live"));
