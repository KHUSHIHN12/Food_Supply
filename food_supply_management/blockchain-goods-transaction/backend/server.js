const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");

const app = express();
const frontendDir = path.join(__dirname, "..", "frontend");
const contractConfigPath = path.join(__dirname, "contract-config.json");
const rpcUrl = process.env.GANACHE_RPC_URL || "http://127.0.0.1:7545";

app.use(cors());
app.use(express.json());
app.use(express.static(frontendDir));

app.get("/api/contract", (req, res) => {
  if (!fs.existsSync(contractConfigPath)) {
    return res.status(404).json({
      error: "Contract not deployed yet. Run the Ganache deployment script first."
    });
  }

  const contractConfig = JSON.parse(fs.readFileSync(contractConfigPath, "utf8"));
  return res.json(contractConfig);
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/accounts", async (req, res) => {
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const accounts = await provider.send("eth_accounts", []);
    res.json(accounts);
  } catch (error) {
    res.status(500).json({
      error: "Unable to fetch Ganache accounts.",
      details: error.message
    });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendDir, "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
