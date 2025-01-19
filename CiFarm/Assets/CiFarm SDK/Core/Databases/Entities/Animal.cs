using System;
using Newtonsoft.Json;
using UnityEngine;

namespace CiFarm.Core.Databases
{
    [Serializable]
    public class AnimalEntity : StringAbstractEntity
    {
        // Public properties with SerializeField and JsonProperty
        [JsonProperty("yieldTime")]
        [field: SerializeField]
        public int YieldTime { get; set; }

        [JsonProperty("offspringPrice")]
        [field: SerializeField]
        public int OffspringPrice { get; set; }

        [JsonProperty("isNFT")]
        [field: SerializeField]
        public bool IsNFT { get; set; }

        [JsonProperty("price")]
        [field: SerializeField]
        public int? Price { get; set; }

        [JsonProperty("growthTime")]
        [field: SerializeField]
        public int GrowthTime { get; set; }

        [JsonProperty("availableInShop")]
        [field: SerializeField]
        public bool AvailableInShop { get; set; }

        [JsonProperty("hungerTime")]
        [field: SerializeField]
        public int HungerTime { get; set; }

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

        [JsonProperty("type")]
        [field: SerializeField]
        public AnimalType Type { get; set; }

        [JsonProperty("productId")]
        [field: SerializeField]
        public string ProductId { get; set; }

        [JsonProperty("inventoryTypeId")]
        [field: SerializeField]
        public string InventoryTypeId { get; set; }

        [JsonProperty("placedItemTypeId")]
        [field: SerializeField]
        public string PlacedItemTypeId { get; set; }
    }
}
