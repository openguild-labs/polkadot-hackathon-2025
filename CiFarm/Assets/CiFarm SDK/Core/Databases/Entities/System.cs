using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using UnityEngine;

namespace CiFarm.Core.Databases
{
    // Represents the System entity
    [Serializable]
    public class SystemEntity : StringAbstractEntity
    {
        [JsonProperty("value")]
        [field: SerializeField]
        public string Value { get; set; }
    }

    // Represents different activities
    [Serializable]
    public class Activities
    {
        [JsonProperty("water")]
        [field: SerializeField]
        public ActivityInfo Water { get; set; }

        [JsonProperty("feedAnimal")]
        [field: SerializeField]
        public ActivityInfo FeedAnimal { get; set; }

        [JsonProperty("usePesticide")]
        [field: SerializeField]
        public ActivityInfo UsePesticide { get; set; }

        [JsonProperty("useFertilizer")]
        [field: SerializeField]
        public ActivityInfo UseFertilizer { get; set; }

        [JsonProperty("useHerbicide")]
        [field: SerializeField]
        public ActivityInfo UseHerbicide { get; set; }

        [JsonProperty("helpUseHerbicide")]
        [field: SerializeField]
        public ActivityInfo HelpUseHerbicide { get; set; }

        [JsonProperty("helpUsePesticide")]
        [field: SerializeField]
        public ActivityInfo HelpUsePesticide { get; set; }

        [JsonProperty("helpWater")]
        [field: SerializeField]
        public ActivityInfo HelpWater { get; set; }

        [JsonProperty("thiefCrop")]
        [field: SerializeField]
        public ActivityInfo ThiefCrop { get; set; }

        [JsonProperty("thiefAnimalProduct")]
        [field: SerializeField]
        public ActivityInfo ThiefAnimalProduct { get; set; }

        [JsonProperty("cureAnimal")]
        [field: SerializeField]
        public ActivityInfo CureAnimal { get; set; }

        [JsonProperty("helpCureAnimal")]
        [field: SerializeField]
        public ActivityInfo HelpCureAnimal { get; set; }

        [JsonProperty("harvestCrop")]
        [field: SerializeField]
        public ActivityInfo HarvestCrop { get; set; }
    }

    // Represents activity info containing experience gained and energy consumed
    [Serializable]
    public class ActivityInfo
    {
        [JsonProperty("experiencesGain")]
        [field: SerializeField]
        public int ExperiencesGain { get; set; }

        [JsonProperty("energyConsume")]
        [field: SerializeField]
        public int EnergyConsume { get; set; }
    }

    // Represents crop randomness values
    [Serializable]
    public class CropRandomness
    {
        [JsonProperty("thief3")]
        [field: SerializeField]
        public int Thief3 { get; set; }

        [JsonProperty("thief2")]
        [field: SerializeField]
        public int Thief2 { get; set; }

        [JsonProperty("needWater")]
        [field: SerializeField]
        public int NeedWater { get; set; }

        [JsonProperty("isWeedyOrInfested")]
        [field: SerializeField]
        public int IsWeedyOrInfested { get; set; }
    }

    // Represents animal randomness values
    [Serializable]
    public class AnimalRandomness
    {
        [JsonProperty("sickChance")]
        [field: SerializeField]
        public int SickChance { get; set; }

        [JsonProperty("thief3")]
        [field: SerializeField]
        public int Thief3 { get; set; }

        [JsonProperty("thief2")]
        [field: SerializeField]
        public int Thief2 { get; set; }
    }

    // Represents positions such as starter tiles and home
    [Serializable]
    public class Positions
    {
        [JsonProperty("tiles")]
        [field: SerializeField]
        public List<Position> Tiles { get; set; }

        [JsonProperty("home")]
        [field: SerializeField]
        public Position Home { get; set; }
    }

    // Represents the starter info with golds and positions
    [Serializable]
    public class Starter
    {
        [JsonProperty("golds")]
        [field: SerializeField]
        public int Golds { get; set; }

        [JsonProperty("positions")]
        [field: SerializeField]
        public Positions Positions { get; set; }
    }

    // Represents spin info, including appearance chance slots
    [Serializable]
    public class SpinInfo
    {
        [JsonProperty("appearanceChanceSlots")]
        [field: SerializeField]
        public Dictionary<AppearanceChance, SlotInfo> AppearanceChanceSlots { get; set; }
    }

    // Represents slot information in a spin
    [Serializable]
    public class SlotInfo
    {
        [JsonProperty("count")]
        [field: SerializeField]
        public int Count { get; set; }

        [JsonProperty("thresholdMin")]
        [field: SerializeField]
        public int ThresholdMin { get; set; }

        [JsonProperty("thresholdMax")]
        [field: SerializeField]
        public int ThresholdMax { get; set; }
    }

    // Represents energy regeneration time in milliseconds
    [Serializable]
    public class EnergyRegen
    {
        [JsonProperty("time")]
        [field: SerializeField]
        public int Time { get; set; }
    }

    // Represents Position data structure (placeholder class)
    [Serializable]
    public class Position
    {
        [JsonProperty("x")]
        [field: SerializeField]
        public int X { get; set; }

        [JsonProperty("y")]
        [field: SerializeField]
        public int Y { get; set; }
    }
}
