const { create } = require("@connext/sdk");

const sdkConfig = {
  network: "testnet",
  logLevel: "error",
  chains: {
    1735353714: {
      // goerli
      providers: ["https://rpc.ankr.com/eth_goerli"],
    },
    9991: {
      // polygon mumbai
      providers: [
        "https://polygon-mumbai.g.alchemy.com/v2/6eXrWO6NFRT5EMOPgIuQy7_Xe0MxQfBb",
      ],
    },
  },
};

async function getFee(originDomain, destinationDomain) {
  const { sdkBase } = await create(sdkConfig);
  const params = {
    originDomain,
    destinationDomain,
  };
  const relayerFee = await sdkBase.estimateRelayerFee(params);
  console.log(`relayer fee : ${relayerFee}`);
  return relayerFee;
}

exports.getFee = getFee;
