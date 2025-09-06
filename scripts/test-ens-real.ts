import { ethers } from "hardhat";

async function main() {
  console.log("🧪 Testing ENS Resolution for kreedia.eth");
  console.log("=" .repeat(50));

  const expectedAddress = "0x624e40fc99bd3C2C27213508740Dc9424530Dc5D";
  
  // Use Infura provider for ENS resolution
  const infuraKey = process.env.INFURA_API_KEY;
  if (!infuraKey) {
    console.log("❌ INFURA_API_KEY not found in .env file");
    return;
  }

  const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${infuraKey}`);
  
  try {
    const network = await provider.getNetwork();
    console.log("📍 Network:", network.name, `(Chain ID: ${network.chainId})`);
    console.log("🔗 Provider: Infura Sepolia");
    
    // Test ENS resolution
    console.log("\n🔍 Testing ENS Resolution...");
    console.log("Domain: kreedia.eth");
    console.log("Expected Address:", expectedAddress);
    
    try {
      const resolvedAddress = await provider.resolveName("kreedia.eth");
      
      if (resolvedAddress) {
        console.log("✅ Resolved Address:", resolvedAddress);
        
        if (resolvedAddress.toLowerCase() === expectedAddress.toLowerCase()) {
          console.log("🎉 SUCCESS: ENS resolution working correctly!");
          console.log("✅ kreedia.eth → Your KreediaContract");
        } else {
          console.log("❌ MISMATCH: Resolved address doesn't match deployed contract");
          console.log("   Expected:", expectedAddress);
          console.log("   Got:     ", resolvedAddress);
        }
      } else {
        console.log("❌ FAILED: kreedia.eth did not resolve to any address");
        console.log("💡 ENS records are not set up yet");
      }
    } catch (error: any) {
      console.log("❌ ERROR: Failed to resolve kreedia.eth");
      console.log("💡 This likely means ENS records are not configured yet");
      if (error.message) {
        console.log("Error:", error.message);
      }
    }

    // Test reverse lookup
    console.log("\n🔍 Testing Reverse Lookup...");
    console.log("Address:", expectedAddress);
    
    try {
      const ensName = await provider.lookupAddress(expectedAddress);
      
      if (ensName) {
        console.log("✅ Reverse Lookup Result:", ensName);
        
        if (ensName === "kreedia.eth") {
          console.log("🎉 SUCCESS: Reverse lookup working correctly!");
          console.log("✅ Your contract → kreedia.eth");
        } else {
          console.log("⚠️  PARTIAL: Address resolves to different ENS name");
        }
      } else {
        console.log("❌ No ENS name found for this address");
        console.log("💡 Reverse record not configured yet");
      }
    } catch (error: any) {
      console.log("❌ ERROR: Reverse lookup failed");
      if (error.message) {
        console.log("Error:", error.message);
      }
    }

    // Test if we can get contract interface via direct address
    console.log("\n🔍 Testing Direct Contract Access...");
    try {
      const contract = new ethers.Contract(
        expectedAddress,
        ["function name() view returns (string)", "function symbol() view returns (string)", "function owner() view returns (address)"],
        provider
      );
      
      const name = await contract.name();
      const symbol = await contract.symbol();
      const owner = await contract.owner();
      
      console.log("✅ Contract accessible via direct address:");
      console.log("   Name:", name);
      console.log("   Symbol:", symbol);
      console.log("   Owner:", owner.slice(0, 10) + "...");
      
    } catch (error: any) {
      console.log("❌ ERROR: Cannot access contract");
      console.log("Error:", error.message);
    }

  } catch (error: any) {
    console.log("❌ PROVIDER ERROR:", error.message);
  }

  console.log("\n📋 NEXT STEPS:");
  console.log("=" .repeat(50));
  
  console.log("If ENS resolution failed:");
  console.log("1. 🌐 Open: https://app.ens.domains/kreedia.eth");
  console.log("2. 🔑 Connect wallet that owns kreedia.eth");
  console.log("3. 📝 Click 'Records' tab");
  console.log("4. ➕ Add Address (ETH) record:");
  console.log(`   Value: ${expectedAddress}`);
  console.log("5. 💾 Save changes (requires gas)");
  console.log("6. ⏰ Wait 5-10 minutes for propagation");
  console.log("7. 🔄 Run this test again");

  console.log("\n💡 ENS Records to Add:");
  console.log("Address (ETH):", expectedAddress);
  console.log("url:", "https://kreedia.org");
  console.log("email:", "contact@kreedia.org");
  console.log("description:", "Decentralized Environmental Impact Platform");
  console.log("com.github:", "Kreedia-Organization");
  console.log("com.twitter:", "@KreedApp");

  console.log("\n🎯 After ENS Setup, users can:");
  console.log("• Send transactions to 'kreedia.eth' instead of long address");
  console.log("• Discover your platform via ENS directory");
  console.log("• See professional metadata in Web3 wallets");
  console.log("• Easy integration in other dApps");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });
