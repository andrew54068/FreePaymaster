# Sample Hardhat Project

###### This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

### Deploy Smart Contract on EVM
1. copy a file from `.env.example`, rename it to `.env` and fill in each value
2. Edit your contract
3. Type following commends from this project's root directory
```shell
npm install
npx hardhat clean
npx hardhat compile
npm run deploy
```

### Run Test
 If you want to run tests you must use Hardhat Network.
So please comment the line `defaultNetwork:` from `hardhat.config.ts`

### version
✅ node version v18.16.0