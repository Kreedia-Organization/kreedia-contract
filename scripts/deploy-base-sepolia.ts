import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying Kreedia ENS Contracts to Base Sepolia");
  console.log("=" .repeat(60));

  // Check if we have signers available
  const signers = await ethers.getSigners();
  if (signers.length === 0) {
    console.log("❌ No signers available");
    console.log("\n📋 To deploy to Base Sepolia testnet:");
    console.log("1. Create a .env file:");
    console.log("   cp .env.example .env");
    console.log("2. Get a test wallet private key (create new wallet for testing)");
    console.log("3. Get Base Sepolia ETH from:");
    console.log("   • https://portal.cdp.coinbase.com/products/faucet");
    console.log("   • https://thirdweb.com/base-sepolia-testnet");
    console.log("4. Add PRIVATE_KEY to .env file");
    console.log("5. Run: npx hardhat run scripts/deploy-base-sepolia.ts --network baseSepolia");
    return;
  }

  const deployer = signers[0];
  const network = await ethers.provider.getNetwork();
  
  console.log("📍 Network:", network.name, `(Chain ID: ${network.chainId})`);
  console.log("👤 Deployer:", deployer.address);
  
  const balance = await deployer.provider!.getBalance(deployer.address);
  console.log("💰 Balance:", ethers.formatEther(balance), "ETH");

  if (balance === 0n) {
    console.log("\n❌ No ETH balance! Get testnet funds from:");
    console.log("🚰 https://portal.cdp.coinbase.com/products/faucet");
    return;
  }

  // Use placeholder ENS registry for Base Sepolia (no native ENS yet)
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

    // Deploy KreediaPaymentENS
    console.log("\n📦 Deploying KreediaPaymentENS...");
    const KreediaPaymentENS = await ethers.getContractFactory("KreediaPaymentENS");
    const kreediaPaymentENS = await KreediaPaymentENS.deploy(ensRegistryAddress, deployer.address);
    await kreediaPaymentENS.waitForDeployment();
    const paymentAddress = await kreediaPaymentENS.getAddress();
    console.log("✅ KreediaPaymentENS deployed:", paymentAddress);

    // Deploy KreediaNFTENS
    console.log("\n📦 Deploying KreediaNFTENS...");
    const KreediaNFTENS = await ethers.getContractFactory("KreediaNFTENS");
    const kreediaNFTENS = await KreediaNFTENS.deploy(ensRegistryAddress, deployer.address);
    await kreediaNFTENS.waitForDeployment();
    const nftAddress = await kreediaNFTENS.getAddress();
    console.log("✅ KreediaNFTENS deployed:", nftAddress);

    // Configure contracts
    console.log("\n⚙️  Configuring contracts...");
    await kreediaPaymentENS.addToken(mockTokenAddress);
    console.log("✅ Added mock token to payment contract");

    // Save deployment info
    const deploymentInfo = {
      network: "Base Sepolia",
      chainId: Number(network.chainId),
      deployer: deployer.address,
      timestamp: new Date().toISOString(),
      contracts: {
        mockToken: mockTokenAddress,
        kreediaPaymentENS: paymentAddress,
        kreediaNFTENS: nftAddress
      },
      ensRegistry: ensRegistryAddress
    };

    console.log("\n🎉 Deployment Complete!");
    console.log("=" .repeat(60));
    console.log("📄 Contract Addresses:");
    console.log("   Payment Contract:   ", paymentAddress);
    console.log("   NFT Contract:       ", nftAddress);
    console.log("   Mock Token:         ", mockTokenAddress);
    console.log("   ENS Registry:       ", ensRegistryAddress, "(placeholder)");
    
    console.log("\n🔍 View on BaseScan:");
    console.log(`   Payment: https://sepolia.basescan.org/address/${paymentAddress}`);
    console.log(`   NFT:     https://sepolia.basescan.org/address/${nftAddress}`);
    console.log(`   Token:   https://sepolia.basescan.org/address/${mockTokenAddress}`);

    console.log("\n🧪 Next Steps:");
    console.log("1. Test contract functionality:");
    console.log("   npx hardhat run scripts/test-base-deployment.ts --network baseSepolia");
    console.log("2. Mint test tokens and try transactions");
    console.log("3. For full ENS functionality, also deploy to Ethereum Sepolia");

    // Write deployment file
    const fs = require("fs");
    fs.writeFileSync(
      "./deployments/base-sepolia-deployment.json",
      JSON.stringify(deploymentInfo, null, 2)
    );
    console.log("\n💾 Deployment info saved to: ./deployments/base-sepolia-deployment.json");

  } catch (error: any) {
    console.log("\n❌ Deployment failed:", error.message);
    
    if (error.message.includes("insufficient funds")) {
      console.log("\n🚰 Get more Base Sepolia ETH from:");
      console.log("   • https://portal.cdp.coinbase.com/products/faucet");
      console.log("   • https://thirdweb.com/base-sepolia-testnet");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment error:", error);
    process.exit(1);
  });
