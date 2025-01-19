using System;
using CiFarm.Core.Credentials;
using Newtonsoft.Json;

namespace CiFarm.RestApi
{
    [Serializable]
    public class VerifySignatureRequest
    {
        // Public property with automatic getter and setter
        [JsonProperty("message")]
        public string Message { get; set; }

        // Public property with automatic getter and setter
        [JsonProperty("publicKey")]
        public string PublicKey { get; set; }

        // Public property with automatic getter and setter
        [JsonProperty("signature")]
        public string Signature { get; set; }

        // Nullable SupportedChainKey property
        [JsonProperty("chainKey")]
        public SupportedChainKey? ChainKey { get; set; }

        // Nullable Network property
        [JsonProperty("network")]
        public Network? Network { get; set; }

        // Public property with automatic getter and setter
        [JsonProperty("accountAddress")]
        public string AccountAddress { get; set; }
    }

    [Serializable]
    public class VerifySignatureResponse
    {
        // Public property with automatic getter and setter
        [JsonProperty("accessToken")]
        public string AccessToken { get; set; }

        // Public property with automatic getter and setter
        [JsonProperty("refreshToken")]
        public string RefreshToken { get; set; }
    }
}
