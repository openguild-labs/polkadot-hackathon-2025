using System;
using Newtonsoft.Json;

namespace CiFarm.RestApi
{
    [Serializable]
    public class ThiefAnimalProductRequest : NeighborAndUserIdRequest
    {
        // Public auto-property for PlacedItemAnimalId with JSON serialization
        [JsonProperty("placedItemAnimalId")]
        public string PlacedItemAnimalId { get; set; }
    }

    [Serializable]
    public class ThiefAnimalProductResponse
    {
        // Public auto-property for Quantity with JSON serialization
        [JsonProperty("quantity")]
        public int Quantity { get; set; }
    }
}
