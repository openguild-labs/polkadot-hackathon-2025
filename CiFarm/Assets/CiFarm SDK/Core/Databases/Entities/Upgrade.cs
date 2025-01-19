using System;
using Newtonsoft.Json;
using UnityEngine;

namespace CiFarm.Core.Databases
{
    // Represents an upgrade entity
    [Serializable]
    public class UpgradeEntity : StringAbstractEntity
    {
        // Public properties with [SerializeField] for Unity serialization and [JsonProperty] for JSON serialization
        [JsonProperty("upgradePrice")]
        [field: SerializeField]
        public int UpgradePrice { get; set; }

        [JsonProperty("capacity")]
        [field: SerializeField]
        public int Capacity { get; set; }

        [JsonProperty("upgradeLevel")]
        [field: SerializeField]
        public int UpgradeLevel { get; set; }

        [JsonProperty("buildingId")]
        [field: SerializeField]
        public string BuildingId { get; set; }
    }
}
