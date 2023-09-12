import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

async function deployNFT() {

  // Contracts are deployed using the first signer/account by default
  const [owner, otherAccount] = await ethers.getSigners();

  const NFT = await ethers.getContractFactory("NFT");
  const deployedContract = await NFT.deploy();

  return { deployedContract, owner, otherAccount };
}

describe("Deployment", function () {
  it("Should deployed contract", async function () {
    const { deployedContract, owner } = await loadFixture(deployNFT);

    expect(await deployedContract.owner()).to.equal(owner.address);
  });

});

describe("Token uri", function () {

  it("token uri not set yet", async function () {
    const { deployedContract } = await loadFixture(deployNFT);

    let number = ethers.BigNumber.from("1");
    await expect(deployedContract.tokenURI(number)).to.be.reverted;
  });

  it("token uri not set yet", async function () {
    const { deployedContract } = await loadFixture(deployNFT);

    let number = ethers.BigNumber.from("0");
    await expect(deployedContract.tokenURI(number)).to.be.reverted;
  });

  it("set base uri", async function () {
    const { deployedContract, otherAccount } = await loadFixture(deployNFT);

    let baseURI = "https://gateway.pinata.cloud/ipfs/Qmehf8kSgTondwi7sDpR2kf8zaea1idycRQuVKxEQ2y9oi/"
    expect(await deployedContract.setBaseURI(baseURI));

    expect(await deployedContract.mint(otherAccount.address));
    let number = ethers.BigNumber.from("0");
    expect(await deployedContract.tokenURI(number)).to.equal(baseURI + `${number}`);
  });

});

describe("Generation", function () {

  it("get generation amount", async function () {
    const { deployedContract } = await loadFixture(deployNFT);

    expect(await deployedContract.getFirstGenerationAmount()).to.equal(0);
  });

  it("lookup generation", async function () {
    const { deployedContract } = await loadFixture(deployNFT);

    expect(await deployedContract.getIsFirstGenerationAmount(1)).to.equal(false);
  });

  it("set generation 1000", async function () {
    const { deployedContract } = await loadFixture(deployNFT);

    const number = 1000
    expect(await deployedContract.setFirstGenAmount(number));
    expect(await deployedContract.getFirstGenerationAmount()).to.equal(number);
  });

  it("set generation 2000", async function () {
    const { deployedContract } = await loadFixture(deployNFT);

    const number = 2000
    expect(await deployedContract.setFirstGenAmount(number));
    expect(await deployedContract.getFirstGenerationAmount()).to.equal(number);
  });

  it("set generation 1 and verify", async function () {
    const { deployedContract, otherAccount } = await loadFixture(deployNFT);

    const number = 1
    expect(await deployedContract.setFirstGenAmount(number));
    expect(await deployedContract.getFirstGenerationAmount()).to.equal(number);

    expect(await deployedContract.mint(otherAccount.address));
    expect(await deployedContract.getIsFirstGenerationAmount(0)).to.equal(true);

    expect(await deployedContract.mint(otherAccount.address));
    expect(await deployedContract.getIsFirstGenerationAmount(1)).to.equal(false);
  });

});

describe("Approved", function () {

  it("isApprovedForAll", async function () {
    const { deployedContract, owner, otherAccount } = await loadFixture(deployNFT);

    expect(await deployedContract.isApprovedForAll(owner.address, owner.address)).to.equal(false);
  });

  it("set ApprovedForAll to self", async function () {
    const { deployedContract, owner } = await loadFixture(deployNFT);

    await expect(deployedContract.setApprovalForAll(owner.address, true)).to.be.reverted;
  });

  it("set ApprovedForAll", async function () {
    const { deployedContract, owner, otherAccount } = await loadFixture(deployNFT);

    expect(await deployedContract.isApprovedForAll(owner.address, otherAccount.address)).to.equal(false);
    expect(await deployedContract.setApprovalForAll(otherAccount.address, true));
    expect(await deployedContract.isApprovedForAll(owner.address, otherAccount.address)).to.equal(true);
  });

  it("opensea proxy contract ApprovedForAll", async function () {
    const { deployedContract, owner, otherAccount } = await loadFixture(deployNFT);

    const openseaProxyContract = "0x58807baD0B376efc12F5AD86aAc70E78ed67deaE"
    expect(await deployedContract.isApprovedForAll(owner.address, openseaProxyContract)).to.equal(true);
    expect(await deployedContract.isApprovedForAll(otherAccount.address, openseaProxyContract)).to.equal(true);
  });


});

describe("mint", function () {

  it("owner mint", async function () {
    const { deployedContract, otherAccount } = await loadFixture(deployNFT);
    expect(await deployedContract.mint(otherAccount.address));
  });

  it("others mint", async function () {
    const { deployedContract, owner, otherAccount } = await loadFixture(deployNFT);
    const sorcerer2 = deployedContract.connect(otherAccount)
    await expect(sorcerer2.mint(otherAccount.address, { from: otherAccount.address })).to.be.reverted;
  });

});

describe("balance", function () {

  it("balanceOf", async function () {
    const { deployedContract, owner, otherAccount } = await loadFixture(deployNFT);
    expect(await deployedContract.balanceOf(otherAccount.address)).to.equal(0);
    expect(await deployedContract.mint(otherAccount.address));
    expect(await deployedContract.balanceOf(otherAccount.address)).to.equal(1);
    expect(await deployedContract.mint(otherAccount.address));
    expect(await deployedContract.balanceOf(otherAccount.address)).to.equal(2);
  });

});


describe("burn", function () {

  it("burn token by other reverted", async function () {
    const { deployedContract, owner, otherAccount } = await loadFixture(deployNFT);
    expect(await deployedContract.balanceOf(otherAccount.address)).to.equal(0);
    expect(await deployedContract.mint(otherAccount.address));

    await expect(deployedContract.burn(0)).to.be.reverted;
  });

  it("burn token by other passed", async function () {
    const { deployedContract, owner, otherAccount } = await loadFixture(deployNFT);
    expect(await deployedContract.balanceOf(otherAccount.address)).to.equal(0);
    expect(await deployedContract.mint(otherAccount.address));

    const sorcerer2 = deployedContract.connect(otherAccount);
    expect(await sorcerer2.setApprovalForAll(owner.address, true));

    const index = 0;
    await expect(deployedContract.burn(index))
      .to.emit(deployedContract, "burnToken(address,address,uint256)")
      .withArgs(owner.address, otherAccount.address, index);
  });

  it("burn token by self", async function () {
    const { deployedContract, owner, otherAccount } = await loadFixture(deployNFT);
    expect(await deployedContract.balanceOf(otherAccount.address)).to.equal(0);
    expect(await deployedContract.mint(otherAccount.address));

    const sorcerer2 = deployedContract.connect(otherAccount);
    const index = 0;
    await expect(sorcerer2.burn(index))
      .to.emit(sorcerer2, "burnToken(address,address,uint256)")
      .withArgs(otherAccount.address, otherAccount.address, index);

    expect(await deployedContract.balanceOf(otherAccount.address)).to.equal(0);
  });

});