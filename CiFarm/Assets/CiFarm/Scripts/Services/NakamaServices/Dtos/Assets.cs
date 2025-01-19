using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace CiFarm.Scripts.Services.NakamaServices
{
    public enum InventoryType
    {
        Seed,
        Tile,
        Animal,
        PlantHarvested,
        Building,
    }

    [Serializable]
    public class Inventory
    {
        [JsonProperty("key")]
        public string key;

        [JsonProperty("referenceKey")]
        public string referenceKey;

        [JsonProperty("type")]
        public InventoryType type;

        [JsonProperty("quantity")]
        public int quantity;

        [JsonProperty("isPremium")]
        public bool isPremium;  
        
        [JsonProperty("unique")]
        public bool unique;
        
        [JsonProperty("tokenId")]
        public string tokenId;
    }

    [Serializable]
    public class Wallet
    {
        [JsonProperty("golds")]
        public int golds;
    }


    [Serializable]
    public class TelegramData
    {
        [JsonProperty("userId")]
        public int userId;
    }


    [Serializable]
    public class Metadata
    {
        [JsonProperty("key")]
        public string key;

        [JsonProperty("accountAddress")]
        public string accountAddress;

        [JsonProperty("chainKey")]
        public string chainKey;

        [JsonProperty("network")]
        public string network;

        [JsonProperty("telegramData")]
        public TelegramData telegramData;
    }

    [Serializable]
    public class TutorialInfo
    {
        [JsonProperty("tutorialIndex")]
        public int tutorialIndex;

        [JsonProperty("stepIndex")]
        public int stepIndex;
    }

    [Serializable]
    public class LevelInfo
    {
        [JsonProperty("experiences")]
        public int experiences;

        [JsonProperty("experienceQuota")]
        public int experienceQuota;

        [JsonProperty("level")]
        public int level;
    }

    [Serializable]
    public class EnergyInfo
    {
        [JsonProperty("currentEnergy")]
        public int currentEnergy;

        [JsonProperty("maxEnergy")]
        public int maxEnergy;

        [JsonProperty("energyQuota")]
        public int energyQuota;

        [JsonProperty("recoveryTimeCount")]
        public long recoveryTimeCount;
    }

    [Serializable]
    public class PlayerStats
    {
        [JsonProperty("key")]
        public string key;

        [JsonProperty("levelInfo")]
        public LevelInfo levelInfo;

        [JsonProperty("tutorialInfo")]
        public TutorialInfo tutorialInfo;

        [JsonProperty("energyInfo")]
        public EnergyInfo energyInfo;

        [JsonProperty("invites")]
        public List<int> invites;
    }

    [Serializable]
    public class VisitState
    {
        [JsonProperty("key")]
        public string key;

        [JsonProperty("userId")]
        public string userId;
    }
}