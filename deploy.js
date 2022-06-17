const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { interface, bytecode } = require("./compile");

const provider = new HDWalletProvider(
  "fresh claim legal laundry sniff visual fresh favorite seat kind student zoo",
  "https://rinkeby.infura.io/v3/0146632458fd44038ab36feb8ab8f503"
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attemping to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ gas: "1000000", from: accounts[0] });
  console.log(interface);
  console.log("Contract deploy to ", result.options.address);
  provider.engine.stop();
};
deploy();
