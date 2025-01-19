using System.Collections;
using System.Collections.Generic;
using UnityEngine;

using Imba.UI;

public class UIBasicSample : MonoBehaviour
{
    public void OnOpenPopupClick()
    {
        Debug.Log("Click open popup");
        UIManager.Instance.PopupManager.ShowPopup(UIPopupName.SamplePopup);
    }
    
    public void OnShowLoadingClick()
    {
        Debug.Log("Click Show Loading");
        UIManager.Instance.ShowLoading(2f);
    }
    
    public void OnShowAlertClick()
    {
        Debug.Log("Click Show Alert");
        UIManager.Instance.AlertManager.ShowAlertMessage("Fire in the hole!", AlertType.Error);
    }
}
