using System;
using CiFarm.Utils;
using UnityEngine;

namespace CiFarm.Core.Credentials
{
    // Enum to represent SupportedChainKey (you would replace these values with actual ones from your context)
    public enum SupportedChainKey
    {
        [EnumStringValue("solana")]
        Solana,

        [EnumStringValue("polkadot")]
        Polkadot,

        // Add other supported chains as necessary
        [EnumStringValue("avalanche")]
        Avalanche,
    }

    // Enum to represent Network (you would replace these values with actual ones from your context)
    public enum Network
    {
        [EnumStringValue("testnet")]
        Testnet,

        [EnumStringValue("mainnet")]
        Mainnet,
        // Add other networks as necessary
    }

    [Serializable]
    public class Credentials
    {
        [SerializeField]
        private SupportedChainKey _chainKey;

        [SerializeField]
        private string _message;

        [SerializeField]
        private string _publicKey;

        [SerializeField]
        private string _signature;

        [SerializeField]
        private Network _network;

        [SerializeField]
        private string _telegramInitDataRaw;

        [SerializeField]
        private string _accountAddress;

        public SupportedChainKey ChainKey
        {
            get => _chainKey;
            set => _chainKey = value;
        }

        public string Message
        {
            get => _message;
            set => _message = value;
        }

        public string PublicKey
        {
            get => _publicKey;
            set => _publicKey = value;
        }

        public string Signature
        {
            get => _signature;
            set => _signature = value;
        }

        public Network Network
        {
            get => _network;
            set => _network = value;
        }

        public string TelegramInitDataRaw
        {
            get => _telegramInitDataRaw;
            set => _telegramInitDataRaw = value;
        }

        public string AccountAddress
        {
            get => _accountAddress;
            set => _accountAddress = value;
        }
    }
}
