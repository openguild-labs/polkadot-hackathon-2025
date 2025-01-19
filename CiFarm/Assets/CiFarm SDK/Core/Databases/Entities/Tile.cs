using System;
using Newtonsoft.Json;
using UnityEngine;

namespace CiFarm.Core.Databases
{
    // Represents a tile entity
    [Serializable]
    public class TileEntity : StringAbstractEntity
    {
        // Public properties with [SerializeField] for Unity serialization and [JsonProperty] for JSON serialization

        [JsonProperty("price")]
        [field: SerializeField]
        public float Price { get; set; }

        [JsonProperty("maxOwnership")]
        [field: SerializeField]
        public int MaxOwnership { get; set; }

        [JsonProperty("isNFT")]
        [field: SerializeField]
        public bool IsNFT { get; set; }

        [JsonProperty("availableInShop")]
        [field: SerializeField]
        public bool AvailableInShop { get; set; }

        [JsonProperty("inventoryTypeId")]
        [field: SerializeField]
        public string InventoryTypeId { get; set; }

        [JsonProperty("placedItemTypeId")]
        [field: SerializeField]
        public string PlacedItemTypeId { get; set; }
    }
}
