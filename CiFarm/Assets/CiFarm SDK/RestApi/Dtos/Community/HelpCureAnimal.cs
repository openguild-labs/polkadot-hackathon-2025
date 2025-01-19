using System;
using Newtonsoft.Json;

namespace CiFarm.RestApi
{
    [Serializable]
    public class HelpCureAnimalRequest : NeighborAndUserIdRequest
    {
        // Public auto-property with getter and setter
        [JsonProperty("placedItemAnimalId")]
        public string PlacedItemAnimalId { get; set; }
    }

    [Serializable]
    public class HelpCureAnimalResponse { }
}
