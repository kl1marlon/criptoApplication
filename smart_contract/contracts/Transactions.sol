// SPDX-License-Identifier:UNLICENSED

pragma solidity ^0.8.0;

contract Transactions {
    uint256 transactionCount;

    event Transfer(address from, address receiver, uint amount, string message, uint256 timestamp, string keyword);

    //this is going to be similar to an object 
    struct TransferStruct{
        address sender;
        address receiver;
        uint amount;
        string message;
        uint256 timestamp;
        string keyword;

    }
    //se define un array con la estructura de transferstruct
    TransferStruct [] transactions;

    function addToBlockchain (address payable receiver, uint amount, string memory message, string memory keyword) public {
        transactionCount +=1;
        transactions.push(TransferStruct(msg.sender, receiver, amount, message, block.timestamp, keyword));
        
        emit Transfer(msg.sender, receiver, amount, message, block.timestamp, keyword);

    }
    function getTransactions () public view returns (TransferStruct[] memory) {
            //will return an array from transcactions 
            return transactions;
    }
    function getTransactionsCount() public view returns (uint256) {
        //will return transactions count
        return transactionCount;
        
    }
} 