using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using UnityEngine;

namespace CiFarm.Core.Databases
{
    [Serializable] // Makes the class serializable
    public class AnimalInfoEntity : UuidAbstractEntity
    {
        // Public property for currentGrowthTime
        [JsonProperty("currentGrowthTime")] // Custom JSON property name
        [field: SerializeField]
        public float CurrentGrowthTime { get; set; }

        // Public property for currentHungryTime
        [JsonProperty("currentHungryTime")] // Custom JSON property name
        [field: SerializeField]
        public float CurrentHungryTime { get; set; }

        // Public property for currentYieldTime
        [JsonProperty("currentYieldTime")] // Custom JSON property name
        [field: SerializeField]
        public float CurrentYieldTime { get; set; }

        // Public property for isAdult
        [JsonProperty("isAdult")] // Custom JSON property name
        [field: SerializeField]
        public bool IsAdult { get; set; }

        // Public property for animalId
        [JsonProperty("animalId")] // Custom JSON property name
        [field: SerializeField]
        public string AnimalId { get; set; }

        // Public property for currentState
        [JsonProperty("currentState")] // Custom JSON property name
        [field: SerializeField]
        public AnimalCurrentState CurrentState { get; set; }

        // Public property for harvestQuantityRemaining (nullable)
        [JsonProperty("harvestQuantityRemaining")] // Custom JSON property name
        [field: SerializeField]
        public int? HarvestQuantityRemaining { get; set; }

        // Public property for thiefedBy (many-to-many relationship)
        [JsonProperty("thiefedByIds")] // Custom JSON property name
        [field: SerializeField]
        public List<string> ThiefedByIds { get; set; }

        // Public property for alreadySick
        [JsonProperty("alreadySick")] // Custom JSON property name
        [field: SerializeField]
        public bool AlreadySick { get; set; }

        // Public property for placedItemId
        [JsonProperty("placedItemId")] // Custom JSON property name
        [field: SerializeField]
        public string PlacedItemId { get; set; }
    }
}
