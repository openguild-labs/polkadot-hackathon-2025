using System;
using System.Collections.Generic;
using CiFarm.Scripts.SceneController.Game;
using CiFarm.Scripts.Services;
using CiFarm.Scripts.Services.NakamaServices;
using CiFarm.Scripts.UI.Popups.Shop;
using CiFarm.Scripts.Utilities;
using DG.Tweening;
using Imba.Audio;
using Imba.UI;
using SuperScrollView;
using TMPro;
using UnityEngine;
using UnityEngine.Events;

namespace CiFarm.Scripts.UI.Popups
{
    public class ShopPopup : UIPopup
    {
        [SerializeField] private TextMeshProUGUI userWallet;
        [SerializeField] private LoopListView2   shopItemLoopListView;
        [SerializeField] private ShopTab         seedTab;
        [SerializeField] private ShopTab         animaTab;
        [SerializeField] private ShopTab         buildingTab;
        [SerializeField] private ShopTab         treeTab;

        private UnityAction        _onClose;
        public  List<ShopItemData> shopItemsData;

        private string _buildingId;

        public int _currentCoin = 0;

        protected override void OnInit()
        {
            base.OnInit();
            shopItemsData = new();
            shopItemLoopListView.InitListView(0, OnGetItemByIndex);
            NakamaUserService.Instance.OnGoldChange = (FetchUserCoin);
        }

        protected override void OnShowing()
        {
            base.OnShowing();
            ClearSelectedShop();

            if (Parameter != null)
            {
                var param = (ShopPopupParam)Parameter;
                _onClose    = param.CloseCallBack;
                _buildingId = param.BuildingId;

                if (param.HideOther)
                {
                    seedTab.SetActive(false);
                    animaTab.SetActive(false);
                    buildingTab.SetActive(false);
                    treeTab.SetActive(false);
                }
                else // DEFAULT
                {
                    seedTab.SetActive(true);
                    buildingTab.SetActive(true);
                    // treeTab.SetActive(true);
                }

                switch (param.TabToOpen)
                {
                    case ShopType.Seed:
                        seedTab.SetActive(true);
                        LoadItemShopSeed();
                        break;
                    case ShopType.Animal:
                        animaTab.SetActive(true);
                        LoadItemShopByAnimal();
                        break;
                    case ShopType.Building:
                        buildingTab.SetActive(true);
                        LoadItemShopByBuilding();
                        break;
                    case ShopType.Tree:
                        treeTab.SetActive(true);
                        LoadItemShopByTree();
                        break;
                    default:
                        seedTab.SetActive(true);
                        LoadItemShopSeed();
                        break;
                }
            }
            else
            {
                seedTab.SetSelect(true);
                LoadItemShopSeed();
            }

            FetchUserCoin();
        }

        private void ResetListView()
        {
            shopItemLoopListView.RecycleAllItem();
            shopItemLoopListView.SetListItemCount(shopItemsData.Count);
            shopItemLoopListView.MovePanelToItemIndex(0, 0);
        }

        public void ClearSelectedShop()
        {
            seedTab.SetSelect(false);
            animaTab.SetSelect(false);
            treeTab.SetSelect(false);
            buildingTab.SetSelect(false);
        }

        private LoopListViewItem2 OnGetItemByIndex(LoopListView2 listView, int index)
        {
            if (index < 0 || index >= shopItemsData.Count)
            {
                return null;
            }

            ShopItemData itemData = shopItemsData[index];

            if (itemData == null)
            {
                return null;
            }

            LoopListViewItem2 item;
            item = listView.NewListViewItem("ShopItem");
            var itemScript = item.GetComponent<ShopItem>();
            itemScript.InitData(itemData, OnClickBuyItem);
            return item;
        }

        protected override void OnHiding()
        {
            base.OnHiding();
            AudioManager.Instance.PlaySFX(AudioName.Close1);
            _onClose?.Invoke();
        }

        public void FetchUserCoin()
        {
            var targetCoin = NakamaUserService.Instance.golds;
            DOTween.To(() => _currentCoin, x => _currentCoin = x, targetCoin, 0.3f)
                .OnUpdate(() => { userWallet.text = _currentCoin.ToString(); });
        }

        #region NAKAMA COMMUNICATE

        public void LoadItemShopSeed()
        {
            ClearSelectedShop();
            seedTab.SetSelect(true);
            var rawData = NakamaAssetsDataService.Instance.crops;
            shopItemsData.Clear();
            foreach (var data in rawData)
            {
                if (!data.availableInShop)
                {
                    continue;
                }

                var gameConfig = ResourceService.Instance.ModelGameObjectConfig.GetPlant(data.key);

                shopItemsData.Add(new ShopItemData
                {
                    itemKey      = data.key,
                    textItemName = gameConfig.ItemName,
                    shopType     = ShopType.Seed,
                    // textItemTimeDetail   = (data.growthStageDuration).ToString(),
                    // textItemProfitDetail = data.maxHarvestQuantity.ToString(),
                    textItemTimeDetail =
                        "Time: " + ((float)data.growthStageDuration / 60).ToString("F2") + " per stage",
                    textItemProfitDetail = "Products: " + data.maxHarvestQuantity,
                    textItemPrice        = data.price.ToString(),
                    iconItem             = gameConfig.GameShopIcon
                });
            }

            ResetListView();
        }

        public void LoadItemShopByAnimal()
        {
            ClearSelectedShop();
            animaTab.SetSelect(true);
            var rawData = NakamaAssetsDataService.Instance.animals;
            shopItemsData.Clear();
            foreach (var data in rawData)
            {
                if (!data.availableInShop)
                {
                    continue;
                }

                var gameConfig = ResourceService.Instance.ModelGameObjectConfig.GetPlant(data.key);
                shopItemsData.Add(new ShopItemData
                {
                    itemKey      = data.key,
                    textItemName = gameConfig.ItemName,
                    shopType     = ShopType.Animal,
                    // textItemTimeDetail   = (data.growthStageDuration).ToString(),
                    // textItemProfitDetail = data.maxHarvestQuantity.ToString(),
                    textItemTimeDetail =
                        "Time: " + ((float)data.growthTime / 60).ToString("F2") + " to grow",
                    textItemProfitDetail = "Provide product each: " + ((float)data.yieldTime / 60).ToString("F2"),
                    textItemPrice        = data.offspringPrice.ToString(),
                    iconItem             = gameConfig.GameShopIcon
                });
            }

            ResetListView();
        }

        public void LoadItemShopByTree()
        {
            ClearSelectedShop();
            treeTab.SetSelect(true);

            shopItemsData.Clear();
            ResetListView();
        }

        public void LoadItemShopByBuilding()
        {
            ClearSelectedShop();
            buildingTab.SetSelect(true);
            var rawData = NakamaAssetsDataService.Instance.buildings;
            shopItemsData.Clear();
            foreach (var data in rawData)
            {
                if (!data.availableInShop)
                {
                    continue;
                }

                var gameConfig = ResourceService.Instance.ModelGameObjectConfig.GetTile(data.key);
                var detail     = ResourceService.Instance.ItemDetailConfig.GetItemDetail(data.key);
                if (detail == null || gameConfig == null)
                {
                    continue;
                }

                shopItemsData.Add(new ShopItemData
                {
                    itemKey              = data.key,
                    shopType             = ShopType.Building,
                    textItemName         = gameConfig.ItemName,
                    textItemTimeDetail   = detail.ItemDescription,
                    textItemProfitDetail = "",
                    textItemPrice        = data.price.ToString(),
                    iconItem             = gameConfig.GameShopIcon
                });
            }

            ResetListView();
        }

        private void OnClickBuyItem(ShopItemData item)
        {
            //Validate
            if (_currentCoin < int.Parse(item.textItemPrice))
            {
                UIManager.Instance.PopupManager.ShowMessageDialog("Buy fail",
                    "You do not have enough gold to buy this item", UIMessageBox.MessageBoxType.OK);
                NakamaUserService.Instance.LoadWalletAsync();
                return;
            }

            DLogger.Log("Buy Item: " + item.textItemName, "SHOP");
            switch (item.shopType)
            {
                case ShopType.Seed:
                    BuyToInventory(item);
                    break;
                case ShopType.Animal:

                    BuyAnimal(item);
                    break;
                case ShopType.Building:
                    ConstructionBuilding(item);
                    break;
                case ShopType.Tree:
                    break;
            }
        }

        private async void BuyToInventory(ShopItemData item)
        {
            try
            {
                await NakamaFarmingService.Instance.BuySeed(item.itemKey);
                AudioManager.Instance.PlaySFX(AudioName.PowerUpBright);
            }
            catch (Exception e)
            {
                UIManager.Instance.PopupManager.ShowMessageDialog("Buy fail",
                    "You do not have enough gold to buy this item", UIMessageBox.MessageBoxType.OK);
                DLogger.LogWarning("Buy Item error: " + e.Message, "SHOP");
            }
        }

        private void ConstructionBuilding(ShopItemData item)
        {
            Hide(true);
            GameController.Instance.EnterEditMode(new InvenItemData
            {
                key          = item.itemKey,
                referenceKey = item.itemKey,
                quantity     = 1,
                isPremium    = false,
                isUnique     = false,
                type         = InventoryType.Building,
                iconItem     = item.iconItem
            });
        }

        private void BuyAnimal(ShopItemData item)
        {
            Hide(true);
            GameController.Instance.EnterEditMode(new InvenItemData
            {
                key          = item.itemKey,
                referenceKey = item.itemKey,
                quantity     = 1,
                isPremium    = false,
                isUnique     = false,
                type         = InventoryType.Animal,
                iconItem     = item.iconItem
            }, _buildingId);
        }

        #endregion
    }

    [System.Serializable]
    public class ShopItemData
    {
        public string   itemKey;
        public string   textItemName;
        public string   textItemTimeDetail;
        public string   textItemProfitDetail;
        public string   textItemPrice;
        public ShopType shopType;
        public Sprite   iconItem;
    }

    public enum ShopType
    {
        Seed     = 0,
        Animal   = 1,
        Building = 2,
        Tree     = 3
    }

    public class ShopPopupParam
    {
        public ShopType    TabToOpen;
        public bool        HideOther = false;
        public string      BuildingId;
        public UnityAction CloseCallBack;
    }
}