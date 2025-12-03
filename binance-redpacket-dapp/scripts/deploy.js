async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // 部署池子
  const Pool = await ethers.getContractFactory("RedEnvelopePool");
  const pool = await Pool.deploy("0x0000000000000000000000000000000000000000");
  await pool.waitForDeployment();
  console.log("RedEnvelopePool:", pool.target);

  // 部署代币
  const Token = await ethers.getContractFactory("BinanceRedPacket");
  const token = await Token.deploy(pool.target);
  await token.waitForDeployment();
  console.log("BinanceRedPacket:", token.target);

  console.log("部署完成！去 Flap 启动吧");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});