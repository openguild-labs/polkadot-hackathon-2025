using UnityEngine;
using UnityEngine.Events;

namespace CiFarm.Scripts.UI.Popups.Shop
{
    public class ShopTab : MonoBehaviour
    {
        [SerializeField] private GameObject unselectedMask;
        
        public UnityEvent OnClickTab;

        public void SetSelect(bool isSelect = false)
        {
            unselectedMask.SetActive(!isSelect);
        }

        public void OnClick()
        {
            OnClickTab?.Invoke();
        }
    }
}