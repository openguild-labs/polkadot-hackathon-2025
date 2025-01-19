export const PaymentAbis = [
  {
    inputs: [],
    name: "IsNotExitDelivery",
    type: "error",
  },
  {
    inputs: [],
    name: "Isinsufficient",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "delivery_id",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "station_id",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "total_amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "payment_amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "is_done",
        type: "bool",
      },
    ],
    name: "InitPayment",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "delivery_id",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Pay",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "delivery_id",
        type: "bytes32",
      },
    ],
    name: "checkedDone",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllPayments",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "delivery_id",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "station_id",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "sender",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "total_amount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "payment_amount",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "is_done",
            type: "bool",
          },
        ],
        internalType: "struct payment.Payment[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "delivery_id",
        type: "bytes32",
      },
    ],
    name: "getDetailPayment",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "delivery_id",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "station_id",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "sender",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "total_amount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "payment_amount",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "is_done",
            type: "bool",
          },
        ],
        internalType: "struct payment.Payment",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_delivery_id",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_station_id",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "_total_amount",
        type: "uint256",
      },
    ],
    name: "initPayment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "delivery_id",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "pay",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "payments",
    outputs: [
      {
        internalType: "bytes32",
        name: "delivery_id",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "station_id",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "total_amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "payment_amount",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "is_done",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
