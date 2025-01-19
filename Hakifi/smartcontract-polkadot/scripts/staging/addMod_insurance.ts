import hre from "hardhat"
import "dotenv/config"

async function main() {
  const Hakifi = await hre.ethers.getContractFactory("Hakifi")
  const hakifiContract = Hakifi.attach(process.env.PROXYTESTNETADDRESS as string)
  //  Add mod
  console.log(
    await hakifiContract.addMod(process.env.TESTNETMOD, {
      gasLimit: 0x1000000,
    }),
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
