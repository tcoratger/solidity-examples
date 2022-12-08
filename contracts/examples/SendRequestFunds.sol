// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;
pragma abicoder v2;

import "../lzApp/NonblockingLzApp.sol";

/// @title A LayerZero example sending a cross chain message from a source chain to a destination chain to increment a counter
contract SendRequestFunds is NonblockingLzApp {
    uint public counter;

    constructor(address _lzEndpoint) NonblockingLzApp(_lzEndpoint) {}

    function _nonblockingLzReceive(uint16, bytes memory, uint64, bytes memory) internal override {
        counter += 1;
    }

    function incrementCounter(uint16 _dstChainId) public payable {
        _lzSend(_dstChainId, bytes(""), payable(msg.sender), address(0x0), bytes(""), msg.value);
    }





    // function _nonblockingLzReceive(uint16, bytes memory, uint64, bytes memory _payload) internal override {

    //     // decode the payload
    //     (uint256 _amount, address _address) = abi.decode(_payload, (uint256, address));

    //     accountRequestFundsTmp[_address] += _amount;
    // }

    // function incrementCounterFunds(uint16 _dstChainId, uint256 _amount, address _address) public payable {

    //     // encode the payload with amount and address
    //     bytes memory payload = abi.encode(_amount, _address);

    //     _lzSend(_dstChainId, payload, payable(msg.sender), address(0x0), bytes(""));
    // }
}
