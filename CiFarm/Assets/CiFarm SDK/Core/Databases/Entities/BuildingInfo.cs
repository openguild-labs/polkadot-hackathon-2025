using System;
using Newtonsoft.Json;
using UnityEngine;

namespace CiFarm.Core.Databases
{
    [Serializable] // Makes the class serializable for Unity
    public class BuildingInfoEntity : UuidAbstractEntity
    {
        // Public property for currentUpgrade
        [JsonProperty("currentUpgrade")]
        [field: SerializeField]
        public int? CurrentUpgrade { get; set; }

        // Public property for occupancy
        [JsonProperty("occupancy")]
        [field: SerializeField]
        public int? Occupancy { get; set; }

        // Public property for buildingId
        [JsonProperty("buildingId")]
        [field: SerializeField]
        public string BuildingId { get; set; }

        // Public property for placedItemId
        [JsonProperty("placedItemId")]
        [field: SerializeField]
        public string PlacedItemId { get; set; }
    }
}
