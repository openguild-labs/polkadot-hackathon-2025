using System.Collections;
using CiFarm.Core.Databases;
using CiFarm.GraphQL;
using CiFarm.Utils;
using Imba.Utils;
using UnityEngine;

namespace CiFarm.DataManager
{
    public class UserDataManager : ManualSingletonMono<UserDataManager>
    {
        [field: SerializeField]
        public UserEntity User { get; set; }

        [Header("Inventories")]
        [field: SerializeField]
        public Pagination<InventoryEntity> InventoryPagination { get; set; }

        [field: SerializeField]
        public Pagination<PlacedItemEntity> PlacedItemPagination { get; set; }

        [field: SerializeField]
        public Pagination<DeliveringProductEntity> DeliveringProductPagination { get; set; }

        public IEnumerator Start()
        {
            yield return new WaitUntil(
                () => CiFarmSDK.Instance != null && CiFarmSDK.Instance.Authenticated
            );

            FetchUserAsync();
            FetchInventoriesAsync();
            FetchPlacedItemsAsync();
            FetchDeliveringProductsAsync();
        }

        public async void FetchUserAsync()
        {
            // Load user data
            User = await CiFarmSDK.Instance.GraphQLClient.QueryUserAsync();
        }

        public async void FetchInventoriesAsync(int page = 0)
        {
            var offset = page * CiFarmSDK.Instance.PageSize;
            var take = CiFarmSDK.Instance.PageSize;

            var args = new GetInventoriesArgs() { Limit = take, Offset = offset };

            var response = await CiFarmSDK.Instance.GraphQLClient.QueryInventoriesAsync(args);
            InventoryPagination = new Pagination<InventoryEntity>(
                response.Data,
                page,
                take,
                response.Count
            );
        }

        public async void FetchPlacedItemsAsync(int page = 0)
        {
            var offset = page * CiFarmSDK.Instance.PageSize;
            var take = CiFarmSDK.Instance.PageSize;

            var args = new GetPlacedItemsArgs() { Limit = take, Offset = offset };

            var response = await CiFarmSDK.Instance.GraphQLClient.QueryPlacedItemsAsync(args);
            PlacedItemPagination = new Pagination<PlacedItemEntity>(
                response.Data,
                page,
                take,
                response.Count
            );
        }

        public async void FetchDeliveringProductsAsync(int page = 0)
        {
            var offset = page * CiFarmSDK.Instance.PageSize;
            var take = CiFarmSDK.Instance.PageSize;

            var args = new GetDeliveringProductsArgs() { Limit = take, Offset = offset };

            var response = await CiFarmSDK.Instance.GraphQLClient.QueryDeliveringProductsAsync(
                args
            );

            DeliveringProductPagination = new Pagination<DeliveringProductEntity>(
                response.Data,
                page,
                take,
                response.Count
            );
        }
    }
}
