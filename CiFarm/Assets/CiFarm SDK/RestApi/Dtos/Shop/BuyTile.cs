using System;
using Newtonsoft.Json;

namespace CiFarm.RestApi
{
    [Serializable]
    public class BuyTileRequest
    {
        // Auto-property with JSON serialization
        [JsonProperty("position")]
        public Position Position { get; set; }
    }

    [Serializable]
    public class BuyTileResponse { }
}
