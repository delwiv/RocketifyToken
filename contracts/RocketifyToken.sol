// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract RocketifyToken is ERC20 {
    uint256 INITIAL_SUPPLY;
    uint256 public burnedAmount;
    mapping(address => uint256) public burnByAddress;
    mapping(address => string) public userNames;
    address[] allAddresses;

    constructor() ERC20('RocketifyToken', 'ROCKET') {
        INITIAL_SUPPLY = 100 * 10**decimals();
        _mint(msg.sender, INITIAL_SUPPLY);
        allAddresses.push(msg.sender);
    }

    function setName(string memory userName) public {
        userNames[msg.sender] = userName;
    }

    function redeemWelcome() public {
        require(
            balanceOf(msg.sender) < INITIAL_SUPPLY,
            'You already redeemed and never spent'
        );
        if (balanceOf(msg.sender) == 0 && burnByAddress[msg.sender] == 0) {
            allAddresses.push(msg.sender);
        }
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    function getMyBalance() public view returns (uint256) {
        return balanceOf(msg.sender);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
        burnedAmount += amount;
        burnByAddress[msg.sender] += amount;
    }

    function getBurnByAddress(address addr) public view returns (uint256) {
        return burnByAddress[addr];
    }

    function getAddressCount() public view returns (uint256) {
        return allAddresses.length;
    }

    function getAddressByIndex(uint256 index) public view returns (address) {
        return allAddresses[index];
    }

    function transferRocket(address to, uint256 amount) public payable {
        if (balanceOf(to) == 0 && burnByAddress[to] == 0) {
            allAddresses.push(to);
        }
        transfer(to, amount);
    }
}
