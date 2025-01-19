using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using UnityEngine;

namespace CiFarm.Core.Databases
{
    [Serializable] // Makes the class serializable for Unity
    public class PlacedItemEntity : UuidAbstractEntity
    {
        // Public properties for coordinates
        [JsonProperty("x")] // Custom JSON property name in camelCase
        [field: SerializeField]
        public int X { get; set; }

        [JsonProperty("y")] // Custom JSON property name in camelCase
        [field: SerializeField]
        public int Y { get; set; }

        // Public property for userId (nullable)
        [JsonProperty("userId")] // Custom JSON property name in camelCase
        [field: SerializeField]
        public string UserId { get; set; }

        // Public property for inventoryId (nullable)
        [JsonProperty("inventoryId")] // Custom JSON property name in camelCase
        [field: SerializeField]
        public string InventoryId { get; set; }

        [JsonProperty("seedGrowthInfoId")] // Custom JSON property name in camelCase
        [field: SerializeField]
        public string SeedGrowthInfoId { get; set; }

        // Navigation property for SeedGrowthInfoEntity (one-to-one relationship)
        [JsonProperty("seedGrowthInfo")] // Custom JSON property name in camelCase
        [field: SerializeField]
        public SeedGrowthInfoEntity SeedGrowthInfo { get; set; }

        [JsonProperty("animalInfoId")] // Custom JSON property name in camelCase
        [field: SerializeField]
        public string AnimalInfoId { get; set; }

        // Navigation property for AnimalInfoEntity (one-to-one relationship)
        [JsonProperty("animalInfo")] // Custom JSON property name in camelCase
        [field: SerializeField]
        public AnimalInfoEntity AnimalInfo { get; set; }

        [JsonProperty("buildingInfoId")] // Custom JSON property name in camelCase
        [field: SerializeField]
        public string BuildingInfoId { get; set; }

        // Navigation property for BuildingInfoEntity (one-to-one relationship)
        [JsonProperty("buildingInfo")] // Custom JSON property name in camelCase
        [field: SerializeField]
        public BuildingInfoEntity BuildingInfo { get; set; }

        // Public property for placedItems (one-to-many relationship)
        [JsonProperty("placedItemIds")] // Custom JSON property name in camelCase
        [field: SerializeField]
        public List<string> PlacedItemIds { get; set; }

        // Public property for parentId (nullable)
        [JsonProperty("parentId")] // Custom JSON property name in camelCase
        [field: SerializeField]
        public string ParentId { get; set; }

        // Public property for placedItemTypeId (nullable)
        [JsonProperty("placedItemTypeId")] // Custom JSON property name in camelCase
        [field: SerializeField]
        public string PlacedItemTypeId { get; set; }
    }
}
