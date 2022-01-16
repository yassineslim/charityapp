var donnation = artifacts.require("./donnation.sol");

module.exports = function(deployer) {
  deployer.deploy(donnation);
};
