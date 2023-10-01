require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()


function getNetwork (name) {
  return getNetwork1(`https://${name}.infura.io/v3/${process.env.INFURA_ID}`)
  // return getNetwork1(`wss://${name}.infura.io/ws/v3/${process.env.INFURA_ID}`)
}

function getNetwork1 (url) {
  return {
    url,
    accounts: [ process.env.WALLET_PRIVATE_KEY ]
  }
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    dev: { url: 'http://localhost:8545' },
    // github action starts localgeth service, for gas calculations
    localgeth: { url: 'http://localgeth:8545' },
    sepolia: getNetwork('sepolia'),
    fuji: getNetwork('avalanche-fuji'),
    proxy: getNetwork1('http://localhost:8545')
  },
};