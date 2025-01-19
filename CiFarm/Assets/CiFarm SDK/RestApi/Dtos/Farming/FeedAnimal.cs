using System;
using Newtonsoft.Json;

namespace CiFarm.RestApi
{
    [Serializable]
    public class FeedAnimalRequest
    {
        // Auto-property with JSON serialization
        [JsonProperty("placedItemAnimalId")]
        public string PlacedItemAnimalId { get; set; }
    }

    [Serializable]
    public class FeedAnimalResponse { }
}
