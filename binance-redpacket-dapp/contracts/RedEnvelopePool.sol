// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract RedEnvelopePool is ReentrancyGuard {
    IERC20 public immutable token;
    address public immutable deployer;

    uint256 public constant MIN_HOLD = 10_000 * 1e18;
    uint256 public constant INTERVAL = 1 hours;
    uint256 public constant MAX_PACKETS = 100;

    uint256 public lastOpenTime;
    uint256 public qualifiedHolderCount; // 链下机器人更新

    mapping(address => bool) public hasClaimedThisRound;

    event RedEnvelopeOpened(address indexed opener, uint256 totalAmount, uint256 packets);
    event HolderUpdate(uint256 count);

    constructor(address _token) {
        token = IERC20(_token);
        deployer = msg.sender;
        lastOpenTime = block.timestamp;
    }

    // 只有部署者/机器人可更新持仓人数
    function updateHolderCount(uint256 count) external {
        require(msg.sender == deployer, "Only deployer");
        qualifiedHolderCount = count;
        emit HolderUpdate(count);
    }

    // 主函数：开红包（需要传入 winners 列表，由链下生成）
    function openRedEnvelope(address[] calldata winners) external nonReentrant {
        require(block.timestamp >= lastOpenTime + INTERVAL, "Too early");
        require(qualifiedHolderCount > 0, "Holder count not set");
        require(token.balanceOf(address(this)) > 0, "Empty pool");

        uint256 packetCount = qualifiedHolderCount / 10;
        if (packetCount > MAX_PACKETS) packetCount = MAX_PACKETS;
        if (packetCount == 0) packetCount = 1;
        require(winners.length >= packetCount, "Not enough winners");

        uint256 balance = token.balanceOf(address(this));
        uint256 minEach = 1e18;
        uint256 remaining = balance - (packetCount * minEach);
        if (remaining > balance) remaining = 0;

        uint256 totalSent = 0;
        for (uint256 i = 0; i < packetCount; i++) {
            address winner = winners[i];
            require(token.balanceOf(winner) >= MIN_HOLD, "Not qualified");
            require(!hasClaimedThisRound[winner], "Already claimed");

            uint256 extra = i < packetCount - 1 
                ? _random(0, remaining / (packetCount - i))
                : remaining;

            uint256 amount = minEach + extra;
            token.transfer(winner, amount);
            hasClaimedThisRound[winner] = true;
            totalSent += amount;
            remaining -= extra;
        }

        lastOpenTime = block.timestamp;
        emit RedEnvelopeOpened(msg.sender, totalSent, packetCount);
    }

    function _random(uint256 min, uint256 max) internal view returns (uint256) {
        if (max <= min) return min;
        return (uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender))) % (max - min)) + min;
    }

    function addReward(uint256) external {}

    function emergencyWithdraw(uint256 amount) external {
        require(msg.sender == deployer);
        token.transfer(deployer, amount);
    }
}