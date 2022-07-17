require("@nomiclabs/hardhat-waffle");


module.exports = {
  defaultNetwork: 'hardhat',
  networks:{
    hardhat:{
      chainId:1337,
    },
    mumbai:{
      url:"https://polygon-mumbai.g.alchemy.com/v2/73WgBlbD-QSENxX8R_QmJz8kGV6F6JQB",
      accounts: ['731d043f6d7ada73340c9dd2444a2f4810568216d81ba2dd4b627fd51447cda9']
    },
  },
  solidity: "0.8.4",
};
