const { getContractAddresses } = require("./getContractAddresses.js");

async function setExecutorSource() {
  const network = hre.network.name;
  if (network !== "polygonMumbai") {
    console.log("Skipping setExecutorSource on non-polygonMumbai network");
    return;
  }

  console.log(`Running setExecutorSource on ${network}`);
  const contractName = "ConnextMessageExecutor";
  const executorAddress = getContractAddresses(network, contractName)[
    contractName
  ];
  console.log(`ConnextMessageExecutor's Address: ${executorAddress}`);

  const executor = await hre.ethers.getContractAt(
    contractName,
    executorAddress
  );

  const sourceName = "ConnextTokenAndMessageBridger";
  const sourceAddress = getContractAddresses("goerli", sourceName)[sourceName];
  console.log(`ConnextTokenAndMessageBridger's Address: ${sourceAddress}`);

  const res = await executor.updateSourceContract(sourceAddress);
  console.log(`executor's updateSourceContract tx: ${res.hash}`);
  await res.wait();
}

async function setBridgerDestination() {
  const network = hre.network.name;
  if (network !== "goerli") {
    console.log("Skipping setBridgerDestination on non-goerli network");
    return;
  }

  console.log(`Running setBridgerDestination on ${network}`);
  const contractName = "ConnextTokenAndMessageBridger";
  const contractAddress = getContractAddresses(network, contractName)[
    contractName
  ];
  console.log(`ConnextTokenAndMessageBridger's Address: ${contractAddress}`);

  const bridger = await hre.ethers.getContractAt(contractName, contractAddress);

  const destName = "ConnextMessageExecutor";
  const destAddress = getContractAddresses("polygonMumbai", destName)[destName];
  console.log(`ConnextMessageExecutor's Address: ${destAddress}`);

  const res = await bridger.updateDestContract(destAddress);
  console.log(`bridger's updateDestContract tx: ${res.hash}`);
  await res.wait();
}

(async function () {
  const network = hre.network.name;
  if (network === "goerli") {
    await setBridgerDestination();
  } else if (network === "polygonMumbai") {
    await setExecutorSource();
  } else {
    console.log(`Unsupported ${network}`);
  }
})().catch((error) => {
  console.error(error);
  process.exit(0);
});
