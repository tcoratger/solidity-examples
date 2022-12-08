const CHAIN_ID = require("../constants/chainIds.json")
const { getDeploymentAddresses } = require("../utils/readStatic")
const OFT_CONFIG = require("../constants/oftConfig.json")

module.exports = async function (taskArgs) {

    let signers = await ethers.getSigners()
    let owner = signers[0]
    let tx
    const dstChainId = CHAIN_ID[taskArgs.targetNetwork]

    let srcContractName = "ExampleBasedOFT"
    let dstContractName = "ExampleOFT"

    // the destination contract address
    const dstAddr = getDeploymentAddresses(taskArgs.targetNetwork)[dstContractName]
    // get source contract instance
    const basedOFT = await ethers.getContract(srcContractName)
    console.log(`[source] address: ${basedOFT.address}`)


    let amountTmp = await basedOFT.getaccountRequestFundsTmp(owner.address)
    let amount = await basedOFT.getaccountRequestFunds(owner.address)


    // console.log("amountTmp", amountTmp)
    // console.log("amount", amount)

    // console.log("amountTest", await basedOFT.getaccountRequestFundsTmp("0x0000000000000000000000000000000000000000"))
    console.log("amountTest", await basedOFT.getaccountRequestFundsTmp(owner.address))

    console.log("amountTest", await basedOFT.amountTest())






    // let amount = await basedOFT.compareRequestFunds(owner.address);

    // console.log("amount", amount);


    // if (amount !== 0) {

    //     tx = await (
    //         await basedOFT.sendFrom(
    //             owner.address,
    //             dstChainId, // destination LayerZero chainId
    //             owner.address, // the 'to' address to send tokens
    //             ethers.utils.parseEther(amount.toString()), // the amount of tokens to send (in wei)
    //             owner.address, // the refund address (if too much message fee is sent, it gets refunded)
    //             ethers.constants.AddressZero,
    //             "0x",
    //             { value: ethers.utils.parseEther("0.01") } // estimate/guess 1 eth will cover
    //         )
    //     ).wait()
    
    //     console.log(`✅ Message Sent [${hre.network.name}] sendTokens() to OFT @ LZ chainId[${dstChainId}] token:[${dstAddr}]`)
    //     console.log(` tx: ${tx.transactionHash}`)
    //     console.log(`* check your address [${owner.address}] on the destination chain, in the ERC20 transaction tab !"`)

    // }
}
