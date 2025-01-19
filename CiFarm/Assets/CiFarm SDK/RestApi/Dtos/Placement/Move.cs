using System;
using Newtonsoft.Json;

namespace CiFarm.RestApi
{
    [Serializable]
    public class MoveRequest
    {
        // Auto-property with JSON serialization
        [JsonProperty("placedItemId")]
        public string PlacedItemId { get; set; }

        // Auto-property with JSON serialization
        [JsonProperty("position")]
        public Position Position { get; set; }
    }

    [Serializable]
    public class MoveResponse { }
}
