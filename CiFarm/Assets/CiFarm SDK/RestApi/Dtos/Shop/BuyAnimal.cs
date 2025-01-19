using System;
using Newtonsoft.Json;

namespace CiFarm.RestApi
{
    [Serializable]
    public class BuyAnimalRequest
    {
        // Auto-property with JSON serialization
        [JsonProperty("animalId")]
        public string AnimalId { get; set; }

        // Auto-property with JSON serialization
        [JsonProperty("placedItemBuildingId")]
        public string PlacedItemBuildingId { get; set; }

        // Auto-property with JSON serialization
        [JsonProperty("position")]
        public Position Position { get; set; }
    }

    [Serializable]
    public class BuyAnimalResponse { }
}
