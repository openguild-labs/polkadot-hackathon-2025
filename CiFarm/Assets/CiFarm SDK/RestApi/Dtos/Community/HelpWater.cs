using System;
using Newtonsoft.Json;

namespace CiFarm.RestApi
{
    [Serializable]
    public class HelpWaterRequest : NeighborAndUserIdRequest
    {
        // Public auto-property for PlacedItemTileId with JSON serialization
        [JsonProperty("placedItemTileId")]
        public string PlacedItemTileId { get; set; }
    }

    [Serializable]
    public class HelpWaterResponse { }
}
