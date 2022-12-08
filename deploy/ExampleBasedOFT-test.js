const LZ_ENDPOINTS = require("../constants/layerzeroEndpoints.json")
const OFT_CONFIG = require("../constants/oftConfig.json")
const { ethers } = require("hardhat")

// module.exports = async function ({ deployments, getNamedAccounts }) {

//     // // ########################################################
//     // // ########################################################
//     // // ########################################################

//     // const { deploy } = deployments
//     // const { deployer } = await getNamedAccounts()

//     // console.log(`>>> your address: ${deployer}`)

//     // if (hre.network.name !== OFT_CONFIG.baseChain) {
//     //     console.log("*** Warning: Use [rinkeby] as the base chain for this example!")
//     //     return
//     // }

//     // // get the Endpoint address
//     // const endpointAddr = LZ_ENDPOINTS[hre.network.name]
//     // const globalSupply = ethers.utils.parseUnits(OFT_CONFIG.globalSupply, 18)
//     // console.log(`[${hre.network.name}] LayerZero Endpoint address: ${endpointAddr}`)

//     // await deploy("ExampleBasedOFT", {
//     //     from: deployer,
//     //     args: [endpointAddr, globalSupply],
//     //     log: true,
//     //     waitConfirmations: 1,
//     // })

//     // // ########################################################
//     // // ########################################################
//     // // ########################################################

// }



module.exports = async function () {

    // use this chainId
    let chainIdSrc = 1
    let chainIdDst = 2
    let name = "OmnichainFungibleToken"
    let symbol = "OFT"
    let globalSupply = ethers.utils.parseUnits("1000000", 18)
    let owner = (await ethers.getSigners())[0]

    let BasedOFT = await ethers.getContractFactory("ExampleBasedOFT")
    let OFT = await ethers.getContractFactory("OFT")

    let LZEndpointMock = await ethers.getContractFactory("LZEndpointMock")

    let lzEndpointSrcMock = await LZEndpointMock.deploy(chainIdSrc)
    let lzEndpointDstMock = await LZEndpointMock.deploy(chainIdDst)

    let OFTSrc = await BasedOFT.deploy(lzEndpointSrcMock.address, globalSupply)
    let OFTDst = await OFT.deploy(name, symbol, lzEndpointDstMock.address)

    // internal bookkeeping for endpoints (not part of a real deploy, just for this test)
    lzEndpointSrcMock.setDestLzEndpoint(OFTDst.address, lzEndpointDstMock.address)
    lzEndpointDstMock.setDestLzEndpoint(OFTSrc.address, lzEndpointSrcMock.address)

    // // set each contracts source address so it can send to each other
    // await OFTSrc.setTrustedRemote(chainIdDst, OFTDst.address) // for A, set B
    // await OFTDst.setTrustedRemote(chainIdSrc, OFTSrc.address) // for B, set A

    // set each contracts source address so it can send to each other
    await OFTSrc.setTrustedRemote(
        chainIdDst, 
        ethers.utils.solidityPack(["address", "address"], [OFTDst.address, OFTSrc.address])
    ) // for A, set B

    await OFTDst.setTrustedRemote(
        chainIdSrc, 
        ethers.utils.solidityPack(["address", "address"], [OFTSrc.address, OFTDst.address])
    ) // for B, set A

    let txSetup = await (
        await OFTSrc.setIsSendingRequest(true)
    ).wait()
        
    let tx = await (
        await OFTDst.incrementCounterFunds(
            chainIdSrc,
            ethers.utils.parseEther("0.000002"),
            owner.address,
            { value: ethers.utils.parseEther("0.1") } // estimate/guess
        )
    ).wait()

    console.log("test after")

    let compareFunds = await (
        await OFTSrc.compareRequestFunds(owner.address)
    ).wait();

    let diffAmount = await OFTSrc.getamountDifference(owner.address);

    console.log("Funds request by user of destination chain to source chain", (await OFTSrc.getamountDifference(owner.address)).toBigInt())

    // console.log("diffAmount.isZero()", !diffAmount.isZero())

    console.log("balance (owner) on the source chain before transaction", (await OFTSrc.balanceOf(owner.address)).toBigInt())
    console.log("balance (owner) on the destination chain before transaction", (await OFTDst.balanceOf(owner.address)).toBigInt())

    if (!diffAmount.isZero()) {

        let txFundsSetup = await(
            await OFTDst.setIsSendingRequest(false)
        ).wait()

        let nativeFee = (await OFTSrc.estimateSendFee(chainIdDst, owner.address, diffAmount, false, "0x")).nativeFee;

        let txFunds = await (
            await OFTSrc.sendFrom(
                owner.address,
                chainIdDst, // destination LayerZero chainId
                owner.address, // the 'to' address to send tokens
                ethers.utils.parseUnits("10000", 18), // the amount of tokens to send (in wei)
                owner.address, // the refund address (if too much message fee is sent, it gets refunded)
                ethers.constants.AddressZero,
                "0x",
                { value: nativeFee } // estimate/guess 1 eth will cover
            )
        ).wait()

        console.log("balance (owner) on the source chain after transaction", (await OFTSrc.balanceOf(owner.address)).toBigInt())
        console.log("balance (owner) on the destination chain after transaction", (await OFTDst.balanceOf(owner.address)).toBigInt())

    }
}

module.exports.tags = ["ExampleBasedOFT-test"]
