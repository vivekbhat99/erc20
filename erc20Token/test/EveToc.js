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


it('transfer success', function(){
    return Eve.deployed().then(function(instance){
        tokenInstance = instance;
        // testing "require" first by sending larger than the senders balance
        return tokenInstance.transfer.call(accounts[1], 9999999999999);
    }).then(assert.fail).catch(function(error){
         assert(error.message.indexOf('revert' >= 0, 'error message must contain revert'));
         return tokenInstance.transfer.call(accounts[1], 250000, { from: accounts[0] });
    }).then(function(success){
        assert.equal(success, true,'returns true');
        return tokenInstance.transfer(accounts[1], 250000, { from: accounts[0] });
    }).then(function(receipt){
        assert.equal(receipt.logs[0].length,1, 'transfer one event');
        assert.equal(receipt.logs[0].event, 'Transfer', 'the "Transfer" event');
        assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account thr tokens are transferred from');
        assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account thr token are transferred to');
        assert.equal(receipt.logs[0].args._value,250000, 'logs the transfer amount');
        return tokenInstance.balanceOf(accounts[1]);
    }).then(function(balance){
        assert.equal(balance.toNumber(), 250000,'adds amount to recevers account');
        return tokenInstance.balanceOf(accounts[0]);
    }).then(function(balance){
        assert.equal(balance.toNumber(), (10000000 - 250000),'remaining balance of senders account');
    });
});
