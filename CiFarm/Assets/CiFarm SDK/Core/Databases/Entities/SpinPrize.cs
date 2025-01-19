using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using UnityEngine;

namespace CiFarm.Core.Databases
{
    [Serializable] // Makes the class serializable for Unity
    public class SpinPrizeEntity : UuidAbstractEntity
    {
        // Auto-properties with serialization attributes
        [JsonProperty("type")]
        [SerializeField]
        public SpinPrizeType Type { get; set; }

        [JsonProperty("cropId")]
        [SerializeField]
        public string CropId { get; set; }

        [JsonProperty("supplyId")]
        [SerializeField]
        public string SupplyId { get; set; }

        [JsonProperty("golds")]
        [SerializeField]
        public int? Golds { get; set; }

        [JsonProperty("tokens")]
        [SerializeField]
        public float? Tokens { get; set; }

        [JsonProperty("quantity")]
        [SerializeField]
        public int? Quantity { get; set; }

        [JsonProperty("appearanceChance")]
        [SerializeField]
        public AppearanceChance AppearanceChance { get; set; }

        [JsonProperty("spinSlots")]
        [SerializeField]
        public List<string> SpinSlotIds { get; set; }
    }
}
