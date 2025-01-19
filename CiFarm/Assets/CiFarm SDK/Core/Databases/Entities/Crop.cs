using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using UnityEngine; // Required for Unity's [SerializeField] attribute

namespace CiFarm.Core.Databases
{
    [Serializable] // Makes the class serializable for Unity
    public class CropEntity : StringAbstractEntity
    {
        // Public properties with [SerializeField] for Unity serialization and [JsonProperty] for JSON serialization
        [JsonProperty("growthStageDuration")]
        [field: SerializeField]
        public int GrowthStageDuration { get; set; }

        [JsonProperty("growthStages")]
        [field: SerializeField]
        public int GrowthStages { get; set; }

        [JsonProperty("price")]
        [field: SerializeField]
        public int Price { get; set; }

        [JsonProperty("premium")]
        [field: SerializeField]
        public bool Premium { get; set; }

        [JsonProperty("perennialCount")]
        [field: SerializeField]
        public int PerennialCount { get; set; }

        [JsonProperty("nextGrowthStageAfterHarvest")]
        [field: SerializeField]
        public int NextGrowthStageAfterHarvest { get; set; }

        [JsonProperty("minHarvestQuantity")]
        [field: SerializeField]
        public int MinHarvestQuantity { get; set; }

        [JsonProperty("maxHarvestQuantity")]
        [field: SerializeField]
        public int MaxHarvestQuantity { get; set; }

        [JsonProperty("basicHarvestExperiences")]
        [field: SerializeField]
        public int BasicHarvestExperiences { get; set; }

        [JsonProperty("premiumHarvestExperiences")]
        [field: SerializeField]
        public int PremiumHarvestExperiences { get; set; }

        [JsonProperty("availableInShop")]
        [field: SerializeField]
        public bool AvailableInShop { get; set; }

        [JsonProperty("maxStack")]
        [field: SerializeField]
        public int MaxStack { get; set; }

        // Navigation properties
        [JsonProperty("productId")]
        [field: SerializeField]
        public string ProductId { get; set; }

        [JsonProperty("inventoryTypeId")]
        [field: SerializeField]
        public string InventoryType { get; set; }

        [JsonProperty("spinPrizeIds")]
        [field: SerializeField]
        public List<string> SpinPrizes { get; set; }
    }
}
