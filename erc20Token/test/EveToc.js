  //import "truffle/Assert.sol";
// import "truffle/DeployedAddresses.sol";

//const { assert } = require("console");
var assert = require('assert');

var Eve = artifacts.require("EveToc.sol");

contract ('Eve', function(accounts){
    var tokenInstance;
  
    it('initializes the contract with the correct- CHECK', function() {
      return Eve.deployed().then(function(instance) {
        tokenInstance = instance;
        return tokenInstance.name();
      }).then(function(name) {
        assert.equal(name, 'Eve Token', 'correct name check');
        return tokenInstance.symbol();
      }).then(function(symbol) {
        assert.equal(symbol, 'EVE', 'correct symbol check');
        return tokenInstance.standard();
      }).then(function(standard) {
        assert.equal(standard, 'EVE Token v1', 'correct standard CHECK');
      });
    })

it('allocates the initial supply upon deployment', function() {
    return Eve.deployed().then(function(instance) {
      tokenInstance = instance;
      return tokenInstance.totalSupply();
    }).then(function(totalSupply) {
      assert.equal(totalSupply.toNumber(), 10000000, 'setting Total supply to 10 Million');
      return tokenInstance.balanceOf(accounts[0]);
    }).then(function(initialToc) {
      assert.equal(initialToc.toNumber(), 10000000, 'allocates the initial supply to account');
    });
  });
});