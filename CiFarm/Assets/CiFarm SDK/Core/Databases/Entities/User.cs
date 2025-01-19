using System;
using CiFarm.Core.Credentials;
using Newtonsoft.Json;
using UnityEngine;

namespace CiFarm.Core.Databases
{
    [Serializable] // Makes the class serializable for Unity
    public class UserEntity : UuidAbstractEntity
    {
        // Public properties with [SerializeField] for Unity serialization and [JsonProperty] for JSON serialization
        [JsonProperty("username")]
        [field: SerializeField]
        public string Username { get; set; }

        [JsonProperty("chainKey")]
        [field: SerializeField]
        public SupportedChainKey ChainKey { get; set; }

        [JsonProperty("network")]
        [field: SerializeField]
        public Network Network { get; set; }

        [JsonProperty("accountAddress")]
        [field: SerializeField]
        public string AccountAddress { get; set; }

        [JsonProperty("golds")]
        [field: SerializeField]
        public int Golds { get; set; }

        [JsonProperty("tokens")]
        [field: SerializeField]
        public float Tokens { get; set; }

        [JsonProperty("experiences")]
        [field: SerializeField]
        public int Experiences { get; set; }

        [JsonProperty("energy")]
        [field: SerializeField]
        public int Energy { get; set; }

        [JsonProperty("energyRegen")]
        [field: SerializeField]
        public float EnergyRegen { get; set; }

        [JsonProperty("level")]
        [field: SerializeField]
        public int Level { get; set; }

        [JsonProperty("tutorialIndex")]
        [field: SerializeField]
        public int TutorialIndex { get; set; }

        [JsonProperty("stepIndex")]
        [field: SerializeField]
        public int StepIndex { get; set; }

        [JsonProperty("dailyRewardStreak")]
        [field: SerializeField]
        public int DailyRewardStreak { get; set; }

        [JsonProperty("dailyRewardLastClaimTime")]
        [field: SerializeField]
        public DateTime? DailyRewardLastClaimTime { get; set; }

        [JsonProperty("dailyRewardNumberOfClaim")]
        [field: SerializeField]
        public int DailyRewardNumberOfClaim { get; set; }

        [JsonProperty("spinLastTime")]
        [field: SerializeField]
        public DateTime? SpinLastTime { get; set; }

        [JsonProperty("spinCount")]
        [field: SerializeField]
        public int SpinCount { get; set; }
    }
}
