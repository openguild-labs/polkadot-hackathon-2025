using System;
using Newtonsoft.Json;

namespace CiFarm.RestApi
{
    [Serializable]
    public class WaterRequest
    {
        // Auto-property with JSON serialization
        [JsonProperty("placedItemTileId")]
        public string PlacedItemTileId { get; set; }
    }

    [Serializable]
    public class WaterResponse { }
}
