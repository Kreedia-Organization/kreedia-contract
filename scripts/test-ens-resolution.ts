import { ethers } from "hardhat";

async function main() {
  console.log("🧪 Testing ENS Resolution for kreedia.eth");
  console.log("=" .repeat(50));

  const expectedAddress = "0x624e40fc99bd3C2C27213508740Dc9424530Dc5D";
  
  try {
    // Connect to Sepolia network
    const provider = ethers.provider;
    const network = await provider.getNetwork();
    
    console.log("📍 Network:", network.name, `(Chain ID: ${network.chainId})`);
    
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
        } else {
          console.log("❌ MISMATCH: Resolved address doesn't match deployed contract");
          console.log("   Expected:", expectedAddress);
          console.log("   Got:     ", resolvedAddress);
        }
      } else {
        console.log("❌ FAILED: kreedia.eth did not resolve to any address");
        console.log("💡 This means ENS records are not set up yet");
      }
    } catch (error: any) {
      console.log("❌ ERROR: Failed to resolve kreedia.eth");
      console.log("💡 This likely means:");
      console.log("   1. ENS records are not configured yet");
      console.log("   2. Domain doesn't exist on this network");
      console.log("   3. Network connectivity issue");
      console.log("Error details:", error.message);
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
        } else {
          console.log("⚠️  PARTIAL: Address resolves to different ENS name");
        }
      } else {
        console.log("❌ FAILED: No ENS name found for this address");
        console.log("💡 Reverse lookup not configured yet");
      }
    } catch (error: any) {
      console.log("❌ ERROR: Reverse lookup failed");
      console.log("Error details:", error.message);
    }

    // Test contract interaction via ENS
    console.log("\n🔍 Testing Contract Interaction via ENS...");
    
    try {
      const contractViaENS = await ethers.getContractAt("KreediaContract", "kreedia.eth");
      const name = await contractViaENS.name();
      const symbol = await contractViaENS.symbol();
      const owner = await contractViaENS.owner();
      
      console.log("✅ Contract accessible via ENS!");
      console.log("   Name:", name);
      console.log("   Symbol:", symbol);
      console.log("   Owner:", owner);
      
    } catch (error: any) {
      console.log("❌ ERROR: Cannot interact with contract via ENS");
      console.log("💡 ENS resolution needs to be set up first");
      console.log("Error details:", error.message.split('\n')[0]);
    }

  } catch (error: any) {
    console.log("❌ NETWORK ERROR:", error.message);
  }

  console.log("\n📋 ENS SETUP STATUS:");
  console.log("=" .repeat(50));
  console.log("If ENS resolution failed, you need to:");
  console.log("1. Go to: https://app.ens.domains/kreedia.eth");
  console.log("2. Connect wallet that owns kreedia.eth");
  console.log("3. Set Address record to:", expectedAddress);
  console.log("4. Save changes (requires transaction)");
  console.log("5. Wait a few minutes for propagation");
  console.log("6. Run this test again");

  console.log("\n🌐 Useful Links:");
  console.log("📱 ENS App:", "https://app.ens.domains/kreedia.eth");
  console.log("🔍 Contract:", `https://sepolia.etherscan.io/address/${expectedAddress}`);
  console.log("📖 ENS Docs:", "https://docs.ens.domains/");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Test failed:", error);
    process.exit(1);
  });
