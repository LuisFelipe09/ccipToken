const { ethers } = require("hardhat");
const { abi } = require("../artifacts/contracts/USDF.sol/USDF.json")
require('dotenv').config()

function getTimestampInSeconds() {
    // returns current timestamp in seconds
    return Math.floor(Date.now() / 1000);
}

async function main() {

    // get a provider instance
    const provider = new ethers.providers.StaticJsonRpcProvider(process.env.RPC_URL)

    const tokenOwner = await new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider)

    // create a signer instance with the token receiver
    const tokenReceiver = await new ethers.Wallet(process.env.PRIVATE_KEY_ACCOUNT_2, provider)
  
    // get the MyToken contract factory and deploy a new instance of the contract
    const myToken = new ethers.Contract("0xAE62A17f53F4938FD114fbC1A6D2cF04A76329E6", abi, provider)
  
    const value = ethers.utils.parseEther("1");
    gasPrice = await provider.getGasPrice();
    console.log(`Check allowance of tokenReceiver: ${await myToken.allowance(tokenOwner.address, tokenReceiver.address)}`);
  
    // transfer tokens from the tokenOwner to the tokenReceiver address
    tx = await myToken.connect(tokenReceiver).transferFrom(
      tokenOwner.address,
      tokenReceiver.address,
      value, {
        gasPrice: gasPrice,
        gasLimit: 80000 //hardcoded gas limit; change if needed
      }
    );
  
    await tx.wait(2) //wait 2 blocks after tx is confirmed

    // Get ending balances
    tokenOwnerBalance = (await myToken.balanceOf(tokenOwner.address)).toString()
    tokenReceiverBalance = (await myToken.balanceOf(tokenOwner.address)).toString()

    console.log(`Ending tokenOwner balance: ${tokenOwnerBalance}`);
    console.log(`Ending tokenReceiver balance: ${tokenReceiverBalance}`);
  
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });