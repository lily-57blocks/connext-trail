const hre = require("hardhat");
const { config } = require("../scripts/config.js");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const network = hre.network.name;
  console.log("Deploying to network: ", network);

  if (network !== "goerli") {
    console.log(
      "Skipping ConnextTokenBridger deployment on non-goerli network"
    );
    return;
  }
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const { connext, token } = config[network];

  await deploy("ConnextTokenBridger", {
    from: deployer,
    args: [connext, token],
    log: true,
  });
};
module.exports.tags = ["ConnextTokenBridger"];
