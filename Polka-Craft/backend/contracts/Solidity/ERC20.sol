// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyERC20Token {
    // Token metadata
    string private _name;
    string private _symbol;
    string memory address;
    uint8 private _decimals;

    // Total supply and balances
    uint256 private _totalSupply;
    mapping(address => uint256) private _balances;
    
    // Allowances for spending
    mapping(address => mapping(address => uint256)) private _allowances;

    // Events
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    // Constructor to initialize token details
    constructor(
        string memory name_, 
        string memory symbol_, 
        uint8 decimals_, 
        uint256 totalSupply_
    ) {
        _name = name_;
        _symbol = symbol_;
        _decimals = decimals_;
        _totalSupply = totalSupply_;
        
        // Assign total supply to contract deployer
        _balances[msg.sender] = totalSupply_;
    }

    // Optional metadata functions
    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view returns (uint8) {
        return _decimals;
    }

    // Total supply function
    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    // Balance of an account
    function balanceOf(address _owner) public view returns (uint256) {
        return _balances[_owner];
    }

    // Transfer tokens
    function transfer(address _to, uint256 _value) public returns (bool) {
        require(_to != address(0), "Invalid recipient address");
        require(_balances[msg.sender] >= _value, "Insufficient balance");

        _balances[msg.sender] -= _value;
        _balances[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    // Transfer from a specific address (requires prior approval)
    function transferFrom(
        address _from, 
        address _to, 
        uint256 _value
    ) public returns (bool) {
        require(_from != address(0), "Invalid sender address");
        require(_to != address(0), "Invalid recipient address");
        require(_balances[_from] >= _value, "Insufficient balance");
        require(_allowances[_from][msg.sender] >= _value, "Insufficient allowance");

        _balances[_from] -= _value;
        _balances[_to] += _value;
        _allowances[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);
        return true;
    }

    // Approve spending allowance
    function approve(address _spender, uint256 _value) public returns (bool) {
        require(_spender != address(0), "Invalid spender address");

        _allowances[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    // Check remaining allowance
    function allowance(
        address _owner, 
        address _spender
    ) public view returns (uint256) {
        return _allowances[_owner][_spender];
    }

    // Optional: Mint new tokens (only owner should call this)
    function mint(address _to, uint256 _value) public {
        require(_to != address(0), "Invalid recipient address");

        _balances[_to] += _value;
        _totalSupply += _value;

        emit Transfer(address(0), _to, _value);
    }

    // Optional: Burn tokens
    function burn(uint256 _value) public {
        require(_balances[msg.sender] >= _value, "Insufficient balance");

        _balances[msg.sender] -= _value;
        _totalSupply -= _value;

        emit Transfer(msg.sender, address(0), _value);
    }
}
