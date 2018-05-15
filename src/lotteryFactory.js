import web3 from "./web3";

const address = "0x73b388008a5ebd15dba1098d3c41a97a8464a34a";

const abi = [
  {
    constant: true,
    inputs: [],
    name: "deployedLottery",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { name: "_duration", type: "uint256" },
      { name: "_lotteryValue", type: "uint256" }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "deployedLottery", type: "address" }],
    name: "LotteryDeployed",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "one", type: "address" },
      { indexed: false, name: "two", type: "address" }
    ],
    name: "Oe",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "previousOwner", type: "address" },
      { indexed: false, name: "newOwner", type: "address" }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    constant: false,
    inputs: [
      { name: "_duration", type: "uint256" },
      { name: "_lotteryValue", type: "uint256" }
    ],
    name: "createNewLottery",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  }
];

export default new web3.eth.Contract(abi, address);
