const EveToc = artifacts.require("./EveToc.sol");

module.exports = function(deployer) {
  deployer.deploy(EveToc);
};
