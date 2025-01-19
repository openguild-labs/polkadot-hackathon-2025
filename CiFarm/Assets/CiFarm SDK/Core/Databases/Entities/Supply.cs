using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using UnityEngine;

namespace CiFarm.Core.Databases
{
    [Serializable] // Makes the class serializable for Unity
    public class SupplyEntity : StringAbstractEntity
    {
        // Public properties with auto-properties and serialization attributes

        [JsonProperty("type")]
        [field: SerializeField]
        public SupplyType Type { get; set; }

        [JsonProperty("price")]
        [field: SerializeField]
        public float Price { get; set; }

        [JsonProperty("availableInShop")]
        [field: SerializeField]
        public bool AvailableInShop { get; set; }

        [JsonProperty("fertilizerEffectTimeReduce")]
        [field: SerializeField]
        public int? FertilizerEffectTimeReduce { get; set; }

        [JsonProperty("inventoryTypeId")]
        [field: SerializeField]
        public string InventoryTypeId { get; set; }

        [JsonProperty("spinPrizeIds")]
        [field: SerializeField]
        public List<string> SpinPrizes { get; set; }
    }
}
