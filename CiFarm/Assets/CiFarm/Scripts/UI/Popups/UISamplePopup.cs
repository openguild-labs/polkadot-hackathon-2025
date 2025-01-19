using Imba.UI;
using TMPro;
using UnityEngine;

namespace CiFarm.Scripts.UI.Popups
{
    public class UISamplePopup : UIPopup
    {
        [SerializeField] private TextMeshProUGUI sampleTest;

        public void OnHidePopupClick()
        {
            //UIManager.Instance.PopupManager.ShowMessageDialog("Confirm", "Are you sure to buy this item?", UIMessageBox.MessageBoxType.Yes_No,
            UIManager.Instance.PopupManager.ShowMessageDialog("Shop Purchase", "Are you sure to buy this item?", UIMessageBox.MessageBoxType.Yes_No,
                (ret) =>
                {
                    if (ret == UIMessageBox.MessageBoxAction.Accept)
                    {
                        this.Hide();
                        return true;
                    }
                    else
                    {
                        return true;
                    }
                });
        }

        public void OnCancelClick()
        {
            this.Hide();
            //UIManager.Instance.PopupManager.ShowPopup(UIPopupName.UpgradeCar);
        }
        
        public void ClosePopup()
        {
            UIManager.Instance.PopupManager.HidePopup(UIPopupName.SamplePopup);
        }
    }
}
