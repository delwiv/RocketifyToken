require('dotenv').config()

const HDWalletProvider = require('@truffle/hdwallet-provider')
const path = require('path')

const mnemonic = process.env.MNEMONIC
const rinkebyUrl = process.env.RINKEBY_URL || 'wss://rinkeby.infura.io/ws/v3/09fceea799dd4efa9cdca1e8618f5d1f'

module.exports = {
  contracts_build_directory: path.join(__dirname, 'src', 'contracts'),
  networks: {
    ganache: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*',
      websockets: true
    },
    develop: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*'
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, rinkebyUrl),
      network_id: 4,
      gas: 2957067,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    }
  },
  compilers: {
    solc: {
      version: '^0.8.0'
    }
  }
}
