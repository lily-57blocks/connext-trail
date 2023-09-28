const hre = require("hardhat");
const { config } = require("../scripts/config.js");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const network = hre.network.name;
  console.log("Deploying to network: ", network);

  if (network !== "polygonMumbai") {
    console.log(
      "Skipping ConnextMessageExecutor deployment on non-polygonMumbai network"
    );
    return;
  }
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const { connext, destChainDomainId } = config[network];

  await deploy("ConnextMessageExecutor", {
    from: deployer,
    args: [connext, destChainDomainId],
    log: true,
  });
};
module.exports.tags = ["ConnextMessageExecutor"];
