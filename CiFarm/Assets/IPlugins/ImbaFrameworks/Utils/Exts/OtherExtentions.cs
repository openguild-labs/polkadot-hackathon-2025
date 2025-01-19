using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;

public static class OtherExtentions
{

    public static void SetActive(this Component obj, bool value)
    {
        obj.gameObject.SetActive(value);
    }

    public static void SetParent(this GameObject obj, Transform parent)
    {
        obj.transform.SetParent(parent);
    }

    public static void SetLayerRecursively(this GameObject obj, int layer)
    {
        obj.layer = layer;

        for (int i = 0; i < obj.transform.childCount; i++)
        {
            SetLayerRecursively(obj.transform.GetChild(i).gameObject, layer);
        }
    }
}