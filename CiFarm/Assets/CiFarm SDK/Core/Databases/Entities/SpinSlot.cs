using System;
using Newtonsoft.Json;
using UnityEngine; // For [SerializeField] attribute

namespace CiFarm.Core.Databases
{
    [Serializable] // Makes the class serializable for Unity
    public class SpinSlotEntity : UuidAbstractEntity
    {
        // Auto-property for spinPrizeId with Unity serialization and JSON property mapping
        [JsonProperty("spinPrizeId")]
        [field: SerializeField]
        public string SpinPrizeId { get; set; }
    }
}
