pragma solidity ^0.5.16;

contract EveToc {
    //token standard: return total token supply public-initialized in constructor
    uint256 public totalSupply;
    string public name = "Eve Token";
    string public symbol = "EVE";
    string public standard = "EVE Token v1";

    //balanceOf()- as defined in erc20 token standard-takes address and gives uint256 basically balance in the address
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address _spender, uint256 _value);


    constructor(uint256 _initialTotalSupply) public {
        balanceOf[msg.sender] = _initialTotalSupply;
        totalSupply = _initialTotalSupply;
    }

    // trasnsfer function to send 
    function transfer(address _to, uint256 _value) public returns(bool success) {
        //require(balanceOf[msg.sender] != 0, 'No balance'); 
        require(balanceOf[msg.sender] >= _value, 'insufficient balance = revert');
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    // trasnfer without sender initiating transfer i.e (delegated transfer) 
    // transferFrom, approve, allowance, log approval

    function approve(address _spender, uint256 _value) public returns(bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns(bool success) {
        require(balanceOf[_from] >= _value, 'insufficient balance in spenders account = revert');
        require(allowance[_from][msg.sender] >= _value, 'insufficient required allowance = revert');
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }


}