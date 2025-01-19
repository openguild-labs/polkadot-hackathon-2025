using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;
using UnityEngine.UI;
using UnityEngine.EventSystems;
using UnityEngine.Events;

[RequireComponent(typeof(Image))]
public class CustomizeTabBtn : MonoBehaviour, IPointerClickHandler, IPointerExitHandler
{
    public CustomizeTabGroup customizeTabGroup;
    public Image background;

    public UnityEvent OnTabSelected;
    public UnityEvent OnTabDeselected;

    void Start()
    {
        background = GetComponent<Image>();
        customizeTabGroup.Subscribe(this);
    }
    public void OnPointerClick(PointerEventData eventData)
    {
        customizeTabGroup.OnTabSelected(this);
    }

    public void OnPointerExit(PointerEventData eventData)
    {
        customizeTabGroup.OnTabExit(this);
    }

    public void Select()
    {
        if (OnTabSelected != null)
        {
            OnTabSelected.Invoke();
        }
    }

    public void Deselect()
    {
        if (OnTabDeselected != null)
        {
            OnTabDeselected.Invoke();
        }
    }
}
