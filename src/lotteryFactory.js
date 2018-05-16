import web3 from "./web3";

const address = "0xd3df5861d4f37c0912b54fc004e5e020fd98c77e";

const abi = [
  {
    constant: true,
    inputs: [{ name: "", type: "uint256" }],
    name: "lotteries",
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
    constant: true,
    inputs: [{ name: "", type: "address" }],
    name: "indexOf",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
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
  },
  {
    constant: true,
    inputs: [],
    name: "getLotteries",
    outputs: [{ name: "", type: "address[]" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  }
];

export default new web3.eth.Contract(abi, address);
