const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require("../compile");

let accounts;
let lottery;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  console.log(accounts);
  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: "1000000 " });
});

describe("Lottery Contract", () => {
  it("deploy a contract", () => {
    assert.ok(lottery.options.address);
  });

  it("allow one account to enter", async () => {
    await lottery.methods
      .enter()
      .send({ from: accounts[0], value: web3.utils.toWei("2", "ether") });

    const players = await lottery.methods
      .getPlayers()
      .call({ from: accounts[0] });
    assert.equal(accounts[0], players[0]);
  });

  it("requires a minimum amount of ether to enter", async () => {
    try {
      await lottery.methods.enter().send({ from: accounts[0], value: 0 });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it("only manager can call pickerWiner", async () => {
    try {
      await lottery.methods.pickWinner().send({ from: accounts[1] });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it("send money to the winner and resets the player array", async () => {
    await lottery.methods
      .enter()
      .send({ from: accounts[0], value: web3.utils.toWei("2", "ether") });
    const initialBalance = await web3.eth.getBalance(accounts[0]);

    await lottery.methods.pickWinner().send({ from: accounts[0] });

    const finalBalance = await web3.eth.getBalance(accounts[0]);

    const difference = finalBalance - initialBalance;
    console.log(finalBalance - initialBalance);
    console.log(web3.utils.toWei("1.8", "ether"));
    assert(difference > web3.utils.toWei("1.8", "ether"));
  });
});

// const assert = require("assert");
// const ganache = require("ganache-cli");
// const Web3 = require("web3");
// const web3 = new Web3(ganache.provider());
// const { interface, bytecode } = require("../compile");

// let accounts;
// let inbox;
// beforeEach(async () => {
//   accounts = await web3.eth.getAccounts();

//   inbox = await new web3.eth.Contract(JSON.parse(interface))
//     .deploy({ data: bytecode, arguments: ["Hi born"] })
//     .send({ from: accounts[0], gas: "1000000" });
// });

// describe("Inbox", () => {
//   it("deploy contracts", () => {
//     assert.ok(inbox.options.address);
//   });

//   it("has a default message", async () => {
//     const message = await inbox.methods.message().call();
//     assert.equal(message, "Hi born");
//   });

//   it("can change the message", async () => {
//     await inbox.methods.setMessage("Hi bro!").send({ from: accounts[0] });
//     const message = await inbox.methods.message().call();
//     console.log(JSON.parse(interface));

//     assert.equal(message, "Hi bro!");
//   });
// });
