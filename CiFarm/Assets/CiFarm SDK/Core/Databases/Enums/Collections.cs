using CiFarm.Utils;

namespace CiFarm.Core.Databases
{
    // Enum equivalent for Collection
    public enum Collection
    {
        [EnumStringValue("cropSpeedUp")]
        CropSpeedUp,

        [EnumStringValue("animalSpeedUp")]
        AnimalSpeedUp,

        [EnumStringValue("energySpeedUp")]
        EnergySpeedUp,
    }
}
