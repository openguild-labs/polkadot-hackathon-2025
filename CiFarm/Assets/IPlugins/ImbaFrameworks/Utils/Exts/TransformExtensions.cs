using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public static class TransformExtensions
{

	public static T GetSafe<T> (this T[] array, int index)
	{
		if (array == null || index < 0 || index > array.Length)
		{
			return default (T);
		}
		return array[index];
	}

	public static void SetGlobalX (this Transform transform, float x)
	{
		var pos = transform.position;
		pos.x = x;
		transform.position = pos;
	}

	public static void SetGlobalY (this Transform transform, float y)
	{
		var pos = transform.position;
		pos.y = y;
		transform.position = pos;
	}

	public static void SetGlobalZ (this Transform transform, float z)
	{
		var pos = transform.position;
		pos.z = z;
		transform.position = pos;
	}

	public static void SetLocalX (this Transform transform, float x)
	{
		var pos = transform.localPosition;
		pos.x = x;
		transform.localPosition = pos;
	}

	public static void SetLocalY (this Transform transform, float y)
	{
		var pos = transform.localPosition;
		pos.y = y;
		transform.localPosition = pos;
	}

	public static void SetLocalZ (this Transform transform, float z)
	{
		var pos = transform.localPosition;
		pos.z = z;
		transform.localPosition = pos;
	}

	public static void SetAnchoredX (this RectTransform transform, float x)
	{
		var pos = transform.anchoredPosition;
		pos.x = x;
		transform.anchoredPosition = pos;
	}

	public static void SetAnchoredY (this RectTransform transform, float y)
	{
		var pos = transform.anchoredPosition;
		pos.y = y;
		transform.anchoredPosition = pos;
	}

	public static void SetAnchoredZ (this RectTransform transform, float z)
	{
		var pos = transform.anchoredPosition3D;
		pos.z = z;
		transform.anchoredPosition3D = pos;
	}

    public static bool CheckParent (this Transform tr, Transform parent)
    {
        while (tr.parent != null)
        {
            if (tr.parent == parent)
            {
                return true;
            }
            tr = tr.parent;
        }

        return false;
    }

	//Returns the topmost parent of a Transform with a certain component
	public static T GetTopmostParentComponent<T> (this Transform tr) where T : Component
	{
		T getting = null;

		while (tr.parent != null)
		{
			if (tr.parent.GetComponent<T> () != null)
			{
				getting = tr.parent.GetComponent<T> ();
			}

			tr = tr.parent;
		}

		return getting;
	}
}
