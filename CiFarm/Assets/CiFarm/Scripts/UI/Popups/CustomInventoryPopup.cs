using System.Collections.Generic;
using CiFarm.Scripts.Services;
using CiFarm.Scripts.Services.GameDatas;
using CiFarm.Scripts.Services.NakamaServices;
using CiFarm.Scripts.UI.Popups.Inventory;
using Imba.UI;
using SuperScrollView;
using TMPro;
using UnityEngine;
using UnityEngine.Events;

namespace CiFarm.Scripts.UI.Popups
{
    public class CustomInventoryPopupParam
    {
        public PlantingPopupType          PlantingPopupType;
        public UnityAction                CloseAction;
        public UnityAction<InvenItemData> PlantAction;
    }

    public enum PlantingPopupType
    {
        Planting,
        Selling,
    }

    public class CustomInventoryPopup : UIPopup
    {
        [SerializeField] private TextMeshProUGUI textHeader;
        [SerializeField] private LoopGridView loopGridView;
        [SerializeField] private GameObject   plantingTab;
        [SerializeField] private GameObject   sellingTab;

        public List<InvenItemData> inventoryItemsData;

        private UnityAction                _onClose;
        private UnityAction<InvenItemData> _callBackAction;

        private PlantingPopupType _type;

        protected override void OnInit()
        {
            base.OnInit();
            loopGridView.InitGridView(0, OnGetItemByIndex);
        }

        protected override void OnShowing()
        {
            base.OnShowing();
            var param = (CustomInventoryPopupParam)Parameter;
            _onClose        = param.CloseAction;
            _callBackAction = param.PlantAction;
            _type           = param.PlantingPopupType;

            switch (param.PlantingPopupType)
            {
                case PlantingPopupType.Planting:
                    plantingTab.SetActive(true);
                    sellingTab.SetActive(false);
                    LoadAllUserPlantItem();
                    break;
                case PlantingPopupType.Selling:
                    plantingTab.SetActive(false);
                    sellingTab.SetActive(true);
                    LoadAllUserProductItem();
                    break;
            }

            textHeader.text = param.PlantingPopupType.ToString();
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
            switch (_type)
            {
                case PlantingPopupType.Planting:
                    _callBackAction?.Invoke(data);
                    Hide();
                    break;
                case PlantingPopupType.Selling:
                    UIManager.Instance.PopupManager.ShowPopup(UIPopupName.ItemDetailPopup, new ItemDetailPopupParam
                    {
                        ItemId   = data.referenceKey,
                        Quantity = data.quantity,
                        IconItem = data.iconItem,
                        
                        CanSell  = true,
                        ConfirmCallBack = (quantity) =>
                        {
                            data.quantity = quantity;
                            _callBackAction?.Invoke(data);
                            Hide();
                        }
                    });
                    break;
            }
        }

        protected override void OnHiding()
        {
            base.OnHiding();
            _onClose?.Invoke();
        }

        #region NAKAMA

        public void LoadAllUserPlantItem()
        {
            inventoryItemsData.Clear();

            var rawData = NakamaUserService.Instance.inventories;
            if (rawData == null || rawData.Count == 0)
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
                    default:
                        continue;
                }

                inventoryItemsData.Add(new InvenItemData
                {
                    key          = data.key,
                    referenceKey = data.referenceKey,
                    quantity     = data.quantity,
                    isUnique     = data.unique,
                    isPremium    = data.isPremium,
                    iconItem     = gameConfig.GameShopIcon
                });
            }

            ResetGridView();
        }

        public void LoadAllUserProductItem()
        {
            inventoryItemsData.Clear();

            var rawData = NakamaUserService.Instance.inventories;
            if (rawData == null || rawData.Count == 0)
            {
                rawData = new();
            }

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
                    isPremium    = data.isPremium,
                    iconItem     = gameConfig.GameHarvestIcon
                });
            }

            ResetGridView();
        }

        #endregion
    }
}