module.exports = async function (_amount) {

    let signers = await ethers.getSigners()
    let owner = signers[0]


    // get source contract instance
    const basedOFT = await ethers.getContract("ExampleBasedOFT")
    console.log(`[source] address: ${basedOFT.address}`)

    // console.log(`approve tx: ${tx.transactionHash}`)

    // ########################################################
    // ########################################################
    // ########################################################

    // console.log(_amount.amount)

    // console.log("getAccountBalances", await basedOFT.getAccountBalances(owner.address))

    let tx = await (
        await owner.sendTransaction({
            to:basedOFT.address,
            value: ethers.utils.parseEther(_amount.amount)
        })
    ).wait()

    // console.log("getAccountBalances", await basedOFT.getAccountBalances(owner.address))
    // console.log("tx", tx)

    console.log("✅ Funds Sent, tx:", await tx.transactionHash)

    // ########################################################
    // ########################################################
    // ########################################################



}
