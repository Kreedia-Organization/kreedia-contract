import { ethers } from "hardhat";

async function main() {
  console.log("🌐 ENS Setup Guide for Kreedia.eth");
  console.log("=" .repeat(60));

  const contractAddress = "0x624e40fc99bd3C2C27213508740Dc9424530Dc5D";
  const [deployer] = await ethers.getSigners();
  
  console.log("📋 Contract Information:");
  console.log("   ✅ Contract Address:", contractAddress);
  console.log("   ✅ Network: Sepolia Testnet");
  console.log("   ✅ Status: Verified ✓");
  console.log("   🔍 Etherscan:", `https://sepolia.etherscan.io/address/${contractAddress}#code`);
  console.log("   👤 Current Wallet:", deployer.address);

  console.log("\n🔧 ENS CONFIGURATION STEPS:");
  console.log("=" .repeat(60));

  console.log("\n1️⃣  CONNECT TO ENS APP:");
  console.log("   🌐 Go to: https://app.ens.domains/kreedia.eth");
  console.log("   🔑 Connect the wallet that owns kreedia.eth");
  console.log("   📝 Click on 'Records' tab");

  console.log("\n2️⃣  SET CONTRACT ADDRESS:");
  console.log("   Field: Address (ETH)");
  console.log(`   Value: ${contractAddress}`);
  console.log("   💡 This allows users to resolve kreedia.eth to your contract");

  console.log("\n3️⃣  ADD RECOMMENDED TEXT RECORDS:");
  console.log("   📱 url:         https://kreedia.org");
  console.log("   📧 email:       contact@kreedia.org");
  console.log("   📖 description: Decentralized Environmental Impact Platform");
  console.log("   🐦 com.twitter: @KreedApp");
  console.log("   🐙 com.github:  Kreedia-Organization");
  console.log("   🏷️  keywords:    ReFi,Environmental,Carbon,Impact,DeFi,Web3");
  console.log("   🌿 avatar:      [Your logo IPFS hash]");

  console.log("\n4️⃣  ADVANCED RECORDS (Optional):");
  console.log("   🎮 com.discord:  KreedaDiscord");
  console.log("   📱 com.reddit:   r/Kreedia");
  console.log("   📺 com.youtube:  @KreedaOfficial");
  console.log("   💼 com.linkedin: company/kreedia");

  console.log("\n💻 VERIFICATION COMMANDS:");
  console.log("=" .repeat(60));
  
  console.log("\nAfter setting ENS records, verify with:");
  
  const verificationScript = `
// In browser console or Node.js:
const provider = new ethers.providers.JsonRpcProvider('https://sepolia.infura.io/v3/YOUR_KEY');
const resolvedAddress = await provider.resolveName('kreedia.eth');
console.log('Resolved address:', resolvedAddress);
// Should return: ${contractAddress}

// Test reverse lookup:
const ensName = await provider.lookupAddress('${contractAddress}');
console.log('ENS name:', ensName);
// Should return: kreedia.eth
`;

  console.log(verificationScript);

  console.log("\n🚀 FRONTEND INTEGRATION EXAMPLE:");
  console.log("=" .repeat(60));
  
  const frontendCode = `
// React/JavaScript frontend code:
import { ethers } from 'ethers';

// Connect to contract via ENS
const provider = new ethers.providers.Web3Provider(window.ethereum);
const contractAddress = await provider.resolveName('kreedia.eth');
const kreediaContract = new ethers.Contract(
  contractAddress, 
  KreediaABI, 
  provider.getSigner()
);

// Create environmental mission
const tx = await kreediaContract.createMission(
  "ocean-cleanup-001",
  usdcTokenAddress,
  ethers.utils.parseUnits("100", 6), // 100 USDC
  workerAddress
);

console.log("Mission created via kreedia.eth!");
`;

  console.log(frontendCode);

  console.log("\n💡 USER BENEFITS:");
  console.log("=" .repeat(60));
  console.log("✅ Users interact with 'kreedia.eth' instead of long hex address");
  console.log("✅ Professional branding and easy memorability");
  console.log("✅ Contract upgrades possible by updating ENS record");
  console.log("✅ Rich metadata for platform discovery");
  console.log("✅ Social media and contact information attached");
  console.log("✅ Avatar and visual identity for Web3 wallets");

  console.log("\n⚠️  IMPORTANT SECURITY NOTES:");
  console.log("=" .repeat(60));
  console.log("🔐 Only the owner of kreedia.eth can modify records");
  console.log("💰 Each record update requires a transaction (gas fees)");
  console.log("⏰ Changes may take a few minutes to propagate globally");
  console.log("🌐 ENS works on Mainnet and Sepolia (but not Base Sepolia)");
  console.log("🔒 Consider using a multisig for ENS management in production");
  console.log("📱 Test on Sepolia before setting up mainnet ENS");

  console.log("\n🎯 NEXT IMMEDIATE STEPS:");
  console.log("=" .repeat(60));
  console.log("1. Open: https://app.ens.domains/kreedia.eth");
  console.log("2. Connect wallet that owns the domain");
  console.log("3. Set Address record to:", contractAddress);
  console.log("4. Add basic text records (url, email, description)");
  console.log("5. Save changes (requires transaction)");
  console.log("6. Test resolution with verification commands above");

  console.log("\n🌱 AFTER ENS SETUP:");
  console.log("=" .repeat(60));
  console.log("• Test contract functionality with demo script");
  console.log("• Update frontend to use kreedia.eth resolution");
  console.log("• Share the ENS domain with users and partners");
  console.log("• Monitor ENS analytics and usage");
  console.log("• Plan for mainnet deployment with same ENS setup");

  console.log(`\n🎉 Ready to connect kreedia.eth to ${contractAddress}!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("ENS setup error:", error);
    process.exit(1);
  });
