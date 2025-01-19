using System;
using Newtonsoft.Json;

namespace CiFarm.RestApi
{
    [Serializable]
    public class RecoverTileRequest
    {
        // Auto-property with JSON serialization
        [JsonProperty("placedItemTileId")]
        public string PlacedItemTileId { get; set; }
    }

    [Serializable]
    public class RecoverTileResponse
    {
        // Auto-property with JSON serialization
        [JsonProperty("inventoryTileId")]
        public string InventoryTileId { get; set; }
    }
}
