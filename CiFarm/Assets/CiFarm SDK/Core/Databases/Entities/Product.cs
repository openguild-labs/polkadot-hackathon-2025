using System;
using Newtonsoft.Json;
using UnityEngine;

namespace CiFarm.Core.Databases
{
    [Serializable] // Makes the class serializable for Unity
    public class ProductEntity : StringAbstractEntity
    {
        // Public properties with [SerializeField] for Unity serialization and [JsonProperty] for JSON serialization

        [JsonProperty("isPremium")]
        [field: SerializeField]
        public bool IsPremium { get; set; }

        [JsonProperty("goldAmount")]
        [field: SerializeField]
        public int GoldAmount { get; set; }

        [JsonProperty("tokenAmount")]
        [field: SerializeField]
        public float TokenAmount { get; set; }

        [JsonProperty("type")]
        [field: SerializeField]
        public ProductType Type { get; set; }

        [JsonProperty("cropId")]
        [field: SerializeField]
        public string CropId { get; set; }

        [JsonProperty("animalId")]
        [field: SerializeField]
        public string AnimalId { get; set; }

        [JsonProperty("inventoryTypeId")]
        [field: SerializeField]
        public string InventoryTypeId { get; set; }
    }
}
