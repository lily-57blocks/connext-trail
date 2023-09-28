// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@connext/smart-contracts/contracts/core/connext/interfaces/IConnext.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ConnextTokenBridger is Ownable {
    IConnext public immutable connext;
    address public underlying;

    event UpdateUnderlying(address underlying_);

    event StartBridgeToken(
        address indexed sender,
        address indexed receiver,
        uint256 amount
    );

    constructor(address connext_, address underlying_) {
        connext = IConnext(connext_);
        underlying = underlying_;
    }

    function updateUnderlying(address underlying_) external onlyOwner {
        underlying = underlying_;
        emit UpdateUnderlying(underlying_);
    }

    function bridgeToken(
        address receiver,
        uint256 amount,
        uint32 destChainDomain,
        uint256 slippage
    ) external payable {
        if (amount == 0) return;

        IERC20 token = IERC20(underlying);

        token.transferFrom(msg.sender, address(this), amount);

        token.approve(address(connext), amount);

        connext.xcall{value: msg.value}(
            destChainDomain, // Domain ID of the destination chain
            receiver, // the address of the recipient on the destination chain
            underlying, // address of the token contract
            msg.sender, // address that can revert or forceLocal on destination
            amount, // amount of tokens to transfer
            slippage, // max slippage the user will accept in BPS (e.g. 300 = 3%)
            bytes("") // the encoded calldata to send
        );
        emit StartBridgeToken(msg.sender, receiver, amount);
    }
}
