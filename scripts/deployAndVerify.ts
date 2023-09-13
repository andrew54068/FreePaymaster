/* Compile And Push To Eth Network */
// import * as hre from "hardhat" 
const hre = require("hardhat");
import HDWalletProvider from "@truffle/hdwallet-provider"
// const HDWalletProvider = require("@truffle/hdwallet-provider");
import * as dotenv from "dotenv"
import { increaseNonce } from "../utils/nonceCounter";
import Web3 from "web3"
dotenv.config();

const privateKey = process.env["PRIVATE_KEY"]; /* YOUR PRIVATE KEY ... */
const infuraProjectId = process.env["INFURA_PROJECT_ID"]
const providerOrUrl = "https://goerli.infura.io/v3/" + infuraProjectId; /* GOERLI ENDPOINT */
// const providerOrUrl = "https://polygon-mumbai.infura.io/v3/" + infuraProjectId; /* MUMBI ENDPOINT */
// const providerOrUrl = "https://arbitrum-mainnet.infura.io/v3/" + infuraProjectId; /* ARBITRUM ENDPOINT */
// const providerOrUrl = "https://optimism-goerli.infura.io/v3/" + infuraProjectId; /* ARBITRUM GOERLI ENDPOINT */

if (!privateKey) process.exit()
const provider = new HDWalletProvider(privateKey, providerOrUrl);
const address = provider.getAddress()
const web3 = new Web3(provider as any);

const deployAndVerifyWithNonce = async (nonce: number) => {
  await increaseNonce(0, nonce, address, web3, privateKey)
  console.log(`✅ next transaction nonce will be ${nonce}`);

  const contractName = "FreePaymaster";
  const contract = hre.ethers.getContractFactory(contractName);
  console.log(`⏳ you are going to deploy contract: ${contractName}`);

  const entryPoint = '0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789'
  const constructorArguments: any[] = [entryPoint];
  const deployedContract = await hre.ethers.deployContract(
    contractName,
    constructorArguments
  );

  await deployedContract.deployed()

  console.log(`✅ ${contractName} deployed address: ${JSON.stringify(deployedContract.address, null, '  ')}`);
  console.log(`✅ ${contractName} deployed tx: ${JSON.stringify(deployedContract.deployTransaction.hash, null, '  ')}`);
  console.log(`✅ ${deployedContract.deployTransaction.from} nonce: ${JSON.stringify(deployedContract.deployTransaction.nonce, null, '  ')}`);

  const exec = async () => {
    try {
      await hre.run("verify:verify", {
        address: deployedContract.address,
        constructorArguments,
      });
    } catch (e) {
      console.log(`💥 e: ${e}`);
      console.log(`💥 e json: ${JSON.stringify(e, null, "  ")}`);
    }
  }
  await exec()
}

(async () => {
  const targetNonce = 0
  await deployAndVerifyWithNonce(targetNonce)
  process.exit()
})();
