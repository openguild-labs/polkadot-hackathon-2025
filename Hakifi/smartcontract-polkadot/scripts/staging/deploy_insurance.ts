import hre from "hardhat"
import "dotenv/config"

async function main() {
    const HakifiProxy = await hre.ethers.getContractFactory("HakifiProxy")
    console.log("Deploying HakifiProxy ...")
    const hakifiProxy = await hre.upgrades.deployProxy(
        HakifiProxy,
        [process.env.USDTTESTNETADDRESS, process.env.VNSTTESTNETADDRESS],
        { kind: "uups" },
    )
    console.log("HakifiProxy deployed to:", hakifiProxy.target)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
