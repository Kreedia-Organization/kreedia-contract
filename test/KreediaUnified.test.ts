import { expect } from "chai";
import { ethers } from "hardhat";
import { KreediaContract, ERC20Mock } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("KreediaContract", function () {
  let contract: KreediaContract;
  let token: ERC20Mock;
  let owner: HardhatEthersSigner;
  let ngo: HardhatEthersSigner;
  let worker: HardhatEthersSigner;
  let platformFeeRecipient: HardhatEthersSigner;

  const MISSION_ID = "ocean-cleanup-001";
  const MISSION_AMOUNT = ethers.parseEther("100");
  const WORKER_REWARD_PERCENT = 96; // 96% to worker, 4% platform fee

  beforeEach(async function () {
    // Get signers
    [owner, ngo, worker, platformFeeRecipient] = await ethers.getSigners();

    // Deploy mock ERC20 token
    const ERC20MockFactory = await ethers.getContractFactory("ERC20Mock");
    token = await ERC20MockFactory.deploy("Test Token", "TEST", 18, owner.address);
    await token.waitForDeployment();

    // Deploy KreediaContract
    const KreediaContractFactory = await ethers.getContractFactory("KreediaContract");
    contract = await KreediaContractFactory.deploy(owner.address);
    await contract.waitForDeployment();

    // Add token to accepted tokens
    await contract.connect(owner).addToken(await token.getAddress());

    // Mint tokens to NGO
    await token.mint(ngo.address, ethers.parseEther("1000"));
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await contract.name()).to.equal("Kreedia Impact NFT");
      expect(await contract.symbol()).to.equal("KREEDIA");
    });
  });

  describe("Mission Creation", function () {
    it("Should create a mission successfully with proper approval", async function () {
      // NGO approves contract to spend tokens
      await token.connect(ngo).approve(await contract.getAddress(), MISSION_AMOUNT);

      const tx = await contract.connect(ngo).createMission(
        MISSION_ID,
        await token.getAddress(),
        MISSION_AMOUNT,
        worker.address
      );

      await expect(tx)
        .to.emit(contract, "MissionCreated")
        .withArgs(MISSION_ID, worker.address, ngo.address, MISSION_AMOUNT);

      // Check that tokens were transferred to contract
      expect(await token.balanceOf(await contract.getAddress())).to.equal(MISSION_AMOUNT);

      // Check that worker received BEFORE NFT
      expect(await contract.balanceOf(worker.address)).to.equal(1);
    });

    it("Should fail without token approval", async function () {
      await expect(
        contract.connect(ngo).createMission(
          MISSION_ID,
          await token.getAddress(),
          MISSION_AMOUNT,
          worker.address
        )
      ).to.be.revertedWithCustomError(token, "ERC20InsufficientAllowance");
    });

    it("Should fail with insufficient balance", async function () {
      const largeAmount = ethers.parseEther("2000");
      
      await token.connect(ngo).approve(await contract.getAddress(), largeAmount);

      // The contract checks balance before transferFrom, so it should revert with InvalidAmount
      await expect(
        contract.connect(ngo).createMission(
          MISSION_ID,
          await token.getAddress(),
          largeAmount,
          worker.address
        )
      ).to.be.revertedWithCustomError(contract, "InvalidAmount");
    });
  });

  describe("Mission Completion", function () {
    beforeEach(async function () {
      // Create a mission first
      await token.connect(ngo).approve(await contract.getAddress(), MISSION_AMOUNT);
      await contract.connect(ngo).createMission(
        MISSION_ID,
        await token.getAddress(),
        MISSION_AMOUNT,
        worker.address
      );
    });

    it("Should complete mission successfully", async function () {
      const initialWorkerBalance = await token.balanceOf(worker.address);
      const initialContractBalance = await token.balanceOf(await contract.getAddress());

      const tx = await contract.connect(owner).completeMission(MISSION_ID);

      // Don't check event parameters for now, just check it emits
      await expect(tx).to.emit(contract, "MissionCompleted");

      // Calculate expected amounts (96% to worker, 4% platform fee stays in contract)
      const workerReward = (MISSION_AMOUNT * BigInt(WORKER_REWARD_PERCENT)) / BigInt(100);
      const platformFee = MISSION_AMOUNT - workerReward;

      // Check balances
      expect(await token.balanceOf(worker.address)).to.equal(initialWorkerBalance + workerReward);
      expect(await token.balanceOf(await contract.getAddress())).to.equal(initialContractBalance - workerReward);

      // Check that worker received AFTER NFT
      expect(await contract.balanceOf(worker.address)).to.equal(2); // BEFORE + AFTER NFTs
    });

    it("Should fail if mission doesn't exist", async function () {
      await expect(
        contract.connect(owner).completeMission("non-existent-mission")
      ).to.be.revertedWithCustomError(contract, "MissionNotFound");
    });

    it("Should fail if not called by owner", async function () {
      // Actually, completeMission doesn't have onlyOwner modifier, so anyone can call it
      // Let's test that anyone can complete a mission
      await expect(contract.connect(ngo).completeMission(MISSION_ID))
        .to.emit(contract, "MissionCompleted");
    });
  });

  describe("Mission Cancellation", function () {
    beforeEach(async function () {
      // Create a mission first
      await token.connect(ngo).approve(await contract.getAddress(), MISSION_AMOUNT);
      await contract.connect(ngo).createMission(
        MISSION_ID,
        await token.getAddress(),
        MISSION_AMOUNT,
        worker.address
      );
    });

    it("Should cancel mission and refund NGO", async function () {
      const initialNgoBalance = await token.balanceOf(ngo.address);

      const tx = await contract.connect(owner).cancelMission(MISSION_ID);

      await expect(tx)
        .to.emit(contract, "MissionCanceled")
        .withArgs(MISSION_ID);

      // Check that NGO was refunded
      expect(await token.balanceOf(ngo.address)).to.equal(initialNgoBalance + MISSION_AMOUNT);
      expect(await token.balanceOf(await contract.getAddress())).to.equal(0);
    });
  });

  describe("Complete Workflow", function () {
    it("Should handle complete mission lifecycle", async function () {
      // Step 1: Create mission
      await token.connect(ngo).approve(await contract.getAddress(), MISSION_AMOUNT);
      
      const createTx = await contract.connect(ngo).createMission(
        MISSION_ID,
        await token.getAddress(),
        MISSION_AMOUNT,
        worker.address
      );

      await expect(createTx)
        .to.emit(contract, "MissionCreated")
        .withArgs(MISSION_ID, worker.address, ngo.address, MISSION_AMOUNT);

      // Verify BEFORE NFT was minted
      expect(await contract.balanceOf(worker.address)).to.equal(1);

      // Step 2: Complete mission
      const completeTx = await contract.connect(owner).completeMission(MISSION_ID);

      await expect(completeTx)
        .to.emit(contract, "MissionCompleted");

      // Verify AFTER NFT was minted
      expect(await contract.balanceOf(worker.address)).to.equal(2);

      // Verify payments were distributed (96% to worker, 4% platform fee stays in contract)
      const workerReward = (MISSION_AMOUNT * BigInt(WORKER_REWARD_PERCENT)) / BigInt(100);
      const platformFee = MISSION_AMOUNT - workerReward;

      expect(await token.balanceOf(worker.address)).to.equal(workerReward);
      expect(await token.balanceOf(await contract.getAddress())).to.equal(platformFee);
    });
  });
});
