export const DeliveryAbis = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "IsNotExitDelivery",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "IsNotOwner",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "IsNotValidator",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "Isinsufficient",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "token",
				"type": "address"
			}
		],
		"name": "SafeERC20FailedOperation",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "order_id",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "bytes32[]",
				"name": "station_ids",
				"type": "bytes32[]"
			},
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "name",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "isDone",
				"type": "bool"
			}
		],
		"name": "CreateOrder",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "station_id",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "name",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "total_order",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address[]",
				"name": "validitors",
				"type": "address[]"
			}
		],
		"name": "CreateStaion",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "delivery_id",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "station_id",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "total_amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "payment_amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "is_done",
				"type": "bool"
			}
		],
		"name": "InitPayment",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "delivery_id",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Pay",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "order_id",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "station_id",
				"type": "bytes32"
			}
		],
		"name": "Validate",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "delivery_id",
				"type": "bytes32"
			}
		],
		"name": "checkedDone",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32[]",
				"name": "_station_ids",
				"type": "bytes32[]"
			},
			{
				"internalType": "bytes32",
				"name": "_name",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "_sender",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_receiver",
				"type": "address"
			}
		],
		"name": "createOrder",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_name",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "_total_order",
				"type": "uint256"
			},
			{
				"internalType": "address[]",
				"name": "_validitors",
				"type": "address[]"
			}
		],
		"name": "createStation",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllOrder",
		"outputs": [
			{
				"components": [
					{
						"internalType": "bytes32",
						"name": "order_id",
						"type": "bytes32"
					},
					{
						"internalType": "bytes32[]",
						"name": "station_ids",
						"type": "bytes32[]"
					},
					{
						"internalType": "bytes32",
						"name": "name",
						"type": "bytes32"
					},
					{
						"internalType": "address",
						"name": "sender",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "receiver",
						"type": "address"
					},
					{
						"internalType": "bool",
						"name": "isDone",
						"type": "bool"
					}
				],
				"internalType": "struct delivery.Order[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllPayments",
		"outputs": [
			{
				"components": [
					{
						"internalType": "bytes32",
						"name": "delivery_id",
						"type": "bytes32"
					},
					{
						"internalType": "bytes32",
						"name": "station_id",
						"type": "bytes32"
					},
					{
						"internalType": "address",
						"name": "sender",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "total_amount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "payment_amount",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "is_done",
						"type": "bool"
					}
				],
				"internalType": "struct payment.Payment[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllStation",
		"outputs": [
			{
				"components": [
					{
						"internalType": "bytes32",
						"name": "station_id",
						"type": "bytes32"
					},
					{
						"internalType": "bytes32",
						"name": "name",
						"type": "bytes32"
					},
					{
						"internalType": "uint256",
						"name": "total_order",
						"type": "uint256"
					},
					{
						"internalType": "address[]",
						"name": "validitors",
						"type": "address[]"
					}
				],
				"internalType": "struct delivery.Station[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_order_id",
				"type": "bytes32"
			}
		],
		"name": "getDetailOrder",
		"outputs": [
			{
				"components": [
					{
						"internalType": "bytes32",
						"name": "order_id",
						"type": "bytes32"
					},
					{
						"internalType": "bytes32[]",
						"name": "station_ids",
						"type": "bytes32[]"
					},
					{
						"internalType": "bytes32",
						"name": "name",
						"type": "bytes32"
					},
					{
						"internalType": "address",
						"name": "sender",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "receiver",
						"type": "address"
					},
					{
						"internalType": "bool",
						"name": "isDone",
						"type": "bool"
					}
				],
				"internalType": "struct delivery.Order",
				"name": "order",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "delivery_id",
				"type": "bytes32"
			}
		],
		"name": "getDetailPayment",
		"outputs": [
			{
				"components": [
					{
						"internalType": "bytes32",
						"name": "delivery_id",
						"type": "bytes32"
					},
					{
						"internalType": "bytes32",
						"name": "station_id",
						"type": "bytes32"
					},
					{
						"internalType": "address",
						"name": "sender",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "total_amount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "payment_amount",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "is_done",
						"type": "bool"
					}
				],
				"internalType": "struct payment.Payment",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_station_id",
				"type": "bytes32"
			}
		],
		"name": "getDetailStation",
		"outputs": [
			{
				"components": [
					{
						"internalType": "bytes32",
						"name": "station_id",
						"type": "bytes32"
					},
					{
						"internalType": "bytes32",
						"name": "name",
						"type": "bytes32"
					},
					{
						"internalType": "uint256",
						"name": "total_order",
						"type": "uint256"
					},
					{
						"internalType": "address[]",
						"name": "validitors",
						"type": "address[]"
					}
				],
				"internalType": "struct delivery.Station",
				"name": "station",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_delivery_id",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "_station_id",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "_total_amount",
				"type": "uint256"
			}
		],
		"name": "initPayment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address[]",
				"name": "validators",
				"type": "address[]"
			}
		],
		"name": "isValidator",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "orders",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "order_id",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "name",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "isDone",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "delivery_id",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "pay",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "payments",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "delivery_id",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "station_id",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "total_amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "payment_amount",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "is_done",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "stations",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "station_id",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "name",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "total_order",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_order_id",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "_station_id",
				"type": "bytes32"
			}
		],
		"name": "validate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
