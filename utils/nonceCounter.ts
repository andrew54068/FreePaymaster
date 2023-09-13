export const increaseNonce = async (
    latestPendingNonce: number,
    destination: number,
    deployerAddress: string,
    web3: any,
    privateKey: string
) => {
    const nextNonce = await web3.eth.getTransactionCount(deployerAddress)
    if (nextNonce == destination) {
        return
    } else if (nextNonce > destination) {
        throw Error(`tx count already exceed ${destination}`)
    }
    const txDetails = {
        to: deployerAddress,
        value: 0,  // Sending 0 Ether
        gas: 21000,
        gasPrice: web3.utils.toWei('1.5', 'gwei'),  // Gas price set to 50 Gwei
        nonce: latestPendingNonce + 1
    };
    const signedTx = await web3.eth.accounts.signTransaction(txDetails, privateKey)
    const tx = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
    console.log(`💥 tx: ${JSON.stringify(tx.transactionHash, null, '  ')}`);

    const count = await web3.eth.getTransactionCount(deployerAddress)
    if (count == destination) {
        return
    } else if (count > destination) {
        throw Error(`tx count already exceed ${destination}`)
    }
    await increaseNonce(latestPendingNonce + 1, destination, deployerAddress, web3, privateKey)
}