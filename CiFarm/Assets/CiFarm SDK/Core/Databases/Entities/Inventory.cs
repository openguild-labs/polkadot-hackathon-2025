using System;
using Newtonsoft.Json;
using UnityEngine;

namespace CiFarm.Core.Databases
{
    [Serializable] // Makes the class serializable for Unity
    public class InventoryEntity : UuidAbstractEntity
    {
        // Public properties with auto-implemented getters and setters
        [field: SerializeField] // Serialize field for Unity
        [JsonProperty("quantity")] // Custom JSON property name in camelCase
        public int Quantity { get; set; } = 1;

        [field: SerializeField] // Serialize field for Unity
        [JsonProperty("tokenId")] // Custom JSON property name in camelCase
        public string TokenId { get; set; }

        [field: SerializeField] // Serialize field for Unity
        [JsonProperty("premium")] // Custom JSON property name in camelCase
        public bool Premium { get; set; } = false;

        [field: SerializeField] // Serialize field for Unity
        [JsonProperty("isPlaced")] // Custom JSON property name in camelCase
        public bool IsPlaced { get; set; } = false;

        [field: SerializeField] // Serialize field for Unity
        [JsonProperty("userId")] // Custom JSON property name in camelCase
        public string UserId { get; set; }

        [field: SerializeField] // Serialize field for Unity
        [JsonProperty("inventoryTypeId")] // Custom JSON property name in camelCase
        public string InventoryTypeId { get; set; }
    }
}
