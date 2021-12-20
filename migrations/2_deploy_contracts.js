const RocketifyToken = artifacts.require('RocketifyToken')

module.exports = function (deployer) {
  deployer.deploy(RocketifyToken)
}
