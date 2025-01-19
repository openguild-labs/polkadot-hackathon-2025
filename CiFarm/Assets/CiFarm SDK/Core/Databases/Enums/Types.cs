using CiFarm.Utils;

namespace CiFarm.Core.Databases
{
    // Product Type Enum
    public enum ProductType
    {
        [EnumStringValue("animal")]
        Animal,

        [EnumStringValue("crop")]
        Crop,
    }

    // Animal Type Enum
    public enum AnimalType
    {
        [EnumStringValue("poultry")]
        Poultry,

        [EnumStringValue("livestock")]
        Livestock,
    }

    // Available In Type Enum
    public enum AvailableInType
    {
        [EnumStringValue("home")]
        Home,

        [EnumStringValue("neighbor")]
        Neighbor,

        [EnumStringValue("both")]
        Both,
    }

    // Supply Type Enum
    public enum SupplyType
    {
        [EnumStringValue("fertilizer")]
        Fertilizer,

        [EnumStringValue("animalFeed")]
        AnimalFeed,
    }

    // Spin Type Enum
    public enum SpinPrizeType
    {
        [EnumStringValue("gold")]
        Gold,

        [EnumStringValue("seed")]
        Seed,

        [EnumStringValue("supply")]
        Supply,

        [EnumStringValue("token")]
        Token,
    }

    // Inventory Type Enum
    public enum InventoryType
    {
        [EnumStringValue("seed")]
        Seed,

        [EnumStringValue("tile")]
        Tile,

        [EnumStringValue("animal")]
        Animal,

        [EnumStringValue("product")]
        Product,

        [EnumStringValue("supply")]
        Supply,
    }

    // Placed Item Type Enum
    public enum PlacedItemType
    {
        [EnumStringValue("tile")]
        Tile,

        [EnumStringValue("building")]
        Building,

        [EnumStringValue("animal")]
        Animal,
    }

    // AppearanceChance Enum
    public enum AppearanceChance
    {
        [EnumStringValue("common")]
        Common,

        [EnumStringValue("uncommon")]
        Uncommon,

        [EnumStringValue("rare")]
        Rare,

        [EnumStringValue("veryRare")]
        VeryRare,
    }
}
