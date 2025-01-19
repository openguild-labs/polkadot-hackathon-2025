using System;
using Newtonsoft.Json;
using UnityEngine;

namespace CiFarm.Core.Databases
{
    [Serializable] // Makes the class serializable for Unity
    public class DeliveringProductEntity : UuidAbstractEntity
    {
        // Public properties with auto-implemented getters and setters

        [JsonProperty("quantity")] // Custom JSON property name in camelCase
        [field: SerializeField]
        public int Quantity { get; set; }

        [JsonProperty("index")] // Custom JSON property name in camelCase
        [field: SerializeField]
        public int Index { get; set; }

        [JsonProperty("premium")] // Custom JSON property name in camelCase
        [field: SerializeField]
        public bool Premium { get; set; }

        [JsonProperty("userId")] // Custom JSON property name in camelCase
        [field: SerializeField]
        public string UserId { get; set; }

        [JsonProperty("productId")] // Custom JSON property name in camelCase
        [field: SerializeField]
        public string ProductId { get; set; }
    }
}
