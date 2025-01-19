using TMPro;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.UI;

namespace CiFarm.Scripts.UI.Popups.Inventory
{
    public class InventoryItem : MonoBehaviour
    {
        [SerializeField] private Image           itemIcon;
        [SerializeField] private TextMeshProUGUI quantity;
        [SerializeField] private GameObject      premium;

        private InvenItemData              invenItemData;
        private UnityAction<InvenItemData> onClick;

        public void InitData(InvenItemData data, UnityAction<InvenItemData> callBack)
        {
            gameObject.name = data.referenceKey + "Item";
            invenItemData   = data;
            onClick         = callBack;
            itemIcon.sprite = data.iconItem;
            quantity.text   = data.quantity.ToString();
            if (data.isUnique)
            {
                quantity.text = "1";
                
            }
            premium.SetActive(data.isPremium || data.isUnique);
        }

        public void OnClick()
        {
            onClick?.Invoke(invenItemData);
        }
    }
}