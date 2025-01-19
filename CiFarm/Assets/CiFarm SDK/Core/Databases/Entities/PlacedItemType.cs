using System;
using Newtonsoft.Json;
using UnityEngine;

namespace CiFarm.Core.Databases
{
    [Serializable] // Makes the class serializable for Unity
    public class PlacedItemTypeEntity : StringAbstractEntity
    {
        // Public properties with [SerializeField] for Unity serialization and [JsonProperty] for JSON serialization

        [JsonProperty("type")]
        [field: SerializeField]
        public PlacedItemType Type { get; set; }

        [JsonProperty("tileId")]
        [field: SerializeField]
        public string TileId { get; set; }

        [JsonProperty("buildingId")]
        [field: SerializeField]
        public string BuildingId { get; set; }

        [JsonProperty("animalId")]
        [field: SerializeField]
        public string AnimalId { get; set; }
    }
}
