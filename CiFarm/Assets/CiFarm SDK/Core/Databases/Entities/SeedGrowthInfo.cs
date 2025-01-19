using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using UnityEngine;

namespace CiFarm.Core.Databases
{
    [Serializable] // Makes the class serializable for Unity
    public class SeedGrowthInfoEntity : UuidAbstractEntity
    {
        // Public property for currentStage
        [JsonProperty("currentStage")] // Custom JSON property name in camelCase
        [field: SerializeField]
        public int CurrentStage { get; set; }

        // Public property for currentStageTimeElapsed
        [JsonProperty("currentStageTimeElapsed")] // Custom JSON property name in camelCase
        [field: SerializeField]
        public float CurrentStageTimeElapsed { get; set; }

        // Public property for totalTimeElapsed
        [JsonProperty("totalTimeElapsed")] // Custom JSON property name in camelCase
        [field: SerializeField]
        public float TotalTimeElapsed { get; set; }

        // Public property for currentPerennialCount
        [JsonProperty("currentPerennialCount")] // Custom JSON property name in camelCase
        [field: SerializeField]
        public int CurrentPerennialCount { get; set; }

        // Public property for harvestQuantityRemaining
        [JsonProperty("harvestQuantityRemaining")] // Custom JSON property name in camelCase
        [field: SerializeField]
        public int HarvestQuantityRemaining { get; set; }

        // Public property for cropId
        [JsonProperty("cropId")] // Custom JSON property name in camelCase
        [field: SerializeField]
        public string CropId { get; set; }

        // Public property for currentState
        [JsonProperty("currentState")] // Custom JSON property name in camelCase
        [field: SerializeField]
        public CropCurrentState CurrentState { get; set; }

        // Navigation property for Users who thiefed the item
        [JsonProperty("thiefedByIds")] // Custom JSON property name in camelCase
        [field: SerializeField]
        public List<string> ThiefedByIds { get; set; }

        // Public property for isFertilized
        [JsonProperty("isFertilized")] // Custom JSON property name in camelCase
        [field: SerializeField]
        public bool IsFertilized { get; set; }

        // Public property for placedItemId
        [JsonProperty("placedItemId")] // Custom JSON property name in camelCase
        [field: SerializeField]
        public string PlacedItemId { get; set; }
    }
}
