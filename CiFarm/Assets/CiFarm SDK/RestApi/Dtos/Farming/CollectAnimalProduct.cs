using System;
using Newtonsoft.Json;

namespace CiFarm.RestApi
{
    [Serializable]
    public class CollectAnimalProductRequest
    {
        // Auto-property with JSON serialization
        [JsonProperty("placedItemAnimalId")]
        public string PlacedItemAnimalId { get; set; }
    }

    [Serializable]
    public class CollectAnimalProductResponse { }
}
