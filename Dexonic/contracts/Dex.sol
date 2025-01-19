// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Dex is ERC20 {
    address public token;
    address public defaultAdmin;

    constructor(address _token, address _defaultAdmin, string memory _name, string memory _symbol) ERC20(_name, _symbol) {
        token = _token;
        defaultAdmin = _defaultAdmin;
    }

    function getTokensInContract() public view returns (uint256) {
        return ERC20(token).balanceOf(address(this));
    }

    function addLiquidity(uint256 _amount) public payable returns (uint256) {
        uint256 _liquidity;
        uint256 balanceInEth = address(this).balance;
        uint256 tokenReserve = getTokensInContract();
        ERC20 _token = ERC20(token);

        if (tokenReserve == 0) {
            _token.transferFrom(msg.sender, address(this), _amount);
            _liquidity = balanceInEth;
            _mint(msg.sender, _amount);
        } else {
            uint256 reservedEth = balanceInEth - msg.value;
            require(
                _amount >= (msg.value * tokenReserve) / reservedEth,
                "Amount of tokens sent is less than the minimum tokens required"
            );
            _token.transferFrom(msg.sender, address(this), _amount);
            unchecked {
                _liquidity = (totalSupply() * msg.value) / reservedEth;
            }
            _mint(msg.sender, _liquidity);
        }
        return _liquidity;
    }

    function removeLiquidity(uint256 _amount) public returns (uint256, uint256) {
        require(_amount > 0, "Amount must be greater than 0");
        uint256 _reservedEth = address(this).balance;
        uint256 _totalSupply = totalSupply();

        uint256 _ethAmount = (_amount * _reservedEth) / _totalSupply;
        uint256 _tokenAmount = (getTokensInContract() * _amount) / _totalSupply;

        _burn(msg.sender, _amount);
        payable(msg.sender).transfer(_ethAmount);
        ERC20(token).transfer(msg.sender, _tokenAmount);
        return (_ethAmount, _tokenAmount);
    }

    function getAmountOfTokens(uint256 inputAmount, uint256 inputReserve, uint256 outputReserve) public pure returns (uint256) {
        require(inputReserve > 0 && outputReserve > 0, "Reserve must be greater than 0");
        uint256 numerator = inputAmount * outputReserve;
        uint256 denominator = (inputReserve * 100) + inputAmount;
        unchecked {
            return numerator / denominator;
        }
    }

    function swapEthToToken() public payable {
        uint256 _reservedToken = getTokensInContract();
        uint256 _tokensBought = getAmountOfTokens(msg.value, address(this).balance, _reservedToken);

        ERC20(token).transfer(msg.sender, _tokensBought);
    }

    function swapTokenToEth(uint256 _tokenSold) public {
        uint256 _reservedTokens = getTokensInContract();
        uint256 ethBought = getAmountOfTokens(_tokenSold, address(this).balance, _reservedTokens);

        ERC20(token).transferFrom(msg.sender, address(this), _tokenSold);
        payable(msg.sender).transfer(ethBought);
    }

}