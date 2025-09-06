import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Kreedia Unified Contract: Complete Demo");
  console.log("=" .repeat(60));
  
  const [deployer, worker, ngo] = await ethers.getSigners();
  
  console.log("👥 Participants:");
  console.log("🏛️  Platform:", deployer.address.slice(0, 10) + "...");
  console.log("👷 Worker:", worker.address.slice(0, 10) + "...");
  console.log("🏢 NGO:", ngo.address.slice(0, 10) + "...");

  try {
    // Step 1: Deploy contracts
    console.log("\n📦 Step 1: Deploying contracts...");
    
    // Deploy Mock ERC20
    const ERC20Mock = await ethers.getContractFactory("contracts/mocks/ERC20Mock.sol:ERC20Mock");
    const mockTokenDeployment = await ERC20Mock.deploy("Test USDC", "TUSDC", "18", deployer.address);
    await mockTokenDeployment.waitForDeployment();
    const mockTokenAddress = await mockTokenDeployment.getAddress();
    const mockToken = await ethers.getContractAt("contracts/mocks/ERC20Mock.sol:ERC20Mock", mockTokenAddress);
    console.log("✅ Mock USDC deployed:", mockTokenAddress);

    // Deploy Kreedia Contract
    const KreediaContractFactory = await ethers.getContractFactory("KreediaContract");
    const kreediaDeployment = await KreediaContractFactory.deploy(deployer.address);
    await kreediaDeployment.waitForDeployment();
    const kreediaAddress = await kreediaDeployment.getAddress();
    const kreedia = await ethers.getContractAt("KreediaContract", kreediaAddress);
    console.log("✅ KreediaContract deployed:", kreediaAddress);

    // Configure contract
    await kreedia.addToken(mockTokenAddress);
    console.log("✅ Added token to accepted list");

    // Mint test tokens
    const mintAmount = ethers.parseUnits("1000", 18);
    await mockToken.mint(deployer.address, mintAmount);
    console.log("✅ Minted 1000 TUSDC for testing");

    // Step 2: Create mission
    console.log("\n🌊 Step 2: Creating Ocean Cleanup Mission...");
    
    const missionId = "ocean-cleanup-demo";
    const fundingAmount = ethers.parseUnits("100", 18);

    console.log("📍 Mission ID:", missionId);
    console.log("💰 Funding: 100 TUSDC");

    // Approve and create mission
    await mockToken.approve(kreediaAddress, fundingAmount);
    console.log("✅ Approved 100 TUSDC for mission");

    const createTx = await kreedia.createMission(
      missionId,
      mockTokenAddress,
      fundingAmount,
      worker.address
    );
    const createReceipt = await createTx.wait();
    console.log("✅ Mission created! Gas used:", createReceipt?.gasUsed?.toString());

    // Parse events
    console.log("\n📋 Mission Creation Events:");
    for (const log of createReceipt?.logs || []) {
      try {
        const parsed = kreedia.interface.parseLog({
          topics: log.topics,
          data: log.data
        });
        if (parsed?.name === "MissionCreated") {
          console.log("🎉 MissionCreated:", {
            missionId: parsed.args[0],
            worker: parsed.args[1].slice(0, 8) + "...",
            ngo: parsed.args[2].slice(0, 8) + "...",
            amount: ethers.formatUnits(parsed.args[3], 18) + " TUSDC"
          });
        }
        if (parsed?.name === "NFTMinted") {
          console.log("🎨 NFTMinted:", {
            tokenId: parsed.args[0].toString(),
            missionId: parsed.args[1],
            owner: parsed.args[2].slice(0, 8) + "...",
            photoType: parsed.args[3] === 0n ? "BEFORE" : "AFTER"
          });
        }
      } catch (e) {
        // Ignore unknown events
      }
    }

    // Step 3: Check mission status
    console.log("\n📊 Step 3: Mission Status Check...");
    const [exists, locked, completed, beforeNFTId, afterNFTId] = await kreedia.getMissionProgress(missionId);
    
    console.log(`✅ Mission exists: ${exists}`);
    console.log(`🔒 Funds locked: ${locked}`);
    console.log(`✅ Completed: ${completed}`);
    console.log(`🎨 BEFORE NFT ID: ${beforeNFTId}`);
    console.log(`🎨 AFTER NFT ID: ${afterNFTId} (not minted yet)`);

    // Check NFT details
    const nftDetails = await kreedia.getNFTDetails(beforeNFTId);
    console.log(`📸 BEFORE NFT details:`);
    console.log(`   Mission: ${nftDetails[0]}`);
    console.log(`   Type: ${nftDetails[1] === 0n ? "BEFORE" : "AFTER"}`);
    console.log(`   Owner: ${nftDetails[2].slice(0, 8)}...`);

    // Check worker's NFT ownership
    const hasNFT = await kreedia.hasUserMissionNFT(worker.address, missionId);
    console.log(`👷 Worker has mission NFT: ${hasNFT}`);

    // Step 4: Simulate mission completion
    console.log("\n🏁 Step 4: Completing Mission...");
    console.log("🌊 Worker has cleaned the ocean and submitted proof photos...");
    console.log("⏰ Platform validates the work and completes the mission...");

    const completeTx = await kreedia.completeMission(missionId);
    const completeReceipt = await completeTx.wait();
    console.log("✅ Mission completed! Gas used:", completeReceipt?.gasUsed?.toString());

    // Parse completion events
    console.log("\n📋 Mission Completion Events:");
    for (const log of completeReceipt?.logs || []) {
      try {
        const parsed = kreedia.interface.parseLog({
          topics: log.topics,
          data: log.data
        });
        if (parsed?.name === "MissionCompleted") {
          console.log("🎉 MissionCompleted:", {
            missionId: parsed.args[0],
            worker: parsed.args[1].slice(0, 8) + "...",
            ngo: parsed.args[2].slice(0, 8) + "...",
            amount: ethers.formatUnits(parsed.args[3], 18) + " TUSDC"
          });
        }
        if (parsed?.name === "NFTMinted") {
          console.log("🎨 AFTER NFTMinted:", {
            tokenId: parsed.args[0].toString(),
            missionId: parsed.args[1],
            owner: parsed.args[2].slice(0, 8) + "...",
            photoType: parsed.args[3] === 0n ? "BEFORE" : "AFTER"
          });
        }
      } catch (e) {
        // Ignore unknown events
      }
    }

    // Step 5: Final verification
    console.log("\n🎉 Step 5: Final Results...");
    
    const [finalExists, finalLocked, finalCompleted, finalBeforeNFTId, finalAfterNFTId] = await kreedia.getMissionProgress(missionId);
    
    // Check all balances
    const workerBalance = await mockToken.balanceOf(worker.address);
    const ngoBalance = await mockToken.balanceOf(ngo.address);
    const contractBalance = await mockToken.balanceOf(kreediaAddress);
    const totalNFTs = await kreedia.totalSupply();

    console.log("💰 Payment Distribution:");
    console.log(`   👷 Worker: ${ethers.formatUnits(workerBalance, 18)} TUSDC (76%)`);
    console.log(`   🏢 NGO: ${ethers.formatUnits(ngoBalance, 18)} TUSDC (20%)`);
    console.log(`   🏛️  Platform: ${ethers.formatUnits(contractBalance, 18)} TUSDC (4%)`);

    console.log("\n🎨 NFT Summary:");
    console.log(`   Total NFTs minted: ${totalNFTs}`);
    console.log(`   BEFORE NFT ID: ${finalBeforeNFTId}`);
    console.log(`   AFTER NFT ID: ${finalAfterNFTId}`);

    // Verify NFT ownership
    const beforeOwner = await kreedia.ownerOf(finalBeforeNFTId);
    const afterOwner = await kreedia.ownerOf(finalAfterNFTId);
    console.log(`   BEFORE NFT owner: ${beforeOwner === worker.address ? "✅ Worker" : "❌ Wrong"}`);
    console.log(`   AFTER NFT owner: ${afterOwner === worker.address ? "✅ Worker" : "❌ Wrong"}`);

    console.log("\n📊 Mission Final Status:");
    console.log(`   Mission exists: ${finalExists}`);
    console.log(`   Funds locked: ${finalLocked}`);
    console.log(`   Mission completed: ${finalCompleted}`);

    // Step 6: Success summary
    console.log("\n🚀 UNIFIED CONTRACT DEMO SUCCESS!");
    console.log("=" .repeat(60));
    console.log("✅ What the unified contract handled:");
    console.log("   1. 💰 Payment processing (100 TUSDC locked)");
    console.log("   2. 🎨 BEFORE NFT minting (at mission creation)");
    console.log("   3. 🔒 Fund escrow (secure until completion)");
    console.log("   4. ✅ Mission validation & completion");
    console.log("   5. 🎨 AFTER NFT minting (proof of completion)");
    console.log("   6. 💸 Reward distribution (76%/20%/4%)");
    console.log("   7. 🏛️  Platform fee collection");

    console.log("\n🎯 Frontend Integration:");
    console.log(`📄 Single Contract: ${kreediaAddress}`);
    console.log("🔧 Two Main Functions:");
    console.log("   • createMission() → Locks funds + mints BEFORE NFT");
    console.log("   • completeMission() → Mints AFTER NFT + distributes rewards");
    console.log("📊 Status Functions:");
    console.log("   • getMissionProgress() → Complete mission state");
    console.log("   • hasUserMissionNFT() → User participation check");
    console.log("   • getNFTDetails() → NFT metadata");

    console.log("\n💡 This is PERFECT for your ReFi app!");
    console.log("   🌱 Environmental missions with stablecoin rewards");
    console.log("   🎨 Automatic NFT proof-of-engagement");
    console.log("   💰 Built-in payment distribution");
    console.log("   🎯 Single contract simplifies frontend");
    console.log("   ⚡ Gas-efficient unified architecture");

    console.log("\n🌊 Demo mission completed successfully!");
    console.log(`Worker ${worker.address.slice(0, 8)}... cleaned the ocean and earned:`);
    console.log(`• ${ethers.formatUnits(workerBalance, 18)} TUSDC`);
    console.log(`• 2 NFTs (BEFORE + AFTER photos)`);
    console.log(`• Permanent proof of environmental impact`);

  } catch (error: any) {
    console.log("❌ Demo failed:", error.message);
    if (error.reason) {
      console.log("💡 Reason:", error.reason);
    }
    console.log("Stack:", error.stack);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
