// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IRedEnvelopePool {
    function addReward(uint256 amount) external;
}

contract BinanceRedPacket is ERC20, Ownable {
    uint256 public constant TAX_RATE = 300;           // 3% = 300/10000
    uint256 public constant TAX_DENOMINATOR = 10000;

    IRedEnvelopePool public immutable pool;

    constructor(address _pool) ERC20("Binance RedPacket", "BNBRED") Ownable(msg.sender) {
        pool = IRedEnvelopePool(_pool);
        _mint(msg.sender, 1_000_000_000 * 1e18); // 10亿总供应
    }

    function _transfer(address from, address to, uint256 amount) internal override {
        // 部署者、池子、LP 对免税
        if (from == owner() || to == owner() || from == address(pool) || to == address(pool)) {
            super._transfer(from, to, amount);
            return;
        }

        uint256 tax = amount * TAX_RATE / TAX_DENOMINATOR;
        uint256 netAmount = amount - tax;

        if (tax > 0) {
            super._transfer(from, address(pool), tax);
            try pool.addReward(tax) {} catch {}
        }
        super._transfer(from, to, netAmount);
    }
}