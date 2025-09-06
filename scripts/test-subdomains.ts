import { ethers } from "hardhat";

async function main() {
  console.log("🧪 Testing ENS Subdomain Setup for Kreedia");
  console.log("=" .repeat(50));

  const infuraKey = process.env.INFURA_API_KEY;
  const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${infuraKey}`);

  // Test current main domain
  console.log("📋 Current Setup Test:");
  try {
    const mainAddress = await provider.resolveName("kreedia.eth");
    console.log("✅ kreedia.eth →", mainAddress);
  } catch (error) {
    console.log("❌ kreedia.eth resolution failed");
  }

  // Test potential subdomains
  const subdomains = [
    "app.kreedia.eth",
    "api.kreedia.eth", 
    "contract.kreedia.eth",
    "nft.kreedia.eth",
    "docs.kreedia.eth",
    "sepolia.kreedia.eth"
  ];

  console.log("\n🔍 Testing Subdomain Resolution:");
  console.log("(These may not exist yet - showing what to set up)");

  for (const subdomain of subdomains) {
    try {
      const address = await provider.resolveName(subdomain);
      if (address) {
        console.log(`✅ ${subdomain} → ${address}`);
      } else {
        console.log(`❌ ${subdomain} → Not configured`);
      }
    } catch (error) {
      console.log(`❌ ${subdomain} → Not configured`);
    }
  }

  console.log("\n🛠️  PRACTICAL IMPLEMENTATION:");
  console.log("=" .repeat(50));

  // Show how frontend would use subdomains
  const frontendExample = `
// Frontend service resolution
class KreediaServices {
  constructor(provider, network = 'sepolia') {
    this.provider = provider;
    this.network = network;
  }

  async resolveContract() {
    // Try network-specific first, fallback to main
    try {
      const networkSpecific = \`\${this.network}.kreedia.eth\`;
      return await this.provider.resolveName(networkSpecific);
    } catch {
      return await this.provider.resolveName('contract.kreedia.eth');
    }
  }

  async resolveAPI() {
    const resolver = await this.provider.getResolver('api.kreedia.eth');
    const url = await resolver?.getText('url');
    return url || 'https://api.kreedia.org'; // fallback
  }

  async resolveApp() {
    const resolver = await this.provider.getResolver('app.kreedia.eth');
    const url = await resolver?.getText('url');
    return url || 'https://app.kreedia.org'; // fallback
  }
}

// Usage in your dApp
const services = new KreediaServices(provider, 'sepolia');
const contractAddress = await services.resolveContract();
const apiEndpoint = await services.resolveAPI();

// Initialize contract with ENS resolution
const kreedia = new ethers.Contract(contractAddress, KreediaABI, signer);
`;

  console.log(frontendExample);

  console.log("\n📱 SUBDOMAIN SETUP CHECKLIST:");
  console.log("=" .repeat(50));

  const setupSteps = [
    {
      step: "1. Create Subdomains",
      action: "Go to https://app.ens.domains/kreedia.eth → Subdomains tab",
      result: "Add: app, api, contract, nft, docs, sepolia"
    },
    {
      step: "2. Set Contract Addresses", 
      action: "Set contract.kreedia.eth address record",
      result: "Points to: 0x624e40fc99bd3C2C27213508740Dc9424530Dc5D"
    },
    {
      step: "3. Set Network-Specific",
      action: "Set sepolia.kreedia.eth address record", 
      result: "Points to: 0x624e40fc99bd3C2C27213508740Dc9424530Dc5D"
    },
    {
      step: "4. Set Service URLs",
      action: "Add text records for app, api, docs subdomains",
      result: "url text records point to your services"
    },
    {
      step: "5. Test Resolution",
      action: "Run this script again to verify setup",
      result: "All subdomains resolve correctly"
    }
  ];

  setupSteps.forEach(item => {
    console.log(`\n${item.step}:`);
    console.log(`   Action: ${item.action}`);
    console.log(`   Result: ${item.result}`);
  });

  console.log("\n🎯 RECOMMENDED SUBDOMAIN RECORDS:");
  console.log("=" .repeat(50));

  const records = [
    {
      subdomain: "contract.kreedia.eth",
      type: "Address (ETH)",
      value: "0x624e40fc99bd3C2C27213508740Dc9424530Dc5D"
    },
    {
      subdomain: "sepolia.kreedia.eth", 
      type: "Address (ETH)",
      value: "0x624e40fc99bd3C2C27213508740Dc9424530Dc5D"
    },
    {
      subdomain: "app.kreedia.eth",
      type: "Text Record (url)", 
      value: "https://app.kreedia.org or IPFS hash"
    },
    {
      subdomain: "api.kreedia.eth",
      type: "Text Record (url)",
      value: "https://api.kreedia.org"
    },
    {
      subdomain: "docs.kreedia.eth",
      type: "Text Record (url)",
      value: "https://docs.kreedia.org"
    },
    {
      subdomain: "nft.kreedia.eth", 
      type: "Text Record (url)",
      value: "https://nft.kreedia.org or IPFS gateway"
    }
  ];

  records.forEach(record => {
    console.log(`\n📱 ${record.subdomain}`);
    console.log(`   Type: ${record.type}`);
    console.log(`   Value: ${record.value}`);
  });

  console.log("\n💡 BENEFITS YOU'LL GET:");
  console.log("=" .repeat(50));
  console.log("✅ Clean separation: Each service has its own subdomain");
  console.log("✅ Easy upgrades: Change contract address without frontend changes");
  console.log("✅ Network flexibility: Different addresses for mainnet/testnet");
  console.log("✅ Professional URLs: app.kreedia.eth vs long IPFS hashes");
  console.log("✅ Service discovery: Clear naming for different platform parts");
  console.log("✅ Branding consistency: Everything under kreedia.eth umbrella");

  console.log("\n🚀 NEXT IMMEDIATE ACTION:");
  console.log("Go to: https://app.ens.domains/kreedia.eth");
  console.log("Click 'Subdomains' and start adding the subdomains above!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
