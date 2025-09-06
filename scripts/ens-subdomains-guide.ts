import { ethers } from "hardhat";

async function main() {
  console.log("🌐 ENS Subdomains for Kreedia Platform");
  console.log("=" .repeat(60));

  const infuraKey = process.env.INFURA_API_KEY;
  const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${infuraKey}`);

  console.log("📋 Current ENS Setup:");
  console.log("   Main Domain: kreedia.eth");
  console.log("   Contract: 0x624e40fc99bd3C2C27213508740Dc9424530Dc5D");

  console.log("\n🏗️  ENS SUBDOMAIN ARCHITECTURE:");
  console.log("=" .repeat(60));

  const subdomains = [
    {
      subdomain: "app.kreedia.eth",
      purpose: "Main dApp Frontend",
      points_to: "IPFS hash or traditional hosting",
      usage: "Primary user interface"
    },
    {
      subdomain: "api.kreedia.eth", 
      purpose: "Backend API Services",
      points_to: "API server IP/domain",
      usage: "Off-chain data, metadata, notifications"
    },
    {
      subdomain: "contract.kreedia.eth",
      purpose: "Smart Contract Address",
      points_to: "0x624e40fc99bd3C2C27213508740Dc9424530Dc5D",
      usage: "Direct contract interaction"
    },
    {
      subdomain: "nft.kreedia.eth",
      purpose: "NFT Metadata Service",
      points_to: "IPFS gateway or metadata server",
      usage: "NFT images, descriptions, attributes"
    },
    {
      subdomain: "docs.kreedia.eth",
      purpose: "Documentation Site",
      points_to: "Documentation hosting",
      usage: "User guides, API docs, tutorials"
    },
    {
      subdomain: "blog.kreedia.eth",
      purpose: "Platform Blog/News",
      points_to: "Blog hosting or IPFS",
      usage: "Updates, announcements, articles"
    }
  ];

  console.log("🎯 Recommended Subdomain Structure:");
  subdomains.forEach(sub => {
    console.log(`\n📱 ${sub.subdomain}`);
    console.log(`   Purpose: ${sub.purpose}`);
    console.log(`   Points to: ${sub.points_to}`);
    console.log(`   Usage: ${sub.usage}`);
  });

  console.log("\n💻 FRONTEND IMPLEMENTATION:");
  console.log("=" .repeat(60));

  const frontendCode = `
// Frontend ENS Resolution Service
class KreediaENSService {
  constructor(provider) {
    this.provider = provider;
  }

  // Resolve different services
  async getContractAddress() {
    return await this.provider.resolveName('contract.kreedia.eth');
    // Or fallback to main domain
    // return await this.provider.resolveName('kreedia.eth');
  }

  async getAppURL() {
    const resolver = await this.provider.getResolver('app.kreedia.eth');
    return await resolver.getText('url');
  }

  async getAPIEndpoint() {
    const resolver = await this.provider.getResolver('api.kreedia.eth');
    return await resolver.getText('url');
  }

  async getNFTMetadataBase() {
    const resolver = await this.provider.getResolver('nft.kreedia.eth');
    return await resolver.getText('url');
  }
}

// Usage in React/Vue/Angular app
const ensService = new KreediaENSService(provider);
const contractAddress = await ensService.getContractAddress();
const apiEndpoint = await ensService.getAPIEndpoint();

// Initialize contract
const kreedia = new ethers.Contract(contractAddress, KreediaABI, signer);
`;

  console.log(frontendCode);

  console.log("\n🛠️  SETTING UP SUBDOMAINS:");
  console.log("=" .repeat(60));

  console.log("1️⃣  Via ENS App (Recommended):");
  console.log("   • Go to: https://app.ens.domains/kreedia.eth");
  console.log("   • Click 'Subdomains' tab");
  console.log("   • Add new subdomains:");
  
  subdomains.forEach(sub => {
    console.log(`     - ${sub.subdomain.replace('.kreedia.eth', '')}`);
  });

  console.log("\n2️⃣  Programmatic Setup:");
  const programmaticCode = `
// Using ENS contracts directly
const ENS_REGISTRY = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
const ensRegistry = new ethers.Contract(ENS_REGISTRY, ENS_ABI, signer);

// Create subdomain
const parentNode = ethers.namehash("kreedia.eth");
const subdomainLabel = ethers.keccak256(ethers.toUtf8Bytes("app"));
const subdomainNode = ethers.keccak256(
  ethers.concat([parentNode, subdomainLabel])
);

// Set subdomain owner and resolver
await ensRegistry.setSubnodeOwner(parentNode, subdomainLabel, owner);
await ensRegistry.setResolver(subdomainNode, resolverAddress);
`;

  console.log(programmaticCode);

  console.log("\n🎯 ADVANCED SUBDOMAIN PATTERNS:");
  console.log("=" .repeat(60));

  const advancedPatterns = [
    {
      pattern: "v1.contract.kreedia.eth",
      purpose: "Contract versioning",
      example: "Point to different contract versions"
    },
    {
      pattern: "sepolia.kreedia.eth", 
      purpose: "Network-specific",
      example: "Different addresses per network"
    },
    {
      pattern: "mission.kreedia.eth",
      purpose: "Feature-specific",
      example: "Mission management interface"
    },
    {
      pattern: "rewards.kreedia.eth",
      purpose: "Rewards dashboard",
      example: "User earnings and NFT gallery"
    },
    {
      pattern: "admin.kreedia.eth",
      purpose: "Admin panel",
      example: "Platform management tools"
    }
  ];

  console.log("🏗️  Advanced Patterns:");
  advancedPatterns.forEach(pattern => {
    console.log(`\n🔗 ${pattern.pattern}`);
    console.log(`   Purpose: ${pattern.purpose}`);
    console.log(`   Example: ${pattern.example}`);
  });

  console.log("\n💡 BENEFITS OF ENS SUBDOMAINS:");
  console.log("=" .repeat(60));
  console.log("✅ Service Organization: Clear separation of concerns");
  console.log("✅ Version Management: Easy contract upgrades");
  console.log("✅ Network Flexibility: Different addresses per chain");
  console.log("✅ User Experience: Memorable, semantic URLs");
  console.log("✅ Development: Easy staging vs production");
  console.log("✅ Branding: Consistent kreedia.eth domain family");

  console.log("\n🚀 IMPLEMENTATION EXAMPLE:");
  console.log("=" .repeat(60));

  const implementationExample = `
// Environment-aware contract resolution
class KreediaConfig {
  constructor(network = 'mainnet') {
    this.network = network;
  }

  async getContractAddress(provider) {
    const subdomain = this.network === 'mainnet' 
      ? 'kreedia.eth' 
      : \`\${this.network}.kreedia.eth\`;
    
    return await provider.resolveName(subdomain);
  }

  async getAPIBase(provider) {
    const resolver = await provider.getResolver(\`api.kreedia.eth\`);
    return await resolver.getText('url');
  }
}

// Usage
const config = new KreediaConfig('sepolia');
const contractAddress = await config.getContractAddress(provider);
const apiBase = await config.getAPIBase(provider);

// Result: Automatically uses sepolia.kreedia.eth for testnet
// and kreedia.eth for mainnet
`;

  console.log(implementationExample);

  console.log("\n🎯 NEXT STEPS:");
  console.log("=" .repeat(60));
  console.log("1. Set up basic subdomains via ENS app");
  console.log("2. Configure DNS/IPFS records for each service");
  console.log("3. Update frontend to use subdomain resolution");
  console.log("4. Test subdomain resolution");
  console.log("5. Document subdomain architecture for team");

  console.log("\n📱 Quick Setup Commands:");
  console.log("Go to: https://app.ens.domains/kreedia.eth");
  console.log("Add these subdomains with appropriate records:");
  subdomains.forEach(sub => {
    console.log(`   ${sub.subdomain} → ${sub.points_to}`);
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
