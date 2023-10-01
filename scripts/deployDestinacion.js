// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  const contractToken = "0xAE62A17f53F4938FD114fbC1A6D2cF04A76329E6"

  const destination = await hre.ethers.deployContract("DestinationToken", [contractToken]);

  console.log(destination)

  // 0x9b0dF65813496E63A974A93D4bb40BE8BA7e7F78 on sepolia
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
