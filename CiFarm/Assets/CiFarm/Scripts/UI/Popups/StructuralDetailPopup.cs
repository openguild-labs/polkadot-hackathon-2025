using System.Collections.Generic;
using System.Linq;
using CiFarm.Scripts.Services;
using CiFarm.Scripts.Services.NakamaServices;
using CiFarm.Scripts.Services.NakamaServices.BaseServices;
using CiFarm.Scripts.UI.Popups.Structural;
using CiFarm.Scripts.Utilities;
using Imba.UI;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace CiFarm.Scripts.UI.Popups
{
    public class StructuralDetailParam
    {
        public string StructuralId;
        public string ReferenceId;
    }

    public class StructuralDetailPopup : UIPopup
    {
        public string structuralId;
        public string referenceId;

        [SerializeField] private TextMeshProUGUI structuralName;
        [SerializeField] private Image structuralImage;

        [SerializeField] private List<AnimalItem> listAnimalItem;

        protected override void OnShowing()
        {
            base.OnShowing();
            if (Parameter != null)
            {
                var param = (StructuralDetailParam)Parameter;
                structuralId = param.StructuralId;
                referenceId  = param.ReferenceId;
            }

            var gameConfig = ResourceService.Instance.ModelGameObjectConfig.GetTile(referenceId);
            var detail     = ResourceService.Instance.ItemDetailConfig.GetItemDetail(referenceId);
            structuralImage.sprite = gameConfig!.GameShopIcon;
            structuralName.text    = detail!.ItemName;
            LoadAnimal();
        }

        public void LoadAnimal()
        {
            var animalInThisStructural = NakamaSocketService.Instance.placedItems.Where(o =>
                o.type == PlacedItemType.Animal &&
                o.parentPlacedItemKey == structuralId).ToList();
            for (int i = 0; i < listAnimalItem.Count; i++)
            {
                if (i < animalInThisStructural.Count)
                {
                    var animal = animalInThisStructural[i];
                    var sprite = ResourceService.Instance.ModelGameObjectConfig.GetAnimal(animal.referenceKey);
                    listAnimalItem[i].SetAnimal(false,
                        spineModel: animal.animalInfo.isAdult
                            ? sprite.AnimalBigSpineUIModel
                            : sprite.AnimalMiniSpineUIModel,
                        onClickAnimalAction: () => { OnClickAnimalDetail(animal.key); }
                    );
                }
                else
                {
                    listAnimalItem[i].SetEmpty();
                }
            }
        }

        private void OnClickAnimalDetail(string placedItemsId)
        {
            Hide(true);
            UIManager.Instance.PopupManager.ShowPopup(UIPopupName.AnimalDetailPopup, new AnimalDetailPopupParam
            {
                tileId      = placedItemsId,

            });
        }

        public void OnClickAddAnimal()
        {
            Hide(true);
            UIManager.Instance.PopupManager.ShowPopup(UIPopupName.ShopPopup, new ShopPopupParam
            {
                TabToOpen  = ShopType.Animal,
                BuildingId = structuralId,
                HideOther  = true,
            });
        }
    }
}