using System;
using Newtonsoft.Json;

namespace CiFarm.RestApi
{
    [Serializable]
    public class PlaceTileRequest
    {
        // Auto-property with JSON serialization
        [JsonProperty("inventoryTileId")]
        public string InventoryTileId { get; set; }

        // Auto-property with JSON serialization
        [JsonProperty("position")]
        public Position Position { get; set; }
    }

    [Serializable]
    public class PlaceTileResponse
    {
        // Auto-property with JSON serialization
        [JsonProperty("placedItemTileId")]
        public string PlacedItemTileId { get; set; }
    }
}
