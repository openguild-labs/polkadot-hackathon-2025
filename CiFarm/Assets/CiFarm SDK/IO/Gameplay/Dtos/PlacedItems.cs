using System;
using System.Collections.Generic;
using CiFarm.Core.Databases;
using Newtonsoft.Json;
using UnityEngine;

[Serializable]
public class PlacedItemsSyncedMessage
{
    [SerializeField]
    private List<PlacedItemEntity> _placedItems;

    [JsonProperty("placedItems")]
    public List<PlacedItemEntity> PlacedItems
    {
        get => _placedItems;
        set => _placedItems = value;
    }
}
