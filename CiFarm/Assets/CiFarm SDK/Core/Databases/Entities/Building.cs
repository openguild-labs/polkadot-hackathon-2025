using System;
using System.Collections.Generic;
using CiFarm.Core.Databases;
using Newtonsoft.Json;
using UnityEngine;

[Serializable] // Makes the class serializable for Unity
public class BuildingEntity : StringAbstractEntity
{
    // Public properties with SerializeField for Unity serialization and JsonProperty for custom JSON names
    [JsonProperty("availableInShop")]
    [field: SerializeField]
    public bool AvailableInShop { get; set; }

    [JsonProperty("type")]
    [field: SerializeField]
    public AnimalType? Type { get; set; }

    [JsonProperty("maxUpgrade")]
    [field: SerializeField]
    public int MaxUpgrade { get; set; }

    [JsonProperty("price")]
    [field: SerializeField]
    public int? Price { get; set; }

    [JsonProperty("placedItemTypeId")]
    [field: SerializeField]
    public string PlacedItemTypeId { get; set; }

    [JsonProperty("upgradeIds")]
    [field: SerializeField]
    public List<string> UpgradeIds { get; set; }
}
