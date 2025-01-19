
using System.Collections.Generic;
using UnityEngine;

public class CustomizeTabGroup : MonoBehaviour
{
    public List<CustomizeTabBtn> customizeTabBtns;
    public Sprite tabIdle;
    public Sprite tabActive;
    public CustomizeTabBtn selectedTab;
    public List<GameObject> subTab;
    

    public void Subscribe(CustomizeTabBtn button)
    {
        if(customizeTabBtns == null)
        {
            customizeTabBtns = new List<CustomizeTabBtn>();
        }
        customizeTabBtns.Add(button);
    }

    public void OnTabExit(CustomizeTabBtn button)
    {
        ResetTabs();
        
        if (selectedTab == null || button != selectedTab)
        {
            button.background.sprite = tabIdle;
            
        }
    }

    public void OnTabSelected(CustomizeTabBtn button)
    {
        if (selectedTab != null)
        {
            selectedTab.Deselect();
        }
        
        selectedTab = button;
        selectedTab.Select();
        ResetTabs();
        button.background.sprite = tabActive;
        int index = button.transform.GetSiblingIndex();
        for(int i=0;i<subTab.Count; i++)
        {
            if (i == index)
            {
                subTab[i].GetComponent<Canvas>().enabled = true;
            }
            else
            {
                subTab[i].GetComponent<Canvas>().enabled = false;
            }
        }
    }

    public void ResetTabs()
    {
        foreach(CustomizeTabBtn button in customizeTabBtns)
        {
            if(selectedTab != null && button == selectedTab) { continue; }
            button.background.sprite = tabIdle;
        }
    }
}
