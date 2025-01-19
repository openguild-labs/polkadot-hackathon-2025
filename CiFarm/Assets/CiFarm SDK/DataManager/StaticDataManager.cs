using System.Collections;
using System.Collections.Generic;
using CiFarm.Core.Databases;
using CiFarm.Utils;
using Imba.Utils;
using UnityEngine;

namespace CiFarm.DataManager
{
    public class StaticDataManager : ManualSingletonMono<StaticDataManager>
    {
        /// <summary>
        /// List of animals
        /// </summary>
        [field: SerializeField]
        public List<AnimalEntity> Animals { get; set; }

        /// <summary>
        /// List of buildings
        /// </summary>
        [field: SerializeField]
        public List<BuildingEntity> Buildings { get; set; }

        /// <summary>
        /// List of crops
        /// </summary>
        [field: SerializeField]
        public List<CropEntity> Crops { get; set; }

        /// <summary>
        /// List of placed item types
        /// </summary>
        [field: SerializeField]
        public List<PlacedItemTypeEntity> PlacedItemTypes { get; set; }

        /// <summary>
        /// List of spin prizes
        /// </summary>
        [field: SerializeField]
        public List<SpinPrizeEntity> SpinPrizes { get; set; }

        /// <summary>
        /// List of spin slots
        /// </summary>
        [field: SerializeField]
        public List<SpinSlotEntity> SpinSlots { get; set; }

        /// <summary>
        /// List of supplies
        /// </summary>
        [field: SerializeField]
        public List<SupplyEntity> Supplies { get; set; }

        /// <summary>
        /// List of tiles
        /// </summary>
        [field: SerializeField]
        public List<TileEntity> Tiles { get; set; }

        /// <summary>
        /// List of tools
        /// </summary>
        [field: SerializeField]
        public List<ToolEntity> Tools { get; set; }

        /// <summary>
        /// List of inventory types
        /// </summary>
        [field: SerializeField]
        public List<InventoryTypeEntity> InventoryTypes { get; set; }

        /// <summary>
        /// List of products
        /// </summary>
        [field: SerializeField]
        public List<ProductEntity> Products { get; set; }

        /// <summary>
        /// List of daily rewards
        /// </summary>
        [field: SerializeField]
        public List<DailyRewardEntity> DailyRewards { get; set; }

        /// <summary>
        /// List of upgrades
        /// </summary>
        [field: SerializeField]
        public List<UpgradeEntity> Upgrades { get; set; }

        /// <summary>
        /// Activities
        /// </summary>
        [field: SerializeField]
        public Activities Activities { get; set; }

        /// <summary>
        /// Animal Randomness
        /// </summary>
        [field: SerializeField]
        public AnimalRandomness AnimalRandomness { get; set; }

        /// <summary>
        /// Crop Randomness
        /// </summary>
        [field: SerializeField]
        public CropRandomness CropRandomness { get; set; }

        /// <summary>
        /// Starter
        /// </summary>
        [field: SerializeField]
        public Starter Starter { get; set; }

        /// <summary>
        /// Spin Info
        /// </summary>
        [field: SerializeField]
        public SpinInfo SpinInfo { get; set; }

        /// <summary>
        /// Energy Regen
        /// </summary>
        [field: SerializeField]
        public EnergyRegen EnergyRegen { get; set; }

        public IEnumerator Start()
        {
            yield return new WaitUntil(
                () => CiFarmSDK.Instance != null && CiFarmSDK.Instance.Authenticated
            );

            FetchAnimalsAsync();
            FetchBuildingsAsync();
            FetchCropsAsync();
            FetchPlacedItemTypesAsync();
            FetchSpinPrizesAsync();
            FetchSpinSlotsAsync();
            FetchSuppliesAsync();
            FetchTilesAsync();
            FetchToolsAsync();
            FetchInventoryTypesAsync();
            FetchProductsAsync();
            FetchDailyRewardsAsync();
            FetchUpgradesAsync();
            FetchActivitiesAsync();
            FetchAnimalRandomnessAsync();
            FetchCropRandomnessAsync();
            FetchStarterAsync();
            FetchSpinInfoAsync();
            FetchEnergyRegenAsync();
        }

        public async void FetchAnimalsAsync()
        {
            Animals = await CiFarmSDK.Instance.GraphQLClient.QueryAnimalsAsync();
            ConsoleLogger.LogVerbose($"Fetched {Animals.Count} animals");
        }

        public async void FetchBuildingsAsync()
        {
            Buildings = await CiFarmSDK.Instance.GraphQLClient.QueryBuildingsAsync();
            ConsoleLogger.LogVerbose($"Fetched {Buildings.Count} buildings");
        }

        public async void FetchCropsAsync()
        {
            Crops = await CiFarmSDK.Instance.GraphQLClient.QueryCropsAsync();
            ConsoleLogger.LogVerbose($"Fetched {Crops.Count} crops");
        }

        public async void FetchPlacedItemTypesAsync()
        {
            PlacedItemTypes = await CiFarmSDK.Instance.GraphQLClient.QueryPlacedItemTypesAsync();
            ConsoleLogger.LogVerbose($"Fetched {PlacedItemTypes.Count} placed item types");
        }

        public async void FetchSpinPrizesAsync()
        {
            SpinPrizes = await CiFarmSDK.Instance.GraphQLClient.QuerySpinPrizesAsync();
            ConsoleLogger.LogVerbose($"Fetched {SpinPrizes.Count} spin prizes");
        }

        public async void FetchSpinSlotsAsync()
        {
            SpinSlots = await CiFarmSDK.Instance.GraphQLClient.QuerySpinSlotsAsync();
            ConsoleLogger.LogVerbose($"Fetched {SpinSlots.Count} spin slots");
        }

        public async void FetchSuppliesAsync()
        {
            Supplies = await CiFarmSDK.Instance.GraphQLClient.QuerySuppliesAsync();
            ConsoleLogger.LogVerbose($"Fetched {Supplies.Count} supplies");
        }

        public async void FetchTilesAsync()
        {
            Tiles = await CiFarmSDK.Instance.GraphQLClient.QueryTilesAsync();
            ConsoleLogger.LogVerbose($"Fetched {Tiles.Count} tiles");
        }

        public async void FetchToolsAsync()
        {
            Tools = await CiFarmSDK.Instance.GraphQLClient.QueryToolsAsync();
            ConsoleLogger.LogVerbose($"Fetched {Tools.Count} tools");
        }

        public async void FetchInventoryTypesAsync()
        {
            InventoryTypes = await CiFarmSDK.Instance.GraphQLClient.QueryInventoryTypesAsync();
            ConsoleLogger.LogVerbose($"Fetched {InventoryTypes.Count} inventory types");
        }

        public async void FetchProductsAsync()
        {
            Products = await CiFarmSDK.Instance.GraphQLClient.QueryProductsAsync();
            ConsoleLogger.LogVerbose($"Fetched {Products.Count} products");
        }

        public async void FetchDailyRewardsAsync()
        {
            DailyRewards = await CiFarmSDK.Instance.GraphQLClient.QueryDailyRewardsAsync();
            ConsoleLogger.LogVerbose($"Fetched {DailyRewards.Count} daily rewards");
        }

        public async void FetchUpgradesAsync()
        {
            Upgrades = await CiFarmSDK.Instance.GraphQLClient.QueryUpgradesAsync();
            ConsoleLogger.LogVerbose($"Fetched {Upgrades.Count} upgrades");
        }

        public async void FetchActivitiesAsync()
        {
            Activities = await CiFarmSDK.Instance.GraphQLClient.QueryActivitiesAsync();
            ConsoleLogger.LogVerbose("Fetched activities");
        }

        public async void FetchAnimalRandomnessAsync()
        {
            AnimalRandomness = await CiFarmSDK.Instance.GraphQLClient.QueryAnimalRandomnessAsync();
            ConsoleLogger.LogVerbose("Fetched animal randomness");
        }

        public async void FetchCropRandomnessAsync()
        {
            CropRandomness = await CiFarmSDK.Instance.GraphQLClient.QueryCropRandomnessAsync();
            ConsoleLogger.LogVerbose("Fetched crop randomness");
        }

        public async void FetchStarterAsync()
        {
            Starter = await CiFarmSDK.Instance.GraphQLClient.QueryStarterAsync();
            ConsoleLogger.LogVerbose("Fetched starter");
        }

        public async void FetchSpinInfoAsync()
        {
            SpinInfo = await CiFarmSDK.Instance.GraphQLClient.QuerySpinInfoAsync();
            ConsoleLogger.LogVerbose("Fetched spin info");
        }

        public async void FetchEnergyRegenAsync()
        {
            EnergyRegen = await CiFarmSDK.Instance.GraphQLClient.QueryEnergyRegenAsync();
            ConsoleLogger.LogVerbose("Fetched energy regen");
        }
    }
}
