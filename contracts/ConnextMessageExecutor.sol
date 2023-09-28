// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@connext/smart-contracts/contracts/core/connext/interfaces/IXReceiver.sol";

error CallerNotExecutor();
error InvalidFromChain();
error InvalidFromSource();
error InvalidAddress();

contract ConnextMessageExecutor is IXReceiver, Ownable {
    address public immutable connext;
    address public sourceContract;
    uint32 public sourceChainDomain;

    event UpdateSourceContract(address newSource);
    event UpdateSourceChainDomain(uint32 newDomain);
    event ReceivedOnDestination(
        address indexed asset,
        uint256 amount,
        address indexed to
    );

    modifier onlyExecutor() {
        if (msg.sender != connext) revert CallerNotExecutor();
        _;
    }

    modifier onlySource(address originSender, uint32 origin) {
        if (origin != sourceChainDomain) revert InvalidFromChain();
        if (originSender != sourceContract) revert InvalidFromSource();
        _;
    }

    constructor(address connext_, uint32 sourceChainDomain_) Ownable() {
        connext = connext_;
        sourceChainDomain = sourceChainDomain_;
    }

    function updateSourceContract(address newSource) external onlyOwner {
        if (newSource == address(0)) revert InvalidAddress();
        sourceContract = newSource;
        emit UpdateSourceContract(newSource);
    }

    function updateSourceChainDomain(uint32 newDomain) external onlyOwner {
        sourceChainDomain = newDomain;
        emit UpdateSourceChainDomain(newDomain);
    }

    function xReceive(
        bytes32 transferId,
        uint256 amount,
        address asset,
        address originSender,
        uint32 origin,
        bytes calldata data
    )
        external
        onlyExecutor
        onlySource(originSender, origin)
        returns (bytes memory)
    {
        if (amount == 0) return bytes("");
        address _toAddr = abi.decode(data, (address));
        IERC20(asset).transfer(_toAddr, amount);
        emit ReceivedOnDestination(asset, amount, _toAddr);
        return bytes("");
    }
}
