// import "truffle/Assert.sol";
// import "truffle/DeployedAddresses.sol";

var Eve = artifacts.require("EveToc.sol");

contract ('Eve', function(accounts){

    it ('total supply check', function(){
        return Eve.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply){
            assert.equal(totalSupply.toNumber(), 10000000, 'total supply 10 M (10,000,000)');
        });
    });
})