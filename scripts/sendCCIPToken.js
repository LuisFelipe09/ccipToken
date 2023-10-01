const { ethers } = require("hardhat");
const { abi } = require("../artifacts/contracts/USDF.sol/USDF.json")
const { abiSource} = require("../artifacts/contracts/SourceToken.sol/SourceToken.json")
require('dotenv').config()

function getTimestampInSeconds() {
    // returns current timestamp in seconds
    return Math.floor(Date.now() / 1000);
  }
  
  async function main() {
  
    // get a provider instance
    const provider = new ethers.providers.StaticJsonRpcProvider(process.env.RPC_URL)
  
    // get the network chain id
    const chainId = (await provider.getNetwork()).chainId;
  
    // create a signer instance with the token owner
    const tokenOwner = await new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider)

    // create a signer instance with the token receiver
    const tokenReceiver = await new ethers.Wallet(process.env.PRIVATE_KEY_ACCOUNT_2, provider)
  
    // get the MyToken contract factory and deploy a new instance of the contract
    const myToken = new ethers.Contract("0xAE62A17f53F4938FD114fbC1A6D2cF04A76329E6", abi, provider)
  
    // check account balances
    let tokenOwnerBalance = (await myToken.balanceOf(tokenOwner.address)).toString()
    let tokenReceiverBalance = (await myToken.balanceOf(tokenReceiver.address)).toString()

    console.log(`Starting tokenOwner balance: ${tokenOwnerBalance}`);
    console.log(`Starting tokenReceiver balance: ${tokenReceiverBalance}`);
  
    // set token value and deadline
    const value = ethers.utils.parseEther("1");
    const deadline = getTimestampInSeconds() + 4200;
  
    // get the current nonce for the deployer address
    const nonces = await myToken.nonces(tokenOwner.address);
  
    // set the domain parameters
    const domain = {
      name: await myToken.name(),
      version: "1",
      chainId: chainId,
      verifyingContract: myToken.address
    };
  
    // set the Permit type parameters
    const types = {
      Permit: [{
          name: "owner",
          type: "address"
        },
        {
          name: "spender",
          type: "address"
        },
        {
          name: "value",
          type: "uint256"
        },
        {
          name: "nonce",
          type: "uint256"
        },
        {
          name: "deadline",
          type: "uint256"
        },
      ],
    };
  
    // set the Permit type values
    const values = {
      owner: tokenOwner.address,
      spender: tokenReceiver.address,
      value: value,
      nonce: nonces,
      deadline: deadline,
    };
  
    // sign the Permit type data with the deployer's private key
    const signature = await tokenOwner._signTypedData(domain, types, values);
  
    // split the signature into its components
    const sig = ethers.utils.splitSignature(signature);
  
    // verify the Permit type data with the signature
    const recovered = ethers.utils.verifyTypedData(
      domain,
      types,
      values,
      sig
    );
  
    // get network gas price
    gasPrice = await provider.getGasPrice();

    // send token from fuji to sepolia

    const providerFuji = new ethers.providers.StaticJsonRpcProvider(`https://avalanche-fuji.infura.io/v3/${process.env.INFURA_ID}`)
    const tokenOwnerFuji = await new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, providerFuji)

    const source = new ethers.Contract("0x02269273Ff83a11855c19AEF21A8E762770fA642", abiSource, providerFuji)
  
    // permit the tokenReceiver address to spend tokens on behalf of the tokenOwner
    let tx = await source.connect(tokenOwnerFuji).transferOnSepolia(
      tokenOwner.address,
      tokenReceiver.address,
      value,
      deadline,
      sig.v,
      sig.r,
      sig.s
    );
  
    await tx.wait(2) //wait 2 blocks after tx is confirmed

    console.log(tx)
  
    // check that the tokenReceiver address can now spend tokens on behalf of the tokenOwner
    console.log(`Check allowance of tokenReceiver: ${await myToken.allowance(tokenOwner.address, tokenReceiver.address)}`);
  
    
  }
  
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });