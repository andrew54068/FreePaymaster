/* Compile And Push To Eth Network */
const hre = require("hardhat");
// import HDWalletProvider from "@truffle/hdwallet-provider"
const HDWalletProvider = require("@truffle/hdwallet-provider");
import * as dotenv from "dotenv"
import Web3 from "web3"
dotenv.config();

const privateKey = process.env["PRIVATE_KEY"]; /* YOUR PRIVATE KEY ... */
const infuraProjectId = process.env["INFURA_PROJECT_ID"]
// const providerOrUrl = "https://goerli.infura.io/v3/" + infuraProjectId; /* GOERLI ENDPOINT */
// const providerOrUrl = "https://polygon-mumbai.infura.io/v3/" + infuraProjectId; /* MUMBI ENDPOINT */
// const providerOrUrl = "https://arbitrum-mainnet.infura.io/v3/" + infuraProjectId; /* ARBITRUM ENDPOINT */
const providerOrUrl = "https://optimism-goerli.infura.io/v3/" + infuraProjectId; /* ARBITRUM GOERLI ENDPOINT */

if (!privateKey) process.exit()
const provider = new HDWalletProvider(privateKey, providerOrUrl);
const web3 = new Web3(provider as any);

(async () => {
  const contractName = "FreePaymaster";
  const Contract = await hre.ethers.getContractFactory(contractName);
  const contract = await Contract.attach("0x411bafa5a252F47e27B399Ab48e0A7aDcB4256A1");
  console.log(`⏳ you are going to use contract: ${contractName}`);
  const eth = web3.utils.toWei('0.002', 'ether')
  const addStakeTx = await contract.addStake(300, { value: eth })
  console.log(`⏳ addStakeTx: ${JSON.stringify(addStakeTx, null, '  ')}`);
  const addStakeReceipt = await addStakeTx.wait()
  console.log(`✅ addStakeReceipt: ${JSON.stringify(addStakeReceipt, null, '  ')}`);
  
  const depositTx = await contract.deposit({ value: eth })
  console.log(`⏳ depositTx: ${JSON.stringify(depositTx, null, '  ')}`);
  const depositTxReceipt = await depositTx.wait()
  console.log(`✅ depositTxReceipt: ${JSON.stringify(depositTxReceipt, null, '  ')}`);
  process.exit()
})();
