require("@nomicfoundation/hardhat-ethers");
require("dotenv").config();

const ganacheUrl = process.env.GANACHE_RPC_URL || "http://127.0.0.1:7545";
const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY;

module.exports = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      url: ganacheUrl,
      chainId: Number(process.env.GANACHE_CHAIN_ID || 1337),
      accounts: deployerPrivateKey ? [deployerPrivateKey] : []
    }
  }
};
