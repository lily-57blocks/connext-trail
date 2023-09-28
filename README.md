# Connext Token Bridge Tutorial

This project demonstrates using Connext to bridge test [token](https://goerli.etherscan.io/address/0x7ea6eA49B0b0Ae9c5db7907d139D9Cd3439862a1) on TestNet (from goerli to polygon mumbai).
More details you can go through the official document [Quickstart](https://docs.connext.network/developers/quickstart)

ConnextTokenBridger.sol: respond to bridge token
ConnextTokenAndMessageBridger.sol: respond to bridge token but the receiver on destination to receive the token is in payload
ConnextMessageExecutor.sol: the receiver contract that ConnextTokenAndMessageBridger bridge token to. it will encode payload and transfer
the token to the real receiver

The cross chain transaction need some native token as relayer fee. you can get more from [Estimating Fees](https://docs.connext.network/developers/guides/estimating-fees).

## Guide

0. Set up the environments with yarn
   `yarn install`

1. Update the settings in .env.sample file. Change the .env.example filename to .env

   - DEPLOYER_PRIVATE_KEY to deploy smart contracts
   - TESTER_PRIVATE_KEY to send transaction to call smart contracts
   - GOERLI_RPC_URL and POLYGON_MUMBAI_RPC_URL the rpc urls on goerli or mumbai
   - ETHERSCAN_API_KEY and POL_ETHERSCAN_API_KEY to auto verify smart contract

2. Deploy the example contracts on goerli testnet and polygon testnet. Make sure the deployer have gas tokens on both chains

   - `npx hardhat --network polygonMumbai deploy`
   - `npx hardhat --network goerli deploy`

3. Initialize the other settings of contracts

   - `npx hardhat run --network polygonMumbai scripts/initContracts.js`
   - `npx hardhat run --network goerli scripts/initContracts.js`

4. Test the flow by running the below command. (You can change the param in function to change the bridge token amount)

   - `npx hardhat run --network goerli scripts/bridgeToken.js`
   - `npx hardhat run --network goerli scripts/bridgeTokenWithPayload.js`

5. After send bridge token transaction, you can use [Connextscan](https://testnet.connextscan.io/transfers) to track the status of
   bridge token transaction. Just search up the transaction hash from the execution transaction.
