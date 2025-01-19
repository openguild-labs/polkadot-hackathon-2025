using System;
using Newtonsoft.Json;

namespace CiFarm.RestApi
{
    [Serializable]
    public class ConstructBuildingRequest
    {
        // Auto-properties with JSON serialization
        [JsonProperty("buildingId")]
        public string BuildingId { get; set; }

        [JsonProperty("position")]
        public Position Position { get; set; }
    }

    [Serializable]
    public class ConstructBuildingResponse { }
}
