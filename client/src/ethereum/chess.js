import web3 from "./web3";

const address = "0xFee91fBc28DF4c102A3e006E63AA12C137b576c9";
//0xD1793B709bb5EFBE17D56ddBbb52C2F458F459BA
//0x1123a98666F1DD048A975E06551BCbF2D96cc228

const abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_tokens",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_stakingToken",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_game_id",
        type: "uint256",
      },
    ],
    name: "tokensStaked",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "activeGames",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "token1Address",
        type: "address",
      },
      {
        internalType: "contract IERC20",
        name: "token2Address",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "token1Amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "token2Amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "usd_value",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "player_count",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_stakingToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_game_id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_tokens",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_player_2",
        type: "address",
      },
    ],
    name: "addPlayer2",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_stakingToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "_player_1",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_tokens",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_usd_value",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "urlgame_id",
        type: "string",
      },
    ],
    name: "createMatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "game_id",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_winner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_game_id",
        type: "uint256",
      },
    ],
    name: "transferWinnerAmount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "urlGameidtocontractGamid",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_player",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_game_id",
        type: "uint256",
      },
    ],
    name: "withdrawAmount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export default new web3.eth.Contract(abi, address);
