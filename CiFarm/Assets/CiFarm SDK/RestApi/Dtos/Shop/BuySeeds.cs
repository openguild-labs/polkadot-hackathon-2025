using System;
using Newtonsoft.Json;

namespace CiFarm.RestApi
{
    [Serializable]
    public class BuySeedsRequest
    {
        // Auto-property with JSON serialization
        [JsonProperty("cropId")]
        public string CropId { get; set; }

        // Auto-property with JSON serialization
        [JsonProperty("quantity")]
        public int Quantity { get; set; }
    }

    [Serializable]
    public class BuySeedsResponse { }
}
