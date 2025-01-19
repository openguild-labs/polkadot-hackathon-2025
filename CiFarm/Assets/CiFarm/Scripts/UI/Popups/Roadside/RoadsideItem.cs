using TMPro;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.UI;

namespace CiFarm.Scripts.UI.Popups.Roadside
{
    public class RoadsideItem : MonoBehaviour
    {
        [SerializeField] private TextMeshProUGUI textQuantity;
        [SerializeField] private GameObject      plusButtonGroup;
        [SerializeField] private GameObject      productGroup;
        [SerializeField] private GameObject      premium;
        [SerializeField] private Image           productRender;

        private UnityAction _onClickAdd;
        private UnityAction _onClickRemove;

        public void InitCallback(UnityAction onClickAdd, UnityAction onClickRemove)
        {
            _onClickAdd    = onClickAdd;
            _onClickRemove = onClickRemove;
        }

        public void SetProductOnSale(Sprite sprite = null, int quantity = 0, bool isPremium = false)
        {
            if (sprite != null && quantity != 0)
            {
                productGroup.SetActive(true);
                plusButtonGroup.SetActive(false);
                productRender.sprite = sprite;
                textQuantity.text    = quantity.ToString();
            }
            else
            {
                productGroup.SetActive(false);
                plusButtonGroup.SetActive(true);
                textQuantity.text = "";
            }
            premium.SetActive(isPremium);
        }

        public void OnClickAdd()
        {
            _onClickAdd?.Invoke();
        }

        public void OnClickRemove()
        {
            _onClickRemove?.Invoke();
        }
    }
}