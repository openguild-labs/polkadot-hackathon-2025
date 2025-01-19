using System;
using Newtonsoft.Json;

namespace CiFarm.RestApi
{
    [Serializable]
    public class ThiefCropRequest : NeighborAndUserIdRequest
    {
        // Public auto-property for PlacedItemTileId with JSON serialization
        [JsonProperty("placedItemTileId")]
        public string PlacedItemTileId { get; set; }
    }

    [Serializable]
    public class ThiefCropResponse
    {
        // Public auto-property for Quantity with JSON serialization
        [JsonProperty("quantity")]
        public int Quantity { get; set; }
    }
}
