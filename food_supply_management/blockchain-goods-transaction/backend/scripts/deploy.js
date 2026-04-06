const fs = require("fs");
const path = require("path");
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  if (!deployer) {
    throw new Error(
      "No deployer signer found. Add DEPLOYER_PRIVATE_KEY to backend/.env using a Ganache account private key."
    );
  }

  console.log(`Deploying with account: ${deployer.address}`);

  const GoodsTransaction = await hre.ethers.getContractFactory("GoodsTransaction", deployer);
  const contract = await GoodsTransaction.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  const artifact = await hre.artifacts.readArtifact("GoodsTransaction");

  const contractConfig = {
    contractName: "GoodsTransaction",
    address,
    abi: artifact.abi,
    network: hre.network.name,
    chainId: hre.network.config.chainId
  };

  const configPath = path.join(__dirname, "..", "contract-config.json");
  fs.writeFileSync(configPath, JSON.stringify(contractConfig, null, 2));

  console.log(`GoodsTransaction deployed to: ${address}`);
  console.log(`Contract config saved to: ${configPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
