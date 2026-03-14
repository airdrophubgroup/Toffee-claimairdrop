// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract ToffeeAirdrop {
    using ECDSA for bytes32;
    address public signer;
    IERC20 public token;
    mapping(string => bool) public usedCodes;

    constructor(address _token, address _signer) {
        token = IERC20(_token);
        signer = _signer;
    }

    function claim(string memory code, bytes memory signature, uint256 amount) public {
        require(!usedCodes[code], "Used");
        bytes32 hash = keccak256(abi.encodePacked(msg.sender, amount, code));
        require(hash.toEthSignedMessageHash().recover(signature) == signer, "Invalid");
        
        usedCodes[code] = true;
        token.transfer(msg.sender, amount);
    }
}
