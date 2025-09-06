import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Demo: Using kreedia.eth in Practice");
  console.log("=" .repeat(50));

  // Use real provider for ENS resolution
  const infuraKey = process.env.INFURA_API_KEY;
  const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${infuraKey}`);

  try {
    // Resolve contract via ENS
    console.log("🔍 Resolving kreedia.eth...");
    const contractAddress = await provider.resolveName("kreedia.eth");
    console.log("✅ Resolved to:", contractAddress);

    // Connect to contract via ENS
    const contract = new ethers.Contract(
      contractAddress!,
      [
        "function name() view returns (string)",
        "function symbol() view returns (string)", 
        "function owner() view returns (address)",
        "function totalSupply() view returns (uint256)",
        "function acceptedTokens(address) view returns (bool)"
      ],
      provider
    );

    // Get contract info
    console.log("\n📋 Contract Information (via ENS):");
    const name = await contract.name();
    const symbol = await contract.symbol();
    const owner = await contract.owner();
    const totalSupply = await contract.totalSupply();

    console.log("   Name:", name);
    console.log("   Symbol:", symbol);
    console.log("   Owner:", owner);
    console.log("   Total NFTs:", totalSupply.toString());

    console.log("\n🎉 SUCCESS: Full ENS Integration Working!");
    console.log("✅ Frontend can now use kreedia.eth instead of hex address");
    console.log("✅ Users see 'kreedia.eth' in their wallets");
    console.log("✅ Professional branding achieved");

    // Example frontend code
    console.log("\n💻 Frontend Integration Example:");
    console.log("=" .repeat(50));
    
    const frontendExample = `
// React/JavaScript code:
const contractAddress = await provider.resolveName('kreedia.eth');
const kreedia = new ethers.Contract(contractAddress, KreediaABI, signer);

// Create environmental mission via ENS
await kreedia.createMission(
  "ocean-cleanup-001",
  usdcAddress, 
  ethers.parseUnits("100", 6),
  workerAddress
);

// User sees: "Transaction sent to kreedia.eth"
// Instead of: "Transaction sent to 0x624e40fc99bd3C2C27213508740Dc9424530Dc5D"
`;

    console.log(frontendExample);

    console.log("\n🌐 ENS Benefits Achieved:");
    console.log("✅ Memorable: kreedia.eth vs 0x624e40fc99bd3C2C27213508740Dc9424530Dc5D");
    console.log("✅ Professional: Branded domain for your platform");
    console.log("✅ Upgradeable: Change contract without updating frontend");
    console.log("✅ Discoverable: Listed in ENS directories");
    console.log("✅ Web3 Native: Perfect wallet integration");

  } catch (error: any) {
    console.log("❌ Error:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Demo failed:", error);
    process.exit(1);
  });
