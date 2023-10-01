// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  const contractDestination = "0x9b0dF65813496E63A974A93D4bb40BE8BA7e7F78"

  const source = await hre.ethers.deployContract("SourceToken", [contractDestination]);

  console.log(source)

  //0x2dB2C0104B0627cB38C1059926467fF871Ae7DA1 on fuji
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
