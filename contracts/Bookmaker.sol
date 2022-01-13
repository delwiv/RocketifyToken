// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol';

contract Bookmaker {
    enum Goal { Empty, High, Low }
    enum Status { New, Pending, Finished }
    struct Price {
        uint256 timestamp;
        int256 price;
        uint80 roundID;
    }
    struct Bet {
        uint256 amount;
        mapping(address => Goal) gamblers;
        mapping(address => bool) ready;
        uint256 ethDiff;
        uint256 startDate;
        int256 startEthPrice;
        uint80 startRoundID;
        int256 endEthPrice;
        address[] gamblerAddresses;
        Status status;
        Price[] history;
        Goal winnerPosition;
        string name;
    }

    uint256 numBets;
    mapping(uint256 => Bet) public bets;
    AggregatorV3Interface public priceFeed;

    address public owner;

    constructor() {
        owner = msg.sender;
        priceFeed = AggregatorV3Interface(
            0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
        );
    }

    modifier onlyOwner {
        require(msg.sender == owner, 'Only owner can call this function.');
        _;
    }

    function getBetCount() public view returns (uint256) {
        return numBets;
    }

    function createBet(
        uint256 amount,
        uint256 ethDiff,
        string memory name
    ) public {
        Bet storage bet = bets[numBets++];

        bet.amount = amount;
        bet.name = name;
        bet.ethDiff = ethDiff;
        bet.status = Status.New;
        bet.gamblers[msg.sender] = Goal.Empty;
    }

    function hasSubscribed(uint256 betIndex) public view returns (bool) {
        Bet storage bet = bets[betIndex];
        return
            bet.gamblers[msg.sender] == Goal.High ||
            bet.gamblers[msg.sender] == Goal.Low;
    }

    function isReady(uint256 betIndex) public view returns (bool) {
        Bet storage bet = bets[betIndex];
        return bet.ready[msg.sender] == true;
    }

    function subscribe(uint256 betIndex, Goal goal) public payable {
        Bet storage bet = bets[betIndex];
        require(
            address(msg.sender).balance >= bet.amount,
            "You don't own enougth Ethers"
        );
        require(
            msg.value == bet.amount,
            'Amount sent does not match required amount.'
        );
        require(
            bet.status == Status.New,
            'This bet is no more accepting new gamblers.'
        );
        require(
            bet.ready[msg.sender] != true,
            'You are ready on this bet, wait for another ready gambler to start the bet.'
        );
        require(
            bet.gamblers[msg.sender] != Goal.Low &&
                bet.gamblers[msg.sender] != Goal.High,
            'You already subscribed to this bet.'
        );
        bet.gamblers[msg.sender] = goal;
        bet.gamblerAddresses.push(msg.sender);
    }

    function ready(uint256 betIndex) public {
        Bet storage bet = bets[betIndex];
        require(
            bet.gamblers[msg.sender] == Goal.High ||
                bet.gamblers[msg.sender] == Goal.Low,
            'User must subscribe first.'
        );
        bet.ready[msg.sender] = true;
        if (bet.gamblerAddresses.length > 1) {
            bool allReady = true;
            for (uint256 i = 0; i < bet.gamblerAddresses.length; i++) {
                address cur = bet.gamblerAddresses[i];
                if (!bet.ready[cur]) {
                    allReady = false;
                }
            }
            if (allReady) {
                (
                    uint80 roundID,
                    int256 price,
                    ,
                    uint256 timestamp,

                ) = priceFeed.latestRoundData();
                bet.startDate = timestamp;
                bet.status = Status.Pending;
                bet.startEthPrice = price;
                bet.startRoundID = roundID;
                bet.history.push(
                    Price({
                        timestamp: timestamp,
                        price: price,
                        roundID: roundID
                    })
                );
            }
        }
    }

    function getPriceAt(uint80 _roundID)
        public
        view
        returns (
            int256 price,
            uint256 timestamp,
            uint80 roundID
        )
    {
        (, int256 _price, , uint256 _timestamp, ) = priceFeed.getRoundData(
            _roundID
        );
        require(_timestamp != 0, 'This round has not finished yet.');
        return (_price, _timestamp, _roundID);
    }

    function checkBets() public {
        for (uint256 i = 0; i < numBets; i++) {
            Bet storage bet = bets[i];
            if (bet.status == Status.Pending) {
                Price storage lastPrice = bet.history[bet.history.length - 1];
                while (true) {
                    (
                        int256 nextPrice,
                        uint256 nextTimestamp,
                        uint80 nextRoundID
                    ) = getPriceAt(lastPrice.roundID + 1);
                    if (nextTimestamp == 0) {
                        break;
                    }
                    bet.history.push(
                        Price({
                            price: nextPrice,
                            timestamp: nextTimestamp,
                            roundID: nextRoundID
                        })
                    );
                    lastPrice = bet.history[bet.history.length - 1];
                    int256 diff = nextPrice - int256(bet.startEthPrice);
                    if (diff >= int256(bet.ethDiff)) {
                        bet.status = Status.Finished;
                        bet.endEthPrice = nextPrice;
                        bet.winnerPosition = Goal.High;
                        break;
                    } else if (diff <= int256(bet.ethDiff)) {
                        bet.status = Status.Finished;
                        bet.endEthPrice = nextPrice;
                        bet.winnerPosition = Goal.Low;
                        break;
                    }
                }
            }
        }
    }

    function getCurrentEthPrice() public view returns (int256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return price;
    }
}
