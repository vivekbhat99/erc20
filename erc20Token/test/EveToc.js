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



it('transfer', function(){
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
        assert.equal(receipt.logs.length,1, 'trigger only one event');
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

it ('approves tokens for delagated transfer', function(){
    return Eve.deployed().then(function(instance){
        tokenInstance = instance;
        return tokenInstance.approve.call(accounts[1], 100);
    }).then(function(success){
        assert.equal(success, true, 'returns true');
        return tokenInstance.approve(accounts[1], 100, { from: accounts[0]});
    }).then(function(receipt){
        assert.equal(receipt.logs.length,1, 'trigger only one event');
        assert.equal(receipt.logs[0].event, 'Approval', 'the "Approval" event');
        assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account thr tokens are transferred from');
        assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account thr token are transferred to');
        assert.equal(receipt.logs[0].args._value,100, 'logs the transfer amount');
        return tokenInstance.allowance(accounts[0], accounts[1]);
    }).then(function(allowance){
        assert.equal(allowance.toNumber(), 100, 'storing allowance for delagated transfer');
    });
});

it('handles delegated token transfers', function() {
    return Eve.deployed().then(function(instance) {
      tokenInstance = instance;
      _fromAccount = accounts[2];
      _toAccount = accounts[3];
      _spendingAccount = accounts[4];
      // Transfer some tokens to fromAccount
      return tokenInstance.transfer(_fromAccount, 100, { from: accounts[0] });
    }).then(function(receipt) {
      // Approve spendingAccount to spend 10 tokens form fromAccount
      return tokenInstance.approve(_spendingAccount, 50, { from: _fromAccount });
    }).then(function(receipt) {
      // Try transferring something larger than the sender's balance
      return tokenInstance.transferFrom(_fromAccount, _toAccount, 9999, { from: _spendingAccount });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, 'cannot transfer cuz insufficient balance');
      // Try transferring something larger than the approved amount
      return tokenInstance.transferFrom(_fromAccount, _toAccount, 70, { from: _spendingAccount });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, 'cannot transfer cuz value more approved');
      return tokenInstance.transferFrom.call(_fromAccount, _toAccount, 50, { from: _spendingAccount });
    }).then(function(success) {
      assert.equal(success, true);
      return tokenInstance.transferFrom(_fromAccount, _toAccount, 50, { from: _spendingAccount });
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
      assert.equal(receipt.logs[0].args._from, _fromAccount, 'logs the account the tokens are transferred from');
      assert.equal(receipt.logs[0].args._to, _toAccount, 'logs the account the tokens are transferred to');
      assert.equal(receipt.logs[0].args._value, 50, 'logs the transfer amount');
      return tokenInstance.balanceOf(_fromAccount);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), 50, 'deducts the amount from the sending account');
      return tokenInstance.balanceOf(_toAccount);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), 50, 'adds the amount from the receiving account');
      return tokenInstance.allowance(_fromAccount, _spendingAccount);
    }).then(function(allowance) {
      assert.equal(allowance.toNumber(), 0, 'deducts the amount from the allowance');
    });
  });
});


// it('transferFrom - delagated transfer', function(){
//     return Eve.deployed().then(function(instance){
//         tokenInstance = instance;
//         _fromAccount = accounts[2];
//         _toAccount = accounts[3];
//         _spendingAccount = accounts[4];
//         //transfering some tokens to _fromAccount
//         return tokenInstance.transferFrom(_fromAccount, 100, { from: accounts[0]});
//     }).then(function(receipt){
//         // approve 50 tokens from _spendingAccount
//         return tokenInstance.approve(_spendingAccount, 20, {from: _fromAccount});
//     }).then(function(receipt){
//         //try transfering larger amount 
//         return tokenInstance.transferFrom(_fromAccount, _toAccount, 99999, {from: _spendingAccount});
//     }).then(assert.fail).catch(function(error){
//         assert(error.message.indexOf('revert') >= 0, 'cannot transfer cuz  larger than balance');
//         // testing transfer larger than approved amount (allowance)
//         return tokenInstance.transferFrom(_fromAccount, toAccount, 30, {from: _spendingAccount});
//     }).then(assert.fail).catch(function(error){
//         assert(error.message.indexOf('revert') >= 0, 'cannot transfer cuz  larger approved amount (allownce)');
// });

// });

