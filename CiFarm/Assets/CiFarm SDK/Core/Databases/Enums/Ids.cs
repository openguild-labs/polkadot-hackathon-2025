using CiFarm.Utils;
using Newtonsoft.Json;

namespace CiFarm.Core.Databases
{
    // Animal Enum
    public enum AnimalId
    {
        [EnumStringValue("chicken")]
        Chicken,

        [EnumStringValue("cow")]
        Cow,

        [EnumStringValue("pig")]
        Pig,

        [EnumStringValue("sheep")]
        Sheep,
    }

    // Building Enum
    public enum BuildingId
    {
        [EnumStringValue("coop")]
        Coop,

        [EnumStringValue("pasture")]
        Pasture,

        [EnumStringValue("home")]
        Home,
    }

    // Upgrade Enum
    public enum UpgradeId
    {
        [EnumStringValue("coopUpgrade1")]
        CoopUpgrade1,

        [EnumStringValue("coopUpgrade2")]
        CoopUpgrade2,

        [EnumStringValue("coopUpgrade3")]
        CoopUpgrade3,

        [EnumStringValue("pastureUpgrade1")]
        PastureUpgrade1,

        [EnumStringValue("pastureUpgrade2")]
        PastureUpgrade2,

        [EnumStringValue("pastureUpgrade3")]
        PastureUpgrade3,
    }

    // Crop Enum
    public enum CropId
    {
        [EnumStringValue("carrot")]
        Carrot,

        [EnumStringValue("potato")]
        Potato,

        [EnumStringValue("pineapple")]
        Pineapple,

        [EnumStringValue("watermelon")]
        Watermelon,

        [EnumStringValue("cucumber")]
        Cucumber,

        [EnumStringValue("bellPepper")]
        BellPepper,
    }

    // Daily Reward Enum
    public enum DailyRewardId
    {
        [EnumStringValue("day1")]
        Day1,

        [EnumStringValue("day2")]
        Day2,

        [EnumStringValue("day3")]
        Day3,

        [EnumStringValue("day4")]
        Day4,

        [EnumStringValue("day5")]
        Day5,
    }

    // Daily Reward Possibility Enum
    public enum DailyRewardPossibilityId
    {
        [EnumStringValue("possibility1")]
        Possibility1,

        [EnumStringValue("possibility2")]
        Possibility2,

        [EnumStringValue("possibility3")]
        Possibility3,

        [EnumStringValue("possibility4")]
        Possibility4,

        [EnumStringValue("possibility5")]
        Possibility5,
    }

    // Supply Enum
    public enum SupplyId
    {
        [EnumStringValue("basicFertilizer")]
        BasicFertilizer,

        [EnumStringValue("animalFeed")]
        AnimalFeed,
    }

    // Tile Enum
    public enum TileId
    {
        [EnumStringValue("starterTile")]
        StarterTile,

        [EnumStringValue("basicTile1")]
        BasicTile1,

        [EnumStringValue("basicTile2")]
        BasicTile2,

        [EnumStringValue("basicTile3")]
        BasicTile3,

        [EnumStringValue("fertileTile")]
        FertileTile,
    }

    // Tool Enum
    public enum ToolId
    {
        [EnumStringValue("scythe")]
        Scythe,

        [EnumStringValue("steal")]
        Steal,

        [EnumStringValue("watercan")]
        WaterCan,

        [EnumStringValue("herbicide")]
        Herbicide,

        [EnumStringValue("pesticide")]
        Pesticide,
    }

    // Product Enum
    public enum ProductId
    {
        [EnumStringValue("egg")]
        Egg,

        [EnumStringValue("milk")]
        Milk,

        [EnumStringValue("carrot")]
        Carrot,

        [EnumStringValue("potato")]
        Potato,

        [EnumStringValue("pineapple")]
        Pineapple,

        [EnumStringValue("watermelon")]
        Watermelon,

        [EnumStringValue("cucumber")]
        Cucumber,

        [EnumStringValue("bellPepper")]
        BellPepper,
    }

    // System Enum
    public enum SystemId
    {
        [EnumStringValue("activities")]
        Activities,

        [EnumStringValue("cropRandomness")]
        CropRandomness,

        [EnumStringValue("animalRandomness")]
        AnimalRandomness,

        [EnumStringValue("starter")]
        Starter,

        [EnumStringValue("spinInfo")]
        SpinInfo,

        [EnumStringValue("energyRegen")]
        EnergyRegen,
    }

    // Temporary Enum
    public enum TempId
    {
        [EnumStringValue("cropGrowthLastSchedule")]
        CropGrowthLastSchedule,

        [EnumStringValue("animalGrowthLastSchedule")]
        AnimalGrowthLastSchedule,

        [EnumStringValue("energyRegenerationLastSchedule")]
        EnergyRegenerationLastSchedule,
    }

    // Inventory Type Enum
    public enum InventoryTypeId
    {
        [EnumStringValue("carrotSeed")]
        CarrotSeed,

        [EnumStringValue("potatoSeed")]
        PotatoSeed,

        [EnumStringValue("pineappleSeed")]
        PineappleSeed,

        [EnumStringValue("watermelonSeed")]
        WatermelonSeed,

        [EnumStringValue("cucumberSeed")]
        CucumberSeed,

        [EnumStringValue("bellPepperSeed")]
        BellPepperSeed,
    }

    // Placed Item Type Enum
    public enum PlacedItemTypeId
    {
        [EnumStringValue("chicken")]
        Chicken,

        [EnumStringValue("cow")]
        Cow,

        [EnumStringValue("pig")]
        Pig,

        [EnumStringValue("sheep")]
        Sheep,

        [EnumStringValue("coop")]
        Coop,

        [EnumStringValue("pasture")]
        Pasture,

        [EnumStringValue("home")]
        Home,

        [EnumStringValue("starterTile")]
        StarterTile,

        [EnumStringValue("basicTile1")]
        BasicTile1,

        [EnumStringValue("basicTile2")]
        BasicTile2,

        [EnumStringValue("basicTile3")]
        BasicTile3,

        [EnumStringValue("fertileTile")]
        FertileTile,
    }
}
