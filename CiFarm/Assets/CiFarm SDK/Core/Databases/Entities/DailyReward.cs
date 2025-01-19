using System;
using Newtonsoft.Json;
using UnityEngine;

namespace CiFarm.Core.Databases
{
    [Serializable] // Makes the class serializable
    public class DailyRewardEntity : StringAbstractEntity
    {
        // Public properties with [SerializeField] for Unity serialization and [JsonProperty] for JSON serialization

        [JsonProperty("golds")]
        [field: SerializeField]
        public int? Golds { get; set; }

        [JsonProperty("tokens")]
        [field: SerializeField]
        public float? Tokens { get; set; }

        [JsonProperty("day")]
        [field: SerializeField]
        public int? Day { get; set; }

        [JsonProperty("lastDay")]
        [field: SerializeField]
        public bool LastDay { get; set; }
    }
}
