using System.Threading.Tasks;
using CiFarm.Scripts.Services.NakamaServices.BaseServices;
using Imba.Utils;

namespace CiFarm.Scripts.Services.NakamaServices
{
    public class NakamaEditFarmService : ManualSingletonMono<NakamaEditFarmService>
    {
        public async Task PlaceTileAsync(string inventoryTileKey, Position position)
        {
            await NakamaRpcService.Instance.PlaceTileRpcAsync(new NakamaRpcService.PlaceTileRpcAsyncParams
            {
                inventoryTileKey = inventoryTileKey,
                position         = position
            });

            NakamaUserService.Instance.LoadInventoriesAsync();
            await NakamaSocketService.Instance.ForceCentralBroadcastInstantlyRpcAsync();
        }

        public async Task PlaceAnimalAsync(string animalKey, string constructKey, Position position)
        {
            await NakamaRpcService.Instance.BuyAnimalRpcAsync(new()
            {
                key                   = animalKey,
                placedItemBuildingKey = constructKey,
                Position              = position
            });

            NakamaUserService.Instance.LoadInventoriesAsync();
            await NakamaSocketService.Instance.ForceCentralBroadcastInstantlyRpcAsync();
        }

        public async Task ConstructBuildingAsync(string buildingKey, Position position)
        {
            await NakamaRpcService.Instance.ConstructBuildingRpcAsync(new NakamaRpcService.ConstructBuildingRpcParams
            {
                Key      = buildingKey,
                Position = position
            });

            NakamaUserService.Instance.LoadWalletAsync();
            NakamaUserService.Instance.LoadInventoriesAsync();
            await NakamaSocketService.Instance.ForceCentralBroadcastInstantlyRpcAsync();
        }
    }
}