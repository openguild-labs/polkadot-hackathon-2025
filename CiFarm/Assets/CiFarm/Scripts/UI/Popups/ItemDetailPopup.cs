using System.Collections.Generic;
using CiFarm.Scripts.Services;
using Imba.UI;
using TMPro;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.UI;

namespace CiFarm.Scripts.UI.Popups
{
    public class ItemDetailPopupParam
    {
        public string           ItemId;
        public int              Quantity;
        public bool             CanSell;
        public bool             CanPlace;
        public Sprite           IconItem;
        public UnityAction<int> ConfirmCallBack;
    }

    public class ItemDetailPopup : UIPopup
    {
        [Header("Changing popup")]
        [SerializeField] private List<GameObject> detailGroup;

        [SerializeField] private List<GameObject> sellingGroup;
        [SerializeField] private List<GameObject> placingGroup;

        [Header("Customize popup")]
        [SerializeField] private Image itemIcon;

        [SerializeField] private TextMeshProUGUI textItemName;
        [SerializeField] private TextMeshProUGUI textItemPrice;
        [SerializeField] private TextMeshProUGUI textItemDetail;
        [SerializeField] private TMP_InputField  textItemCounter;
        [SerializeField] private TextMeshProUGUI textTotalValue;

        public int counter = 1;
        public int basePrice;

        private UnityAction<int> _onConfirm;

        private int    _quantity;
        private bool   _canSell;
        private bool   _canPlace;
        private string _itemId;

        protected override void OnInit()
        {
            base.OnInit();
            textItemCounter.onValueChanged.AddListener(CustomEditValidate);
        }

        protected override void OnShowing()
        {
            base.OnShowing();
            counter = 1;
            if (Parameter != null)
            {
                var param = (ItemDetailPopupParam)Parameter;
                itemIcon.sprite = param.IconItem;
                _itemId         = param.ItemId;
                _quantity       = param.Quantity;
                _onConfirm      = param.ConfirmCallBack;
                _canSell        = param.CanSell;
                _canPlace       = param.CanPlace;
            }


            foreach (var o in detailGroup)
            {
                o.SetActive(!_canSell && !_canPlace);
            }

            foreach (var o in sellingGroup)
            {
                o.SetActive(_canSell);
            }

            foreach (var o in placingGroup)
            {
                o.SetActive(_canPlace);
            }


            var config = ResourceService.Instance.ItemDetailConfig.GetItemDetail(_itemId);
            textItemDetail.text = config.ItemDescription;
            textItemName.text   = config.ItemName;

            UpdateCounter();
        }

        protected override void OnHiding()
        {
            base.OnHiding();
        }

        public void UpdateCounter()
        {
            textItemCounter.text = counter.ToString();
            textTotalValue.text  = "For: " + (basePrice * counter);
        }

        public void OnClickRight()
        {
            var temp = int.Parse(textItemCounter.text);
            if (temp != counter)
            {
                counter = temp;
            }

            counter++;
            if (counter > _quantity)
            {
                counter = _quantity;
            }

            UpdateCounter();
        }

        public void OnClickLeft()
        {
            var temp = int.Parse(textItemCounter.text);
            if (temp != counter)
            {
                counter = temp;
            }

            counter--;
            if (counter <= 0)
            {
                counter = 1;
            }

            UpdateCounter();
        }

        public void CustomEditValidate(string input)
        {
            if (int.TryParse(input, out var temp))
            {
                if (temp <= 0)
                {
                    temp = 1;
                }

                if (temp > _quantity)
                {
                    temp = _quantity;
                }

                counter = temp;

                textItemCounter.text = counter.ToString();
            }
        }

        public void OnClickSell()
        {
            _onConfirm?.Invoke(counter);
            Hide(true);
        }

        public void OnClickPlace()
        {
            _onConfirm?.Invoke(counter);
            Hide(true);
        }
    }
}