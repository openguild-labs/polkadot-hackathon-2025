using CiFarm.Utils;

namespace CiFarm.Core.Databases
{
    // Crop Current State Enum
    public enum CropCurrentState
    {
        [EnumStringValue("normal")]
        Normal,

        [EnumStringValue("needWater")]
        NeedWater,

        [EnumStringValue("isWeedy")]
        IsWeedy,

        [EnumStringValue("isInfested")]
        IsInfested,

        [EnumStringValue("fullyMatured")]
        FullyMatured,
    }

    // Animal Current State Enum
    public enum AnimalCurrentState
    {
        [EnumStringValue("normal")]
        Normal,

        [EnumStringValue("hungry")]
        Hungry,

        [EnumStringValue("sick")]
        Sick,

        [EnumStringValue("yield")]
        Yield,
    }
}
