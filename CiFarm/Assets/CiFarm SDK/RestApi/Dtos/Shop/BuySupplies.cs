using System;
using Newtonsoft.Json;

namespace CiFarm.RestApi
{
    [Serializable]
    public class BuySuppliesRequest
    {
        // Auto-property with JSON serialization
        [JsonProperty("supplyId")]
        public string SupplyId { get; set; }

        // Auto-property with JSON serialization
        [JsonProperty("quantity")]
        public int Quantity { get; set; }
    }

    [Serializable]
    public class BuySuppliesResponse { }
}
