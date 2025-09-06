import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying KreediaContract to Sepolia");
  console.log("=" .repeat(50));

  const [deployer] = await ethers.getSigners();
  console.log("👤 Deployer:", deployer.address);
  
  const balance = await deployer.provider!.getBalance(deployer.address);
  console.log("💰 Balance:", ethers.formatEther(balance), "ETH");

  // Deploy KreediaContract
  console.log("\n📦 Deploying KreediaContract...");
  const KreediaContract = await ethers.getContractFactory("KreediaContract");
  const kreedia = await KreediaContract.deploy(deployer.address);
  await kreedia.waitForDeployment();
  
  const contractAddress = await kreedia.getAddress();
  console.log("✅ KreediaContract deployed at:", contractAddress);
  
  console.log("\n🔍 View on Etherscan:");
  console.log(`https://sepolia.etherscan.io/address/${contractAddress}`);
  
  console.log("\n🔧 To verify the contract:");
  console.log(`npx hardhat verify --network sepolia ${contractAddress} "${deployer.address}"`);
  
  console.log("\n🌐 Connect to Kreedia.eth ENS:");
  console.log("1. Go to: https://app.ens.domains/kreedia.eth");
  console.log("2. Set Address record to:", contractAddress);
  console.log("3. Add text records for website, social media, etc.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment error:", error);
    process.exit(1);
  });
