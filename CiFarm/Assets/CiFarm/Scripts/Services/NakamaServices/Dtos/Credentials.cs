using Newtonsoft.Json;

namespace CiFarm.Scripts.Services.NakamaServices
{
    public class Credentials
    {
        [JsonProperty("message")]
        public string message;

        [JsonProperty("publickey")]
        public string publicKey;

        [JsonProperty("signature")]
        public string signature;

        [JsonProperty("chainkey")]
        public string chainKey;

        [JsonProperty("network")]
        public string network;

        [JsonProperty("telegramInitDataRaw")]
        public string telegramInitDataRaw;

        [JsonProperty("botType")]
        public string botType;

        [JsonProperty("accountAddress")]
        public string accountAddress;
    }

}
