import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying Kreedia Unified Contract to Sepolia");
  console.log("=" .repeat(60));

  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  
  console.log("📍 Network:", network.name, `(Chain ID: ${network.chainId})`);
  console.log("👤 Deployer:", deployer.address);
  
  const balance = await deployer.provider!.getBalance(deployer.address);
  console.log("💰 Balance:", ethers.formatEther(balance), "ETH");

  if (balance === 0n) {
    console.log("\n❌ No ETH balance! Get testnet funds from:");
    console.log("🚰 https://sepoliafaucet.com/");
    console.log("🚰 https://faucets.chain.link/");
    return;
  }

  try {
    // Deploy Mock ERC20 for testing (USDC-like token)
    console.log("\n📦 Deploying Mock USDC...");
    const ERC20Mock = await ethers.getContractFactory("contracts/mocks/ERC20Mock.sol:ERC20Mock");
    const mockTokenDeployment = await ERC20Mock.deploy("Test USDC", "TUSDC", 6, deployer.address); // 6 decimals like real USDC
    await mockTokenDeployment.waitForDeployment();
    const mockTokenAddress = await mockTokenDeployment.getAddress();
    const mockToken = await ethers.getContractAt("contracts/mocks/ERC20Mock.sol:ERC20Mock", mockTokenAddress);
    console.log("✅ Mock USDC deployed:", mockTokenAddress);

    // Deploy KreediaContract
    console.log("\n📦 Deploying KreediaContract...");
    const KreediaContractFactory = await ethers.getContractFactory("KreediaContract");
    const kreediaDeployment = await KreediaContractFactory.deploy(deployer.address);
    await kreediaDeployment.waitForDeployment();
    const kreediaAddress = await kreediaDeployment.getAddress();
    const kreedia = await ethers.getContractAt("KreediaContract", kreediaAddress);
    console.log("✅ KreediaContract deployed:", kreediaAddress);

    // Configure contract
    console.log("\n⚙️  Configuring contract...");
    await kreedia.addToken(mockTokenAddress);
    console.log("✅ Added mock USDC to accepted tokens");

    // Mint some test tokens
    const testAmount = ethers.parseUnits("10000", 6); // 10,000 TUSDC
    await mockToken.mint(deployer.address, testAmount);
    console.log("✅ Minted 10,000 TUSDC for testing");

    // Save deployment info
    const deploymentInfo = {
      network: "Sepolia",
      chainId: Number(network.chainId),
      deployer: deployer.address,
      timestamp: new Date().toISOString(),
      contracts: {
        kreediaContract: kreediaAddress,
        mockToken: mockTokenAddress
      },
      ensSetup: {
        domain: "kreedia.eth",
        resolver: "0x0227628f3F023bb0B980b67D528571c95c6DaC1c", // Sepolia Public Resolver
        instructions: "Use ENS app to set contract address as resolver"
      }
    };

    console.log("\n🎉 Deployment Complete!");
    console.log("=" .repeat(60));
    console.log("📄 Contract Addresses:");
    console.log("   Kreedia Contract:   ", kreediaAddress);
    console.log("   Mock USDC:          ", mockTokenAddress);
    
    console.log("\n🔍 View on Etherscan:");
    console.log(`   Kreedia: https://sepolia.etherscan.io/address/${kreediaAddress}`);
    console.log(`   Token:   https://sepolia.etherscan.io/address/${mockTokenAddress}`);

    console.log("\n🌐 ENS Configuration:");
    console.log("=" .repeat(60));
    console.log("📝 To connect Kreedia.eth to your contract:");
    console.log("1. Go to: https://app.ens.domains/");
    console.log("2. Connect wallet that owns kreedia.eth");
    console.log("3. Search for 'kreedia.eth' and click on it");
    console.log("4. Go to 'Records' tab");
    console.log("5. Add/Edit these records:");
    console.log(`   • Contract Address: ${kreediaAddress}`);
    console.log("   • Website: https://kreedia.org");
    console.log("   • Email: contact@kreedia.org");
    console.log("   • Description: Decentralized Environmental Impact Platform");
    console.log("   • Keywords: ReFi, Environmental, Carbon, Impact, DeFi");
    console.log("6. Save changes (requires transaction)");

    console.log("\n🔧 Technical ENS Setup:");
    console.log("=" .repeat(60));
    console.log("Contract Address Record:");
    console.log(`   Key: 'address'`);
    console.log(`   Value: ${kreediaAddress}`);
    console.log("\nText Records to add:");
    console.log(`   url: https://kreedia.org`);
    console.log(`   email: contact@kreedia.org`);
    console.log(`   description: Decentralized Environmental Impact Platform`);
    console.log(`   com.github: Kreedia-Organization`);
    console.log(`   com.twitter: @KreedApp`);

    console.log("\n🧪 Next Steps:");
    console.log("1. Configure ENS records (see above)");
    console.log("2. Test contract functionality:");
    console.log("   npx hardhat run scripts/demo-complete-workflow.ts --network sepolia");
    console.log("3. Verify contract on Etherscan:");
    console.log("   npx hardhat verify --network sepolia", kreediaAddress, deployer.address);

    // Create deployments directory if it doesn't exist
    const fs = require("fs");
    const path = require("path");
    const deploymentsDir = "./deployments";
    
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir);
    }

    // Write deployment file
    fs.writeFileSync(
      path.join(deploymentsDir, "sepolia-deployment.json"),
      JSON.stringify(deploymentInfo, null, 2)
    );
    console.log("\n💾 Deployment info saved to: ./deployments/sepolia-deployment.json");

  } catch (error: any) {
    console.log("\n❌ Deployment failed:", error.message);
    
    if (error.message.includes("insufficient funds")) {
      console.log("\n🚰 Get more Sepolia ETH from:");
      console.log("   • https://sepoliafaucet.com/");
      console.log("   • https://faucets.chain.link/");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment error:", error);
    process.exit(1);
  });
