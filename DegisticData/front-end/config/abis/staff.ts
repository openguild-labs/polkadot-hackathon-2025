export const StaffAbis = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_station_id",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "_staff_address",
        type: "address",
      },
    ],
    name: "addStaff",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "station_id",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "staff_address",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32[]",
        name: "order_ids",
        type: "bytes32[]",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "is_active",
        type: "bool",
      },
    ],
    name: "AddStaff",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_station_id",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_new_station_id",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "_staff_address",
        type: "address",
      },
    ],
    name: "modifyStaff",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "station_id",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "staff_address",
        type: "address",
      },
    ],
    name: "ModifyStaff",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_station_id",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "_staff_address",
        type: "address",
      },
    ],
    name: "removeStaff",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "station_id",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "staff_address",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "is_active",
        type: "bool",
      },
    ],
    name: "RemoveStaff",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_station_id",
        type: "bytes32",
      },
    ],
    name: "getAllStaffsOnStation",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "station_id",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "staff_address",
            type: "address",
          },
          {
            internalType: "bytes32[]",
            name: "order_ids",
            type: "bytes32[]",
          },
          {
            internalType: "bool",
            name: "is_active",
            type: "bool",
          },
        ],
        internalType: "struct staff.Staff[]",
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
        name: "_station_id",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "_staff_address",
        type: "address",
      },
    ],
    name: "isExistStaff",
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
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "staff_station",
    outputs: [
      {
        internalType: "bytes32",
        name: "station_id",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "staff_address",
        type: "address",
      },
      {
        internalType: "bool",
        name: "is_active",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
