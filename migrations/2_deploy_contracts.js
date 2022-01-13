const RocketifyToken = artifacts.require('RocketifyToken')
const Bookmaker = artifacts.require('Bookmaker')

module.exports = function (deployer) {
  //deployer.deploy(RocketifyToken)
  deployer.deploy(Bookmaker)
}
