using System;
using Newtonsoft.Json;
using UnityEngine;

namespace CiFarm.Core.Databases
{
    [Serializable] // Makes the class serializable for Unity
    public class InventoryTypeEntity : UuidAbstractEntity
    {
        // Public properties with [SerializeField] for Unity serialization and [JsonProperty] for JSON serialization

        [JsonProperty("type")]
        [field: SerializeField]
        public InventoryType Type { get; set; }

        [JsonProperty("placeable")]
        [field: SerializeField]
        public bool Placeable { get; set; }

        [JsonProperty("deliverable")]
        [field: SerializeField]
        public bool Deliverable { get; set; }

        [JsonProperty("asTool")]
        [field: SerializeField]
        public bool AsTool { get; set; }

        [JsonProperty("maxStack")]
        [field: SerializeField]
        public int MaxStack { get; set; } = 16; // Default value as per the previous code

        [JsonProperty("cropId")]
        [field: SerializeField]
        public string CropId { get; set; }

        [JsonProperty("animalId")]
        [field: SerializeField]
        public string AnimalId { get; set; }

        [JsonProperty("supplyId")]
        [field: SerializeField]
        public string SupplyId { get; set; }

        [JsonProperty("productId")]
        [field: SerializeField]
        public string ProductId { get; set; }

        [JsonProperty("tileId")]
        [field: SerializeField]
        public string TileId { get; set; }
    }
}
