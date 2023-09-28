const hre = require("hardhat");
const { config } = require("../scripts/config.js");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const network = hre.network.name;
  console.log("Deploying to network: ", network);

  if (network !== "goerli") {
    console.log(
      "Skipping ConnextTokenAndMessageBridger deployment on non-goerli network"
    );
    return;
  }
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const { connext, token, destChainDomainId } = config[network];

  await deploy("ConnextTokenAndMessageBridger", {
    from: deployer,
    args: [connext, token, destChainDomainId],
    log: true,
  });
};
module.exports.tags = ["ConnextTokenAndMessageBridger"];
