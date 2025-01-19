using System;
using Newtonsoft.Json;

namespace CiFarm.RestApi
{
    public class RetainProductRequest
    {
        // Auto-property with JSON serialization
        [JsonProperty("deliveringProductId")]
        public string DeliveringProductId { get; set; }
    }

    [Serializable]
    public class RetainProductResponse { }
}
