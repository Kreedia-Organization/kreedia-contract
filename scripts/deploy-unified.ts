import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying Kreedia Unified Contract (Payment + NFT)");
  console.log("=" .repeat(60));

  const signers = await ethers.getSigners();
  if (signers.length === 0) {
    console.log("❌ No signers available");
    console.log("📋 Setup .env file with PRIVATE_KEY and get Base Sepolia ETH");
    return;
  }

  const deployer = signers[0];
  const network = await ethers.provider.getNetwork();
  
  console.log("📍 Network:", `Base Sepolia (Chain ID: ${network.chainId})`);
  console.log("👤 Deployer:", deployer.address);
  
  const balance = await deployer.provider!.getBalance(deployer.address);
  console.log("💰 Balance:", ethers.formatEther(balance), "ETH");

  if (balance === 0n) {
    console.log("\n❌ No ETH! Get testnet funds from:");
    console.log("🚰 https://portal.cdp.coinbase.com/products/faucet");
    return;
  }

  // ENS Registry placeholder for Base Sepolia
  const ensRegistryAddress = "0x1111111111111111111111111111111111111111";
  console.log("🔗 ENS Registry (placeholder):", ensRegistryAddress);

  try {
    // Deploy Mock ERC20 for testing
    console.log("\n📦 Deploying Mock ERC20...");
    const ERC20Mock = await ethers.getContractFactory("contracts/mocks/ERC20Mock.sol:ERC20Mock");
    const mockToken = await ERC20Mock.deploy("Test USDC", "TUSDC", "18", deployer.address);
    await mockToken.waitForDeployment();
    const mockTokenAddress = await mockToken.getAddress();
    console.log("✅ Mock USDC deployed:", mockTokenAddress);

    // Deploy Unified Kreedia Contract
    console.log("\n📦 Deploying KreediaUnifiedSimple Contract...");
    const KreediaUnified = await ethers.getContractFactory("KreediaUnifiedSimple");
    const kreediaUnified = await KreediaUnified.deploy(deployer.address);
    await kreediaUnified.waitForDeployment();
    const unifiedAddress = await kreediaUnified.getAddress();
    console.log("✅ KreediaUnifiedSimple deployed:", unifiedAddress);

    // Configure contract
    console.log("\n⚙️  Configuring unified contract...");
    const kreediaContract = await ethers.getContractAt("KreediaUnifiedSimple", unifiedAddress);
    await kreediaContract.addToken(mockTokenAddress);
    console.log("✅ Added mock token to unified contract");

    // Mint test tokens
    console.log("\n💰 Minting test tokens...");
    const mintAmount = ethers.parseUnits("1000", 18);
    const mockTokenContract = await ethers.getContractAt(
      "contracts/mocks/ERC20Mock.sol:ERC20Mock", 
      mockTokenAddress
    );
    await mockTokenContract.mint(deployer.address, mintAmount);
    console.log(`✅ Minted ${ethers.formatUnits(mintAmount, 18)} TUSDC for testing`);

    // Save deployment info
    const deploymentInfo = {
      network: "Base Sepolia",
      chainId: Number(network.chainId),
      deployer: deployer.address,
      timestamp: new Date().toISOString(),
      contracts: {
        kreediaUnified: unifiedAddress,
        mockToken: mockTokenAddress
      },
      ensRegistry: ensRegistryAddress,
      features: [
        "Payment processing",
        "NFT minting", 
        "Mission management",
        "ENS integration",
        "Reward distribution"
      ]
    };

    console.log("\n🎉 Unified Contract Deployment Complete!");
    console.log("=" .repeat(60));
    console.log("📄 Contract Address:");
    console.log("   🎯 KreediaUnified:     ", unifiedAddress);
    console.log("   💰 Mock Token:         ", mockTokenAddress);
    console.log("   🔗 ENS Registry:       ", ensRegistryAddress, "(placeholder)");
    
    console.log("\n🔍 View on BaseScan:");
    console.log(`   Unified Contract: https://sepolia.basescan.org/address/${unifiedAddress}`);
    console.log(`   Mock Token:       https://sepolia.basescan.org/address/${mockTokenAddress}`);

    console.log("\n🎯 Frontend Integration:");
    console.log("✅ Single contract address for everything:");
    console.log(`   const KREEDIA_CONTRACT = "${unifiedAddress}"`);
    console.log("✅ Functions available:");
    console.log("   • createMission() - Lock funds + mint BEFORE NFT");
    console.log("   • completeMission() - Mint AFTER NFT + distribute rewards");
    console.log("   • getMissionDetails() - Check mission status");
    console.log("   • getUserENSName() - ENS integration");
    console.log("   • hasUserMissionNFT() - Check NFT ownership");

    console.log("\n🧪 Test the unified contract:");
    console.log("   npx hardhat run scripts/test-unified-contract.ts --network baseSepolia");

    // Write deployment file
    const fs = require("fs");
    if (!fs.existsSync("./deployments")) {
      fs.mkdirSync("./deployments");
    }
    fs.writeFileSync(
      "./deployments/kreedia-unified-deployment.json",
      JSON.stringify(deploymentInfo, null, 2)
    );
    console.log("\n💾 Deployment saved: ./deployments/kreedia-unified-deployment.json");

  } catch (error: any) {
    console.log("\n❌ Deployment failed:", error.message);
    
    if (error.message.includes("insufficient funds")) {
      console.log("\n🚰 Get more Base Sepolia ETH from:");
      console.log("   • https://portal.cdp.coinbase.com/products/faucet");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment error:", error);
    process.exit(1);
  });
