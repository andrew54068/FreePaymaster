# Deploy FreePaymaster

###### This project demonstrates how to deploy a FreePaymaster meaning that the paymaster don't check the data as long as the input format is correct.

### Deploy Smart Contract on EVM and verify it with etherscan
1. copy a file from `.env.example`, rename it to `.env` and fill in each value.
2. Edit the targetNonce you wish to use in `scripts/deploy.ts`.
3. Type following commends from this project's root directory.
```shell
npm install
npx hardhat clean
npx hardhat run --network goerli scripts/deployAndVerify.ts
```

### Enable Paymaster
1. change the default network from `hardhat.config.ts`
2. Make sure you have enough ETH your private key wallet.
```shell
npx ts-node scripts/enablePaymaster.ts ${your_contract_address}
```

### version
✅ node version v18.16.0