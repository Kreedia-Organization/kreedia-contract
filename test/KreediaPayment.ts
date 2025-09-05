import { ethers } from "hardhat";
import { expect } from "chai";

describe("KreediaPayment", function () {
  let KreediaPayment: any;
  let kreedia: any;
  let owner: any;
  let ngo: any;
  let reporter: any;
  let worker: any;
  let platform: any;
  let token: any;

  beforeEach(async function () {
    [owner, ngo, reporter, worker, platform] = await ethers.getSigners();
    
    // Deploy a mock ERC20 token
    const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
    token = await ERC20Mock.deploy("MockToken", "MTK", owner.address, ethers.parseEther("1000000"));
    
    // Deploy KreediaPayment
    KreediaPayment = await ethers.getContractFactory("KreediaPayment");
    kreedia = await KreediaPayment.deploy();
    
    // Add token
    await kreedia.connect(owner).addToken(await token.getAddress());
    
    // Fund NGO
    await token.connect(owner).transfer(ngo.address, ethers.parseEther("1000"));
  });

  it("should add and remove accepted tokens", async function () {
    expect(await kreedia.acceptedTokens(await token.getAddress())).to.be.true;
    await kreedia.connect(owner).removeToken(await token.getAddress());
    expect(await kreedia.acceptedTokens(await token.getAddress())).to.be.false;
  });

  it("should lock funds for a mission", async function () {
    await token.connect(ngo).approve(await kreedia.getAddress(), ethers.parseEther("100"));
    await kreedia.connect(ngo).lockFunds("mission1", await token.getAddress(), ethers.parseEther("100"));
    const locked = await kreedia.missionFunds("mission1");
    expect(locked.amount).to.equal(ethers.parseEther("100"));
    expect(locked.locked).to.be.true;
  });

  it("should unlock funds for a mission", async function () {
    await token.connect(ngo).approve(await kreedia.getAddress(), ethers.parseEther("100"));
    await kreedia.connect(ngo).lockFunds("mission2", await token.getAddress(), ethers.parseEther("100"));
    await kreedia.connect(owner).unlockFunds("mission2");
    const locked = await kreedia.missionFunds("mission2");
    expect(locked.locked).to.be.false;
  });

  it("should validate mission and distribute rewards", async function () {
    await token.connect(ngo).approve(await kreedia.getAddress(), ethers.parseEther("100"));
    await kreedia.connect(ngo).lockFunds("mission3", await token.getAddress(), ethers.parseEther("100"));
    await kreedia.connect(owner).validateMission(
      "mission3",
      reporter.address,
      worker.address,
      platform.address
    );
    // Check reporter and worker received tokens
    expect(await token.balanceOf(reporter.address)).to.equal(ethers.parseEther("20"));
    expect(await token.balanceOf(worker.address)).to.equal(ethers.parseEther("76"));
  });

  it("should withdraw platform fees", async function () {
    await token.connect(ngo).approve(await kreedia.getAddress(), ethers.parseEther("100"));
    await kreedia.connect(ngo).lockFunds("mission4", await token.getAddress(), ethers.parseEther("100"));
    await kreedia.connect(owner).validateMission(
      "mission4",
      reporter.address,
      worker.address,
      platform.address
    );
    // Withdraw platform fees
    await kreedia.connect(owner).withdrawPlatformFees(await token.getAddress(), ethers.parseEther("4"), owner.address);
    expect(await token.balanceOf(owner.address)).to.be.gte(ethers.parseEther("4"));
  });

  it("should revert on invalid token", async function () {
    await expect(
      kreedia.connect(ngo).lockFunds("mission5", owner.address, ethers.parseEther("100"))
    ).to.be.revertedWithCustomError(kreedia, "CustomError");
  });

  it("should revert on insufficient funds", async function () {
    await token.connect(ngo).approve(await kreedia.getAddress(), ethers.parseEther("10"));
    await expect(
      kreedia.connect(ngo).lockFunds("mission6", await token.getAddress(), ethers.parseEther("100"))
    ).to.be.revertedWithCustomError(token, "ERC20InsufficientAllowance");
  });
});
