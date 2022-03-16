//https://eth-ropsten.alchemyapi.io/v2/kjRTfRy8Ec6Wls4gsvoRivvPMV2eDUc4

require('@nomiclabs/hardhat-waffle');

module.exports = {
    solidity: '0.8.0',
    networks:{
      ropsten:{
        url:'https://eth-ropsten.alchemyapi.io/v2/kjRTfRy8Ec6Wls4gsvoRivvPMV2eDUc4',
        accounts:['fa902aa4fe11dbb28650ae689d3d78ecc3ba4bfa4bcbb96da59efef643615af5']
      }
    }
}

