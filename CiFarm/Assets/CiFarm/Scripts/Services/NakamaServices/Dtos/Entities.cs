using AYellowpaper.SerializedCollections;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace CiFarm.Scripts.Services.NakamaServices
{
    [Serializable]
    public class Crop
    {
        [JsonProperty("key")]
        public string key;

        [JsonProperty("growthStageDuration")]
        public long growthStageDuration;

        [JsonProperty("growthStages")]
        public int growthStages;

        [JsonProperty("price")]
        public long price;

        [JsonProperty("premium")]
        public bool premium;

        [JsonProperty("perennial")]
        public bool perennial;

        [JsonProperty("nextGrowthStageAfterHarvest")]
        public int nextGrowthStageAfterHarvest;

        [JsonProperty("minHarvestQuantity")]
        public int minHarvestQuantity;

        [JsonProperty("maxHarvestQuantity")]
        public int maxHarvestQuantity;

        [JsonProperty("basicHarvestExperiences")]
        public int basicHarvestExperiences;

        [JsonProperty("premiumHarvestExperiences")]
        public int premiumHarvestExperiences;

        [JsonProperty("availableInShop")]
        public bool availableInShop;
    }

    [Serializable]
    public class Tile
    {
        [JsonProperty("key")]
        public string key;

        [JsonProperty("price")]
        public long price;

        [JsonProperty("maxOwnership")]
        public int maxOwnership;

        [JsonProperty("isNft")]
        public bool isNFT;

        [JsonProperty("availableInShop")]
        public bool availableInShop;
    }

    public enum AnimalType
    {
        Poultry = 0,
        Livestock = 1,
    }

    [Serializable]
    public class Animal
    {
        [JsonProperty("key")]
        public string key;

        [JsonProperty("yieldTime")]
        public long yieldTime;

        [JsonProperty("offspringPrice")]
        public long offspringPrice;

        [JsonProperty("isNft")]
        public bool isNFT;

        [JsonProperty("growthTime")]
        public long growthTime;

        [JsonProperty("availableInShop")]
        public bool availableInShop;

        [JsonProperty("hungerTime")]
        public long hungerTime;

        [JsonProperty("minHarvestQuantity")]
        public int minHarvestQuantity;

        [JsonProperty("maxHarvestQuantity")]
        public int maxHarvestQuantity;

        [JsonProperty("basicHarvestExperiences")]
        public long basicHarvestExperiences;

        [JsonProperty("premiumHarvestExperiences")]
        public long premiumHarvestExperiences;

        [JsonProperty("type")]
        public AnimalType type;
    }

    [Serializable]
    public class Building
    {
        [JsonProperty("key")]
        public string key;

        [JsonProperty("availableInShop")]
        public bool availableInShop;

        [JsonProperty("maxUpgrade")]
        public int maxUpgrade;

        [JsonProperty("price")]
        public long price;

        [JsonProperty("type")]
        public AnimalType type;

        [JsonProperty("upgrades")]
        public Dictionary<int, Upgrade> Upgrades;
    }

    [Serializable]
    public class Upgrade
    {
        [JsonProperty("upgradePrice")]
        public int key;

        [JsonProperty("capacity")]
        public int capacity;
    }

    [Serializable]
    public class MatchInfo
    {
        [JsonProperty("centralMatchId")]
        public string centralMatchId;

        [JsonProperty("timerMatchId")]
        public string timerMatchId;
    }

    [Serializable]
    public class Position
    {
        [JsonProperty("x")]
        public int x;

        [JsonProperty("y")]
        public int y;
    }

    [Serializable]
    public class SeedGrowthInfo
    {
        [JsonProperty("crop")]
        public Crop crop;

        [JsonProperty("currentStage")]
        public int currentStage;

        [JsonProperty("totalTimeElapsed")]
        public float totalTimeElapsed;

        [JsonProperty("currentStageTimeElapsed")]
        public float currentStageTimeElapsed;

        [JsonProperty("harvestQuantityRemaining")]
        public int harvestQuantityRemaining;

        [JsonProperty("currentState")]
        public PlantCurrentState currentState;

        [JsonProperty("isPlanted")]
        public bool isPlanted;

        [JsonProperty("fullyMatured")]
        public bool fullyMatured;

        [JsonProperty("thiefedBy")]
        public List<string> thiefedBy;

        [JsonProperty("isFertilized")]
        public bool isFertilized;
    }

    [Serializable]
    public class AnimalInfo
    {
        [JsonProperty("currentGrowth")]
        public long currentGrowthTime;

        [JsonProperty("currentHungryTime")]
        public long currentHungryTime;

        [JsonProperty("currentYieldTime")]
        public long currentYieldTime;

        [JsonProperty("hasYielded")]
        public bool hasYielded;

        [JsonProperty("isAdult")]
        public bool isAdult;

        [JsonProperty("animal")]
        public Animal animal;
        
        [JsonProperty("currentState")]
        public AnimalCurrentState currentState;

        [JsonProperty("harvestQuantityRemaining")]
        public int harvestQuantityRemaining;

        [JsonProperty("thiefedBy")]
        public List<string> thiefedBy;
    }

    [Serializable]
    public class BuildingInfo
    {
        [JsonProperty("currentUpgrade")]
        public int currentUpgrade;

        [JsonProperty("currentStageTimeElapsed")]
        public int occupancy;

        [JsonProperty("building")]
        public Building building;
    }

    public enum PlantCurrentState
    {
        Normal,
        NeedWater,
        IsWeedy,
        IsInfested,
    }
    public enum AnimalCurrentState
    {
        Normal,
        Hungry = 1,
        Sick =2,
    }

    public enum PlacedItemType
    {
        Tile,
        Building,
        Animal
    }

    [Serializable]
    public class PlacedItem
    {
        [JsonProperty("key")]
        public string key;

        [JsonProperty("referenceKey")]
        public string referenceKey;

        [JsonProperty("inventoryKey")]
        public string inventoryKey;

        [JsonProperty("position")]
        public Position position;

        [JsonProperty("type")]
        public PlacedItemType type;

        [JsonProperty("seedGrowthInfo")]
        public SeedGrowthInfo seedGrowthInfo;

        [JsonProperty("buildingInfo")]
        public BuildingInfo buildingInfo;

        [JsonProperty("animalInfo")]
        public AnimalInfo animalInfo;

        [JsonProperty("parentPlacedItemKey")]
        public string parentPlacedItemKey;
    }

    [Serializable]
    public class PlacedItems
    {
        [JsonProperty("placedItems")]
        public List<PlacedItem> placedItems;
    }

    [Serializable]
    public class UserCooldownTimers
    {
        [JsonProperty("nextFreeSpinCooldown")]
        public int nextFreeSpinCooldown;

        [JsonProperty("isSpinFree")]
        public bool isSpinFree;

        [JsonProperty("nextDailyRewardCooldown")]
        public int nextDailyRewardCooldown;

        [JsonProperty("unclaimedToday")]
        public bool unclaimedToday;
    }

    [Serializable]
    public class GlobalCooldownTimers
    {
        [JsonProperty("nextDeliveryCooldown")]
        public int nextDeliveryCooldown;
    }

    [Serializable]
    public class DeliveringProduct
    {
        [JsonProperty("key")]
        public string key;

        [JsonProperty("referenceKey")]
        public string referenceKey;

        [JsonProperty("type")]
        public int type;

        [JsonProperty("quantity")]
        public int quantity;

        [JsonProperty("isPremium")]
        public bool isPremium;

        [JsonProperty("index")]
        public int index;
    }

    [Serializable]
    public class ActivityInfo
    {
        [JsonProperty("experiencesGain")]
        public int experiencesGain;

        [JsonProperty("energyCost")]
        public int energyCost;
    }

    [Serializable]
    public class Activities
    {
        [JsonProperty("key")]
        public string key;

        [JsonProperty("water")]
        public ActivityInfo water;

        [JsonProperty("feedAnimal")]
        public ActivityInfo feedAnimal;

        [JsonProperty("usePestiside")]
        public ActivityInfo usePestiside;

        [JsonProperty("useFertilizer")]
        public ActivityInfo useFertilizer;

        [JsonProperty("useHerbicide")]
        public ActivityInfo useHerbicide;

        [JsonProperty("helpUseHerbicide")]
        public ActivityInfo helpUseHerbicide;

        [JsonProperty("helpUsePestiside")]
        public ActivityInfo helpUsePestiside;

        [JsonProperty("helpWater")]
        public ActivityInfo helpWater;

        [JsonProperty("thiefCrop")]
        public ActivityInfo thiefCrop;

        [JsonProperty("helpFeedAnimal")]
        public ActivityInfo helpFeedAnimal;

        [JsonProperty("thiefAnimalProduct")]
        public ActivityInfo thiefAnimalProduct;
    }

    [Serializable]
    public class Rewards
    {
        [JsonProperty("key")]
        public string key;

        [JsonProperty("fromInvites")]
        public FromInvites fromInvites;

        [JsonProperty("referred")]
        public long referred;
    }

    [Serializable]
    public class FromInvites
    {
        [JsonProperty("key")]
        public string key;

        [JsonProperty("metrics")]
        [SerializedDictionary()]
        public SerializedDictionary<int, Metric> metrics;
    }

    [Serializable]
    public class Metric
    {
        [JsonProperty("key")]
        public int key;

        [JsonProperty("value")]
        public long value;
    }

    [Serializable]
    public class CropRandomness
    {
        [JsonProperty("key")]
        public string key;

        [JsonProperty("theif3")]
        public double theif3;

        [JsonProperty("theif2")]
        public double theif2;

        [JsonProperty("needWater")]
        public double needWater;

        [JsonProperty("IsWeedyOrInfested")]
        public double isWeedyOrInfested;
    }

    [Serializable]
    public class Spin
    {
        [JsonProperty("key")]
        public string key;

        [JsonProperty("goldAmount")]
        public long goldAmount;

        [JsonProperty("tokenAmount")]
        public double tokenAmount;

        [JsonProperty("quantity")]
        public int quantity;

        [JsonProperty("type")]
        public int type;

        [JsonProperty("thresholdMin")]
        public double thresholdMin;

        [JsonProperty("thresholdMax")]
        public double thresholdMax;
    }

    [Serializable]
    public class DailyReward
    {
        [JsonProperty("key")]
        public string key;

        [JsonProperty("amount")]
        public int amount;

        [JsonProperty("day")]
        public int day;

        [JsonProperty("isLastDay")]
        public bool isLastDay;

        [JsonProperty("dailyRewardPossibilities")]
        public SerializedDictionary<int, LastDailyRewardPossibility> dailyRewardPossibilities;
    }

    [Serializable]
    public class LastDailyRewardPossibility
    {
        [JsonProperty("key")]
        public string key;

        [JsonProperty("goldAmount")]
        public int goldAmount;

        [JsonProperty("tokenAmount")]
        public float tokenAmount;

        [JsonProperty("thresholdMin")]
        public float thresholdMin;

        [JsonProperty("thresholdMax")]
        public float thresholdMax;
    }
    [Serializable]
    public class TokenConfigure
    {
        [JsonProperty("key")]
        public string key;

        [JsonProperty("decimals")]
        public int decimals;
    }

    [Serializable]
    public class StarterConfigure
    {
        [JsonProperty("key")]
        public string key;

        [JsonProperty("goldAmount")]
        public long goldAmount;
    }

    [Serializable]
    public class SpinConfigure
    {
        [JsonProperty("key")]
        public string key;

        [JsonProperty("spinPrice")]
        public long spinPrice;

        [JsonProperty("freeSpinTime")]
        public long freeSpinTime;
    }

}