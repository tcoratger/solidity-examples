const CHAIN_ID = require("../constants/chainIds.json")

module.exports = async function (taskArgs) {

    let signers = await ethers.getSigners()
    let owner = signers[0]
    const dstChainId = CHAIN_ID[taskArgs.targetNetwork]


    // #######################################################################
    // #######################################################################
    // #######################################################################

    let OFT = await hre.ethers.getContract("ExampleOFT")
    console.log(`[source] OFT.address: ${OFT.address}`)

    let txsetRequest = await (
        await OFT.setRequest(
            ethers.utils.parseEther(taskArgs.amount),
            owner.address,
            { value: ethers.utils.parseEther("0.1") } // estimate/guess
        )
    ).wait()

    let tx = await (
        await OFT.incrementCounterFunds(
            dstChainId,
            ethers.utils.parseEther(taskArgs.amount),
            owner.address,
            { value: ethers.utils.parseEther("0.1") } // estimate/guess
        )
    ).wait()

    console.log(`✅ Message Sent [${hre.network.name}] incrementCounter on destination chain @ [${dstChainId}]`)
    console.log(`tx: ${tx.transactionHash}`)


    let amountTmp = await OFT.getaccountRequestFundsTmp(owner.address)
    let amount = await OFT.getaccountRequestFunds(owner.address)


    // console.log("amountTmp", amountTmp)
    // console.log("amount", amount)

    console.log("amount", await OFT.addressRequest())
    console.log("addressTest", await OFT.addressTest())






    // #######################################################################
    // #######################################################################
    // #######################################################################

    // // // get source contract instance
    // // let OFT = await hre.ethers.getContractAt("ExampleOFT", "0xc150d4Cd5CDD8051646A5AF2C66e0aa1ef43933B")
    // // // let OFT = await hre.ethers.getContract("ExampleOFT")

    // // // const OFTtmp = await ethers.getContractFactory("ExampleOFT");
    // // // const OFT = new ethers.Contract(OFTtmp, OFTtmp.interface, owner);

    // // // console.log("hre.ethers.getContractFactory", await hre.ethers.getContractFactory("ExampleOFT"))
    // // // console.log("signers", signers)

    // // // // // ########################################################
    // // // // // ########################################################
    // // // // // ########################################################

    // // let FundsPreRequest = await OFT.getAccountRequestFunds(owner.address)

    // // let tx = await (
    // //     await OFT.RequestFunds(
    // //         owner.address, 
    // //         ethers.utils.parseEther(taskArgs.amount)
    // //     )
    // // ).wait()

    // // let FundsPostRequest = await OFT.getAccountRequestFunds(owner.address)


    // // await hre.changeNetwork('rinkeby');
    // // hre.hardhatArguments.network = 'rinkeby';

    // let basedOFT = await ethers.getContract("ExampleBasedOFT")

    // // let basedOFT = await hre.ethers.getContractAt("ExampleBasedOFT", "0x3B1fCa945207592d8529532A175c096D931Cb632")

    // await hre.changeNetwork('goerli');
    // hre.hardhatArguments.network = 'goerli';

    // let tx1 = await (
    //     await owner.sendTransaction({
    //         chainId:5,
    //         to:basedOFT.address,
    //         value: ethers.utils.parseEther("0.00000001")
    //     })
    // ).wait()

    // // const basedOFTtmp = await ethers.getContractFactory("ExampleBasedOFT");
    // // const basedOFT = new ethers.Contract(basedOFTtmp, basedOFTtmp.interface, owner);

    // // console.log("OFT address", OFT.address)
    // console.log("tx.transactionHash", tx1.transactionHash)
    // // console.log("basedOFT", basedOFT)

    // // const dstChainId = CHAIN_ID[taskArgs.targetNetwork]
    // // console.log(`[source] address: ${OFT.address}`)


    // // // if (FundsPostRequest > FundsPreRequest) {

    // // //     let txFund = await (
    // // //         await basedOFT.sendFrom(
    // // //             owner.address,
    // // //             dstChainId, // destination LayerZero chainId
    // // //             owner.address, // the 'to' address to send tokens
    // // //             ethers.utils.parseEther(FundsPostRequest - FundsPreRequest), // the amount of tokens to send (in wei)
    // // //             owner.address, // the refund address (if too much message fee is sent, it gets refunded)
    // // //             ethers.constants.AddressZero,
    // // //             "0x",
    // // //             { value: ethers.utils.parseEther("0.01") } // estimate/guess 1 eth will cover
    // // //         )
    // // //     ).wait()
    // // //     console.log(`✅ Message Sent, tx: ${txFund.transactionHash}`)
    // // //     console.log(`* check your address [${owner.address}] on the destination chain, in the ERC20 transaction tab !"`)
    // // // }






    // // // // ########################################################
    // // // // ########################################################
    // // // // ########################################################

}
