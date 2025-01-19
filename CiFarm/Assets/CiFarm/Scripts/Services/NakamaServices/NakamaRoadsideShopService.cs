using CiFarm.Scripts.Utilities;
using Imba.Utils;
using System;
using System.Collections;
using System.Collections.Generic;
using CiFarm.Scripts.Services.NakamaServices.BaseServices;
using UnityEngine;
using UnityEngine.Events;

namespace CiFarm.Scripts.Services.NakamaServices
{
    public class NakamaRoadsideShopService : ManualSingletonMono<NakamaRoadsideShopService>
    {
        public UnityAction OnDeliveringProductsUpdated;

        private IEnumerator Start()
        {
            yield return new WaitUntil(() => NakamaInitializerService.Instance.authenticated);

            //load
            LoadDeliveringProductsAsync();
        }

        [ReadOnly]
        public List<DeliveringProduct> deliveringProducts;

        public async void LoadDeliveringProductsAsync()
        {
            var data = await NakamaRpcService.Instance.ListDeliveringProductsRpcAsync();
            deliveringProducts = data.deliveringProducts;
            OnDeliveringProductsUpdated?.Invoke();
            DLogger.Log("Delivering product loaded", "Nakama - Delivering Products", LogColors.LimeGreen);
        }

        public async void DeliverProductsAsync(NakamaRpcService.InventoryWithIndex inventoryWithIndex)
        {
            await NakamaRpcService.Instance.DeliverProductsRpcAsync(new NakamaRpcService.DeliverProductsRpcAsyncParams
            {
                inventoryWithIndex = inventoryWithIndex
            });

            DLogger.Log("DeliverProductsAsync", "Nakama - Delivering Products", LogColors.LimeGreen);
            LoadDeliveringProductsAsync();
            NakamaUserService.Instance.LoadInventoriesAsync();
        }

        public async void RetainProductsAsync(DeliveringProduct deliveringProduct)
        {
            if (!NakamaInitializerService.Instance.authenticated) throw new Exception("Unauthenticated");

            await NakamaRpcService.Instance.RetainProductsRpcAsync(new NakamaRpcService.RetainProductsRpcAsyncParams
            {
                deliveringProduct = deliveringProduct
            });

            DLogger.Log("RetainProductsAsync", "Nakama - Delivering Products", LogColors.LimeGreen);
            LoadDeliveringProductsAsync();
            NakamaUserService.Instance.LoadInventoriesAsync();
        }
    }
}