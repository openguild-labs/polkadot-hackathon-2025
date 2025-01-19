using UnityEngine;
using UnityEngine.Events;

namespace CiFarm.Scripts.UI.Popups.Inventory
{
    public class InventoryTab : MonoBehaviour
    {
        [SerializeField] private GameObject unselectedMask;

        public UnityEvent<InventoryTab> OnClickTab;

        public void SetSelect(bool isSelect = false)
        {
            unselectedMask.SetActive(!isSelect);
        }

        public void OnClick()
        {
            OnClickTab?.Invoke(this);
        }
    }
}