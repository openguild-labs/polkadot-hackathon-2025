using System;
using CiFarm.Core.Credentials;
using Newtonsoft.Json;

namespace CiFarm.RestApi
{
    [Serializable]
    public class GenerateSignatureRequest
    {
        // Public properties with automatic getters and setters
        [JsonProperty("chainKey")]
        public SupportedChainKey ChainKey { get; set; }

        [JsonProperty("network")]
        public Network Network { get; set; }

        [JsonProperty("accountNumber")]
        public int AccountNumber { get; set; }
    }

    [Serializable]
    public class GenerateSignatureResponse
    {
        // Public properties with automatic getters and setters
        [JsonProperty("chainKey")]
        public SupportedChainKey ChainKey { get; set; }

        [JsonProperty("message")]
        public string Message { get; set; }

        [JsonProperty("publicKey")]
        public string PublicKey { get; set; }

        [JsonProperty("signature")]
        public string Signature { get; set; }

        [JsonProperty("network")]
        public Network Network { get; set; }

        [JsonProperty("telegramInitDataRaw")]
        public string TelegramInitDataRaw { get; set; }

        [JsonProperty("accountAddress")]
        public string AccountAddress { get; set; }
    }
}
