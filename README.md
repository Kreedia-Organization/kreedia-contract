# Kreedia ReFi Contract - Unified Architecture

**Environmental impact rewards through unified stablecoin payments and NFT proof-of-engagement.**

## 🎯 Project Overview

Kreedia incentivizes environmental action by combining:
- 💰 **Stablecoin Payments** (USDC/USDT rewards)
- 🎨 **NFT Proof-of-Engagement** (BEFORE/AFTER photos)
- 🌱 **Environmental Missions** (ocean cleanup, tree planting, etc.)
- 🤝 **NGO Partnerships** (20% of funds to environmental organizations)

## 🚀 Unified Contract Architecture

### **Single Contract = Simplified Integration**
Instead of managing multiple contracts, everything is handled by `KreediaUnifiedSimple.sol`:

```javascript
// Frontend only needs ONE contract address
const KREEDIA_CONTRACT = "0x..." 

// Two main functions handle complete workflow:
await kreedia.createMission(missionId, token, amount, ngo, worker);
await kreedia.completeMission(missionId);
```

### **Automatic Workflow**
1. **Mission Creation** → Funds locked + BEFORE NFT minted
2. **Mission Completion** → AFTER NFT minted + rewards distributed

### **Built-in Reward Distribution**
- 76% → Environmental worker
- 20% → NGO partner  
- 4% → Platform sustainability

## 📁 Project Structure

```
kreedia-contract/
├── contracts/
│   ├── KreediaUnifiedSimple.sol    # Main unified contract
│   └── mocks/
│       └── ERC20Mock.sol           # Testing token
├── scripts/
│   ├── deploy-unified.ts           # Local deployment
│   ├── deploy-base-sepolia.ts      # Testnet deployment
│   └── demo-complete-workflow.ts   # Full workflow demo
├── deployments/                    # Deployment records
├── hardhat.config.ts              # Hardhat configuration
├── package.json                   # Dependencies
└── UNIFIED_CONTRACT_SUCCESS.md    # Integration guide
```

## 🛠️ Quick Start

### Prerequisites
```bash
npm install
```

### Compile Contracts
```bash
npx hardhat compile
```

### Run Local Demo
```bash
npx hardhat run scripts/demo-complete-workflow.ts --network hardhat
```

### Deploy to Base Sepolia
```bash
npx hardhat run scripts/deploy-base-sepolia.ts --network baseSepolia
```

## 🌊 Demo Output

The demo shows a complete ocean cleanup mission:
- ✅ 100 TUSDC mission funding
- ✅ BEFORE NFT minted to worker
- ✅ Mission completion validation
- ✅ AFTER NFT minted as proof
- ✅ 76 TUSDC to worker, 20 TUSDC to NGO, 4 TUSDC platform fee

## 📄 Contract Functions

### Core Functions
```solidity
// Create mission (locks funds + mints BEFORE NFT)
function createMission(
    string missionId,
    address token,
    uint256 amount, 
    address ngo,
    address worker
) returns (uint256 beforeNFTId)

// Complete mission (mints AFTER NFT + distributes rewards)
function completeMission(string missionId) returns (uint256 afterNFTId)
```

### Status Functions
```solidity
// Get complete mission state
function getMissionProgress(string missionId) returns (
    bool exists, bool locked, bool completed, 
    uint256 beforeNFTId, uint256 afterNFTId
)

// Check user participation
function hasUserMissionNFT(address user, string missionId) returns (bool)

// Get NFT details
function getNFTDetails(uint256 tokenId) returns (
    string missionId, uint8 photoType, address owner
)
```

## 🔗 Network Deployments

### Base Sepolia Testnet
- **Previous Deployments** (separate contracts):
  - Payment: `0x3C9a23f8A236BBb0A298766Ca85CD75362C64655`
  - NFT: `0x8507D609AE818968E2F4FF4885fbbbCfB207BE29`  
  - Mock Token: `0x3501dd2fb6b54bf6990d40eb0fbdfa2da051bb94`

### Unified Contract (Ready for Deployment)
- Use `deploy-base-sepolia.ts` for testnet deployment
- Single contract handles all functionality
- Optimized for gas efficiency

## 💡 Integration Benefits

✅ **Simplified Frontend** - One contract instead of multiple  
✅ **Automatic NFTs** - No manual minting required  
✅ **Built-in Payments** - No separate token management  
✅ **Gas Efficient** - ~546k gas for complete mission  
✅ **ENS Ready** - Future-proof naming system  

## 🌱 Environmental Impact

Perfect for ReFi applications focusing on:
- 🌊 Ocean cleanup projects
- 🌳 Reforestation initiatives  
- ♻️ Waste reduction programs
- 🚲 Carbon-neutral transportation
- 💡 Energy conservation projects

## 🧪 Testing

The project includes comprehensive testing:
- Full workflow demonstration
- Payment distribution verification
- NFT minting validation
- Event emission testing
- Gas optimization analysis

## 📚 Documentation

- `UNIFIED_CONTRACT_SUCCESS.md` - Complete integration guide
- Inline code documentation
- Event definitions for frontend integration
- Gas cost analysis

---

**Built for environmental impact. Powered by blockchain technology. Simplified for developers.** 🌍💚
