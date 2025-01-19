using System;
using Newtonsoft.Json;

namespace CiFarm.RestApi
{
    [Serializable]
    public class DeliverProductRequest
    {
        // Public auto-properties with JSON serialization
        [JsonProperty("index")]
        public int Index { get; set; }

        [JsonProperty("inventoryId")]
        public string InventoryId { get; set; }

        [JsonProperty("quantity")]
        public int Quantity { get; set; }
    }

    [Serializable]
    public class DeliverProductResponse { }
}
