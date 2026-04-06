// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GoodsTransaction {
    struct GoodsRecord {
        address farmer;
        address warehouse;
        string goods;
        uint256 quantity;
        uint256 paymentAmount;
        bool isPaid;
        uint256 timestamp;
    }

    GoodsRecord[] private goodsRecords;

    event GoodsAdded(
        uint256 indexed goodsId,
        address indexed farmer,
        address indexed warehouse,
        string goods,
        uint256 quantity,
        uint256 paymentAmount,
        uint256 timestamp
    );

    event GoodsPaid(
        uint256 indexed goodsId,
        address indexed farmer,
        address indexed warehouse,
        uint256 paymentAmount,
        uint256 timestamp
    );

    function addGoods(
        address warehouse,
        string calldata goods,
        uint256 quantity,
        uint256 paymentAmount
    ) external {
        require(warehouse != address(0), "Warehouse address is required");
        require(bytes(goods).length > 0, "Goods name is required");
        require(quantity > 0, "Quantity must be greater than zero");
        require(paymentAmount > 0, "Payment amount must be greater than zero");

        goodsRecords.push(
            GoodsRecord({
                farmer: msg.sender,
                warehouse: warehouse,
                goods: goods,
                quantity: quantity,
                paymentAmount: paymentAmount,
                isPaid: false,
                timestamp: block.timestamp
            })
        );

        uint256 goodsId = goodsRecords.length - 1;

        emit GoodsAdded(
            goodsId,
            msg.sender,
            warehouse,
            goods,
            quantity,
            paymentAmount,
            block.timestamp
        );
    }

    function payForGoods(uint256 goodsId) external payable {
        require(goodsId < goodsRecords.length, "Goods record does not exist");

        GoodsRecord storage record = goodsRecords[goodsId];

        require(!record.isPaid, "Goods already paid");
        require(msg.sender == record.warehouse, "Only the warehouse can pay");
        require(msg.value == record.paymentAmount, "Incorrect payment amount");

        record.isPaid = true;

        (bool success, ) = payable(record.farmer).call{value: msg.value}("");
        require(success, "ETH transfer failed");

        emit GoodsPaid(
            goodsId,
            record.farmer,
            record.warehouse,
            record.paymentAmount,
            block.timestamp
        );
    }

    function getGoods(uint256 goodsId) external view returns (GoodsRecord memory) {
        require(goodsId < goodsRecords.length, "Goods record does not exist");
        return goodsRecords[goodsId];
    }

    function getAllGoods() external view returns (GoodsRecord[] memory) {
        return goodsRecords;
    }

    function getGoodsCount() external view returns (uint256) {
        return goodsRecords.length;
    }
}
