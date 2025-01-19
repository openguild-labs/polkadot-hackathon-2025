using System;
using Newtonsoft.Json;

namespace CiFarm.RestApi
{
    [Serializable]
    public class NeighborAndUserIdRequest
    {
        // Public auto-property with getter and setter
        [JsonProperty("neighborUserId")]
        public string NeighborUserId { get; set; }
    }
}
