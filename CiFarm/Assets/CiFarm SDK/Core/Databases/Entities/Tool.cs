using System;
using Newtonsoft.Json;
using UnityEngine;

namespace CiFarm.Core.Databases
{
    // Represents a tool entity
    [Serializable]
    public class ToolEntity : StringAbstractEntity
    {
        // Public properties with [SerializeField] for Unity serialization and [JsonProperty] for JSON serialization
        [JsonProperty("availableIn")]
        [field: SerializeField]
        public AvailableInType AvailableIn { get; set; }

        [JsonProperty("index")]
        [field: SerializeField]
        public int Index { get; set; }
    }
}
