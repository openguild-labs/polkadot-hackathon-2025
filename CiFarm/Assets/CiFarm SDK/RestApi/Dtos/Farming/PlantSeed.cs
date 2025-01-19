using System;
using Newtonsoft.Json;

namespace CiFarm.RestApi
{
    [Serializable]
    public class PlantSeedRequest
    {
        // Auto-properties with JSON serialization
        [JsonProperty("inventorySeedId")]
        public string InventorySeedId { get; set; }

        [JsonProperty("placedItemTileId")]
        public string PlacedItemTileId { get; set; }
    }

    [Serializable]
    public class PlantSeedResponse { }
}
