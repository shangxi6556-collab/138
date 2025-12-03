const { expect } = require("chai");

describe("RedEnvelopePool", function () {
  it("should work", async function () {
    const [owner, user1, user2] = await ethers.getSigners();
    const Pool = await ethers.getContractFactory("RedEnvelopePool");
    const Token = await ethers.getContractFactory("BinanceRedPacket");

    const pool = await Pool.deploy("0x0000000000000000000000000000000000000000");
    await pool.waitForDeployment();

    const token = await Token.deploy(pool.target);
    await token.waitForDeployment();

    await token.transfer(user1.address, ethers.parseEther("20000"));
    await token.transfer(user2.address, ethers.parseEther("15000"));

    await pool.updateHolderCount(2);
    await pool.openRedEnvelope([user1.address, user2.address]);
  });
});