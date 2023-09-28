const { getNamedAccounts } = require("hardhat");
const { ethers } = require("hardhat");
const { config } = require("./config.js");
const BigNumber = require("bignumber.js");
const { getContractAddresses } = require("./getContractAddresses.js");
const { getFee } = require("./relayerFee.js");

async function approve(user, bridger, amount) {
  const network = hre.network.name;
  if (network !== "goerli") {
    console.log("Skipping approve on non-goerli network");
    return;
  }
  console.log(`Approving token on ${network}`);
  const { token } = config[network];
  const tokenContract = await hre.ethers.getContractAt("IERC20", token);
  const balance = await tokenContract.balanceOf(user.address);
  console.log(`balance: ${balance}`);
  if (BigNumber(balance).isLessThan(BigNumber(amount))) {
    console.log(`insufficient balance: ${balance}, approve: ${amount}`);
    return;
  }
  const tx = await tokenContract.connect(user).approve(bridger, amount);
  console.log(
    `approve tx: ${tx.hash}, token: ${token}, amount: ${amount} to ${bridger}`
  );
  await tx.wait();
}

async function bridgeToken(amount) {
  const network = hre.network.name;
  if (network !== "goerli") {
    console.log("Skipping bridgeToken on non-goerli network");
    return;
  }
  const destChain = "polygonMumbai";
  console.log(`bridge token from ${network} to ${destChain}`);
  const contractName = "ConnextTokenBridger";
  const bridgerAddress = getContractAddresses(network, contractName)[
    contractName
  ];
  console.log(`ConnextTokenBridger's Address: ${bridgerAddress}`);
  let tokenBridger = await hre.ethers.getContractAt(
    contractName,
    bridgerAddress
  );
  const { tester: receiver } = await getNamedAccounts();
  console.log(`tester: ${receiver}`);
  const underling = await tokenBridger.underlying();
  console.log(`underlying: ${underling}`);
  const sender = await hre.ethers.getSigner(receiver);

  amount = ethers.parseUnits(amount, 18);

  await approve(sender, bridgerAddress, amount);

  const { chainDomainId, destChainDomainId } = config["goerli"];
  console.log(
    `chainDomainId: ${chainDomainId}, destChainDomainId: ${destChainDomainId}}`
  );
  let relayerFee = await getFee(chainDomainId, destChainDomainId);
  console.log(`relayerFee: ${relayerFee}`);
  const slippage = 500;
  let tx = await tokenBridger
    .connect(sender)
    .bridgeToken(receiver, amount, destChainDomainId, slippage, {
      value: `${relayerFee}`,
    });
  console.log(`bridgeToken tx: ${tx.hash}`);
}

bridgeToken("1").catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
