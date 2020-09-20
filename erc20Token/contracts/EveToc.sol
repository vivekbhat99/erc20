pragma solidity ^0.5.16;

contract EveToc {
    //token standard: return total token supply public-initialized in constructor
    uint256 public totalSupply;
    string public name = "Eve Token";
    string public symbol = "EVE";
    string public standard = "EVE Token v1"; 
    //balanceOf()- as defined in erc20 token standard-takes address and gives uint256 basically balance in the address
    mapping (address => uint256) public balanceOf;

    constructor (uint256 _initialTotalSupply) public {
        balanceOf[msg.sender] = _initialTotalSupply;
        totalSupply = _initialTotalSupply; 
    }


     



}