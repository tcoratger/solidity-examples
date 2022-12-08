// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "./IOFT.sol";
import "./OFTCore.sol";

// override decimal() function is needed
contract OFT is OFTCore, ERC20, IOFT {

    // constructor(string memory _name, string memory _symbol, address _lzEndpoint) ERC20(_name, _symbol) OFTCore(_lzEndpoint) {}

    mapping(address => uint256) public accountRequestFunds;
    mapping(address => uint256) public accountRequestFundsTmp;
    mapping(address => uint256) public amountDifference;
    uint256 public amountRequest;
    address public addressRequest;
    bool public isSendingRequest;

    constructor(string memory _name, string memory _symbol, address _lzEndpoint) ERC20(_name, _symbol) OFTCore(_lzEndpoint) {
        amountRequest = 0;
        addressRequest = address(0x0);
        isSendingRequest = false;
    }

    // ##############################################################
    // ##############################################################
    // ##############################################################

    // function RequestFunds(address accountAddress, uint256 amount) external virtual {
    //     accountRequestFunds[accountAddress] += amount;
    // }

    function getAccountRequestFunds(address accountAddress) external view returns (uint256) {
        return accountRequestFunds[accountAddress];
    }

    function setRequest(uint256 _amount, address _address) public payable virtual {
        amountRequest = _amount;
        addressRequest = _address;
    }

    function compareRequestFunds(address _address) external virtual {
        amountDifference[_address] = accountRequestFundsTmp[_address] - accountRequestFunds[_address];
        accountRequestFunds[_address] = accountRequestFundsTmp[_address];
    }

    function getamountDifference(address _address) external view returns (uint256) {
        return amountDifference[_address];
    }

    function getaccountRequestFundsTmp(address _address) external view returns (uint256) {
        return accountRequestFundsTmp[_address];
    }

    function getaccountRequestFunds(address _address) external view returns (uint256) {
        return accountRequestFunds[_address];
    }

    function getamountTest() external view returns (uint) {
        return amountRequest;
    }

    function setIsSendingRequest(bool _isSendingRequest) external virtual {
        isSendingRequest = _isSendingRequest;
    }

    // function _nonblockingLzReceive(uint16, bytes memory, uint64, bytes memory _payload) internal override {

    //     // decode the payload
    //     (uint256 _amount, address _address) = abi.decode(_payload, (uint256, address));

    //     accountRequestFundsTmp[_address] += _amount;
    // }

    function _nonblockingLzReceive(
        uint16 _srcChainId,
        bytes memory _srcAddress,
        uint64, /*_nonce*/
        bytes memory _payload
    ) internal virtual override {

        if (!isSendingRequest) {

            // decode and load the toAddress
            (bytes memory toAddressBytes, uint amount) = abi.decode(_payload, (bytes, uint));
            address toAddress;
            assembly {
                toAddress := mload(add(toAddressBytes, 20))
            }

            _creditTo(_srcChainId, toAddress, amount);

            emit ReceiveFromChain(_srcChainId, toAddress, amount);


        } else {

            // decode the payload
            (uint256 _amount, address _address) = abi.decode(_payload, (uint256, address));

            accountRequestFundsTmp[_address] += _amount;
        }
       
    }

    function incrementCounterFunds(uint16 _dstChainId, uint256 _amount, address _address) public payable {

        // encode the payload with amount and address
        bytes memory payload = abi.encode(_amount, _address);

        _lzSend(_dstChainId, payload, payable(msg.sender), address(0x0), bytes(""), msg.value);
    }

    // ##############################################################
    // ##############################################################
    // ##############################################################

    function supportsInterface(bytes4 interfaceId) public view virtual override(OFTCore, IERC165) returns (bool) {
        return interfaceId == type(IOFT).interfaceId || interfaceId == type(IERC20).interfaceId || super.supportsInterface(interfaceId);
    }

    function token() public view virtual override returns (address) {
        return address(this);
    }

    function circulatingSupply() public view virtual override returns (uint) {
        return totalSupply();
    }

    function _debitFrom(address _from, uint16, bytes memory, uint _amount) internal virtual override returns(uint) {
        address spender = _msgSender();
        if (_from != spender) _spendAllowance(_from, spender, _amount);
        _burn(_from, _amount);
        return _amount;
    }

    function _creditTo(uint16, address _toAddress, uint _amount) internal virtual override returns(uint) {
        _mint(_toAddress, _amount);
        return _amount;
    }
}
