pragma solidity ^0.5.16;

contract EveToc {
    //token standard: return total token supply public-initialized in constructor
    uint256 public totalSupply;
    string public name = "Eve Token";
    string public symbol = "EVE";
    string public standard = "EVE Token v1"; 
    //balanceOf()- as defined in erc20 token standard-takes address and gives uint256 basically balance in the address
    mapping (address => uint256) public balanceOf;

    event Transfer(address indexed _from,address indexed _to, uint256 _value );

    constructor (uint256 _initialTotalSupply) public {
        balanceOf[msg.sender] = _initialTotalSupply;
        totalSupply = _initialTotalSupply; 
    }

    // trasnsfer function to send 
     function transfer(address _to, uint256 _value) public returns (bool success){
        //require(balanceOf[msg.sender] != 0, 'No balance'); 
        require(balanceOf[msg.sender] >= _value, 'transaction revert');
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
     }



}