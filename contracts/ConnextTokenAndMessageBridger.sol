// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@connext/smart-contracts/contracts/core/connext/interfaces/IConnext.sol";

error InvalidAddress();

contract ConnextTokenAndMessageBridger is Ownable {
    IConnext public immutable connext;
    address public destContract;
    address public underlying;
    uint32 public destChainDomain;

    event UpdateUnderlying(address underlying_);
    event UpdateDestContract(address newContract);
    event UpdateDestChainDomain(uint32 newDomain);
    event StartBridgeToken(
        address indexed sender,
        address indexed receiver,
        uint256 amount
    );

    constructor(
        address connext_,
        address underlying_,
        uint32 destChainDomain_
    ) Ownable() {
        connext = IConnext(connext_);
        underlying = underlying_;
        destChainDomain = destChainDomain_;
    }

    function updateUnderlying(address underlying_) external onlyOwner {
        underlying = underlying_;
        emit UpdateUnderlying(underlying_);
    }

    function updateDestContract(address newContract) external onlyOwner {
        if (newContract == address(0)) revert InvalidAddress();
        destContract = newContract;
        emit UpdateDestContract(newContract);
    }

    function updateDestChainDomain(uint32 newDomain) external onlyOwner {
        destChainDomain = newDomain;
        emit UpdateDestChainDomain(newDomain);
    }

    function bridgeToken(
        address receiver,
        uint256 amount,
        uint256 slippage
    ) external payable {
        if (amount == 0) return;

        IERC20 token = IERC20(underlying);

        token.transferFrom(msg.sender, address(this), amount);

        token.approve(address(connext), amount);

        bytes memory data = abi.encode(receiver);
        connext.xcall{value: msg.value}(
            destChainDomain,
            destContract, // address of the target contract
            underlying,
            msg.sender,
            amount,
            slippage,
            data
        );
        emit StartBridgeToken(msg.sender, receiver, amount);
    }
}
