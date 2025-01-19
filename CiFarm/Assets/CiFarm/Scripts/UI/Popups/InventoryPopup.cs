using System.Collections.Generic;
using CiFarm.Scripts.SceneController.Game;
using CiFarm.Scripts.Services;
using CiFarm.Scripts.Services.GameDatas;
using CiFarm.Scripts.Services.NakamaServices;
using CiFarm.Scripts.UI.Popups.Inventory;
using CiFarm.Scripts.UI.View;
using Imba.UI;
using SuperScrollView;
using UnityEngine;
using UnityEngine.Events;

namespace CiFarm.Scripts.UI.Popups
{
    public class InventoryPopup : UIPopup
    {
        [SerializeField] private List<InventoryTab> inventoryTabs;
        [SerializeField] private LoopGridView       loopGridView;

        public List<InvenItemData> inventoryItemsData;

        private InventoryTab currentTab;
        private UnityAction  _onClose;

        protected override void OnInit()
        {
            base.OnInit();
            loopGridView.InitGridView(0, OnGetItemByIndex);
        }

        protected override void OnShowing()
        {
            base.OnShowing();
            if (Parameter != null)
            {
                var param = (GameViewParam)Parameter;
                _onClose = param.callBack;
            }

            OnClickInventoryTab(inventoryTabs[0]);
            LoadAllUserItem();
        }

        protected override void OnHiding()
        {
            base.OnHiding();
            _onClose?.Invoke();
        }

        public void OnClickInventoryTab(InventoryTab tab)
        {
            currentTab = tab;
            foreach (var ivTab in inventoryTabs)
            {
                ivTab.SetSelect(ivTab == tab);
            }
        }

        private LoopGridViewItem OnGetItemByIndex(LoopGridView listView, int indexParam, int indexParam2,
            int indexParam3)
        {
            var index = indexParam;
            if (index < 0 || index >= inventoryItemsData.Count)
            {
                return null;
            }

            var itemData = inventoryItemsData[index];

            if (itemData == null)
            {
                return null;
            }

            var item       = listView.NewListViewItem("InventoryItem");
            var itemScript = item.GetComponent<InventoryItem>();

            itemScript.InitData(itemData, OnClickItem);
            return item;
        }

        private void ResetGridView()
        {
            loopGridView.RecycleAllItem();
            loopGridView.SetListItemCount(inventoryItemsData.Count);
            loopGridView.MovePanelToItemByIndex(0, 0);
        }

        public void OnClickItem(InvenItemData data)
        {
            UIManager.Instance.PopupManager.ShowPopup(UIPopupName.ItemDetailPopup, new ItemDetailPopupParam
            {
                ItemId   = data.referenceKey,
                Quantity = data.quantity,
                IconItem = data.iconItem,
                CanPlace = data.type == InventoryType.Tile,
                CanSell  = false,
                ConfirmCallBack = (dt) =>
                {
                    if (data.type == InventoryType.Tile)
                    {
                        PlacingItem(data);
                    }
                    else
                    {
                        currentTab.OnClick();
                    }
                }
            });
        }

        private void PlacingItem(InvenItemData data)
        {
            Hide(true);
            GameController.Instance.EnterEditMode(data);
        }

        #region NAKAMA

        public void LoadAllUserItem()
        {
            inventoryItemsData.Clear();

            var rawData = NakamaUserService.Instance.inventories;
            if (rawData == null)
            {
                rawData = new();
            }

            foreach (var data in rawData)
            {
                ModelConfigEntity gameConfig;
                switch (data.type)
                {
                    case InventoryType.Seed:
                        gameConfig = ResourceService.Instance.ModelGameObjectConfig.GetPlant(data.referenceKey);
                        break;
                    case InventoryType.Tile:
                        gameConfig = ResourceService.Instance.ModelGameObjectConfig.GetTile(data.referenceKey);
                        break;
                    case InventoryType.Animal:
                        gameConfig = ResourceService.Instance.ModelGameObjectConfig.GetPlant(data.referenceKey);
                        break;
                    case InventoryType.PlantHarvested:
                        gameConfig = ResourceService.Instance.ModelGameObjectConfig.GetPlant(data.referenceKey);

                        break;
                    default:
                        continue;
                }

                var icon = data.type == InventoryType.PlantHarvested
                    ? gameConfig.GameHarvestIcon
                    : gameConfig.GameShopIcon;


                inventoryItemsData.Add(new InvenItemData
                {
                    key          = data.key,
                    referenceKey = data.referenceKey,
                    quantity     = data.quantity,
                    isUnique     = data.unique,
                    iconItem     = icon,
                    isPremium    = data.isPremium,
                    type         = data.type
                });
            }

            ResetGridView();
        }

        public void LoadAllUserItemBySeed()
        {
            inventoryItemsData.Clear();
            inventoryItemsData.Clear();

            var rawData = NakamaUserService.Instance.inventories;
            foreach (var data in rawData)
            {
                ModelConfigEntity gameConfig;
                switch (data.type)
                {
                    case InventoryType.Seed:
                        gameConfig = ResourceService.Instance.ModelGameObjectConfig.GetPlant(data.referenceKey);
                        break;
                    default:
                        continue;
                }

                inventoryItemsData.Add(new InvenItemData
                {
                    key          = data.key,
                    referenceKey = data.referenceKey,
                    type         = data.type,
                    isUnique     = data.unique,
                    quantity     = data.quantity,
                    isPremium    = data.isPremium,
                    iconItem     = gameConfig.GameShopIcon
                });
            }

            ResetGridView();
        }

        public void LoadAllUserItemByAnimal()
        {
            inventoryItemsData.Clear();
            ResetGridView();
        }

        public void LoadAllUserItemByTile()
        {
            inventoryItemsData.Clear();

            var rawData = NakamaUserService.Instance.inventories;
            if (rawData == null)
            {
                rawData = new();
            }

            foreach (var data in rawData)
            {
                ModelConfigEntity gameConfig;
                switch (data.type)
                {
                    case InventoryType.Tile:
                        gameConfig = ResourceService.Instance.ModelGameObjectConfig.GetTile(data.referenceKey);
                        break;
                    default:
                        continue;
                }

                var icon = data.type == InventoryType.PlantHarvested
                    ? gameConfig.GameHarvestIcon
                    : gameConfig.GameShopIcon;


                inventoryItemsData.Add(new InvenItemData
                {
                    key          = data.key,
                    referenceKey = data.referenceKey,
                    quantity     = data.quantity,
                    isUnique     = data.unique,
                    iconItem     = icon,
                    isPremium    = data.isPremium,
                    type         = data.type
                });
            }

            ResetGridView();
        }

        public void LoadAllUserItemByProduct()
        {
            inventoryItemsData.Clear();

            var rawData = NakamaUserService.Instance.inventories;
            foreach (var data in rawData)
            {
                ModelConfigEntity gameConfig;
                switch (data.type)
                {
                    case InventoryType.PlantHarvested:
                        gameConfig = ResourceService.Instance.ModelGameObjectConfig.GetPlant(data.referenceKey);
                        break;
                    default:
                        continue;
                }

                inventoryItemsData.Add(new InvenItemData
                {
                    key          = data.key,
                    referenceKey = data.referenceKey,
                    quantity     = data.quantity,
                    isUnique     = data.unique,
                    iconItem     = gameConfig.GameHarvestIcon,
                    isPremium    = data.isPremium,
                    type         = data.type
                });
            }

            ResetGridView();
        }

        public void LoadAllUserItemByTool()
        {
            inventoryItemsData.Clear();
            ResetGridView();
        }

        #endregion
    }

    [System.Serializable]
    public class InvenItemData
    {
        public string        key;
        public string        referenceKey;
        public int           quantity;
        public bool          isPremium;
        public bool          isUnique;
        public InventoryType type;
        public Sprite        iconItem;
    }
}