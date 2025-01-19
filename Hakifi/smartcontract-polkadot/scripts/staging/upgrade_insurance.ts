import hre from "hardhat"
import "dotenv/config"

async function main() {
  const Hakifi = await hre.ethers.getContractFactory("Hakifi")
  console.log("Upgrading Hakifi ...")
  const hakifi = await hre.upgrades.upgradeProxy(process.env.PROXYTESTNETADDRESS as string, Hakifi)
  console.log("Hakifi upgraded to:", hakifi.target)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
