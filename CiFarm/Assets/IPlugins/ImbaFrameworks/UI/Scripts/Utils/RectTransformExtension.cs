using UnityEngine;

public static class RectTransformExtensions
{
	public static void SetDefaultScale (this RectTransform trans)
	{
		trans.localScale = Vector3.zero;
	}

	public static void SetPivotAndAnchors (this RectTransform trans, Vector2 aVec)
	{
		trans.pivot = aVec;
		trans.anchorMin = aVec;
		trans.anchorMax = aVec;
	}
	
	public static Vector2 GetSize (this RectTransform trans)
	{
		return trans.rect.size;
	}

	public static float GetWidth (this RectTransform trans)
	{
		return trans.rect.width;
	}

	public static float GetHeight (this RectTransform trans)
	{
		return trans.rect.height;
	}
	
	public static void SetPositionOfPivot (this RectTransform trans, Vector2 newPos)
	{
		trans.localPosition = new Vector3 (newPos.x, newPos.y, trans.localPosition.z);
	}
	
	public static void SetLeftBottomPosition (this RectTransform trans, Vector2 newPos)
	{
		trans.localPosition = new Vector3 (newPos.x + (trans.pivot.x * trans.rect.width), newPos.y + (trans.pivot.y * trans.rect.height), trans.localPosition.z);
	}

	public static void SetLeftTopPosition (this RectTransform trans, Vector2 newPos)
	{
		trans.localPosition = new Vector3 (newPos.x + (trans.pivot.x * trans.rect.width), newPos.y - ((1f - trans.pivot.y) * trans.rect.height), trans.localPosition.z);
	}

	public static void SetRightBottomPosition (this RectTransform trans, Vector2 newPos)
	{
		trans.localPosition = new Vector3 (newPos.x - ((1f - trans.pivot.x) * trans.rect.width), newPos.y + (trans.pivot.y * trans.rect.height), trans.localPosition.z);
	}

	public static void SetRightTopPosition (this RectTransform trans, Vector2 newPos)
	{
		trans.localPosition = new Vector3 (newPos.x - ((1f - trans.pivot.x) * trans.rect.width), newPos.y - ((1f - trans.pivot.y) * trans.rect.height), trans.localPosition.z);
	}

	public static RectTransform AsRectTransform (this GameObject go)
	{
		if (go)
			return AsRectTransform (go.transform);
		return null;
	}

	public static RectTransform AsRectTransform (this Transform trans)
	{
		return trans as RectTransform;
	}
	
	public static void SetSize (this RectTransform trans, Vector2 newSize)
	{
		Vector2 oldSize = trans.rect.size;
		Vector2 deltaSize = newSize - oldSize;
		trans.offsetMin = trans.offsetMin - new Vector2 (deltaSize.x * trans.pivot.x, deltaSize.y * trans.pivot.y);
		trans.offsetMax = trans.offsetMax + new Vector2 (deltaSize.x * (1f - trans.pivot.x), deltaSize.y * (1f - trans.pivot.y));
	}

	public static void SetWidth (this RectTransform trans, float newSize)
	{
		SetSize (trans, new Vector2 (newSize, trans.rect.size.y));
	}

	public static void SetHeight (this RectTransform trans, float newSize)
	{
		SetSize (trans, new Vector2 (trans.rect.size.x, newSize));
	}
	
	/// <summary> Copies the RectTransform settings </summary>
	/// <param name="target"> Target RectTransform </param>
	/// <param name="from"> Source RectTransform </param>
	public static void Copy(this RectTransform target, RectTransform from)
	{
		target.localScale = from.localScale;
		target.anchorMin = from.anchorMin;
		target.anchorMax = from.anchorMax;
		target.pivot = from.pivot;
		target.sizeDelta = from.sizeDelta;
		target.anchoredPosition3D = from.anchoredPosition3D;
	}
	
	/// <summary> Makes the RectTransform match its parent size </summary>
	/// <param name="target"> Target RectTransform </param>
	/// <param name="resetScaleToOne"> Reset LocalScale to Vector3.one </param>
	public static void FullScreen(this RectTransform target, bool resetScaleToOne)
	{
		if(resetScaleToOne) target.ResetLocalScaleToOne();
		target.AnchorMinToZero();
		target.AnchorMaxToOne();
		target.CenterPivot();
		target.SizeDeltaToZero();
		target.ResetAnchoredPosition3D();
		target.ResetLocalPosition();
	}

	/// <summary> Moves the RectTransform pivot settings to its center </summary>
	/// <param name="target"> Target RectTransform </param>
	/// <param name="resetScaleToOne"> Reset LocalScale to Vector3.one </param>
	public static void Center(this RectTransform target, bool resetScaleToOne)
	{
		if(resetScaleToOne) target.ResetLocalScaleToOne();
		target.AnchorMinToCenter();
		target.AnchorMaxToCenter();
		target.CenterPivot();
		target.SizeDeltaToZero();
	}
	
	/// <summary> Resets the target's anchoredPosition3D to Vector3.zero </summary>
	/// <param name="target"> Target RectTransform </param>
	public static void ResetAnchoredPosition3D(this RectTransform target) { target.anchoredPosition3D = Vector3.zero;}

	/// <summary> Resets the target's localPosition to Vector3.zero </summary>
	/// <param name="target"> Target RectTransform </param>
	public static void ResetLocalPosition(this RectTransform target) {target.localPosition = Vector3.zero; }
	
	/// <summary> Resets the target's localScale to Vector3.one </summary>
	/// <param name="target"> Target RectTransform </param>
	public static void ResetLocalScaleToOne(this RectTransform target) { target.localScale = Vector3.one; }
	
	/// <summary> Resets the target's anchorMin to Vector2.zero </summary>
	/// <param name="target"> Target RectTransform </param>
	public static void AnchorMinToZero(this RectTransform target) { target.anchorMin = Vector2.zero; }
	
	/// <summary> Sets the target's anchorMin to Vector2(0.5f, 0.5f) </summary>
	/// <param name="target"> Target RectTransform </param>
	public static void AnchorMinToCenter(this RectTransform target) { target.anchorMin =  new Vector2(0.5f, 0.5f); }
	
	/// <summary> Resets the target's anchorMax to Vector2.one </summary>
	/// <param name="target"> Target RectTransform </param>
	public static void AnchorMaxToOne(this RectTransform target) {  target.anchorMax = Vector2.one;}
	
	/// <summary> Sets the target's anchorMax to Vector2(0.5f, 0.5f) </summary>
	/// <param name="target"> Target RectTransform </param>
	public static void AnchorMaxToCenter(this RectTransform target) {  target.anchorMax =  new Vector2(0.5f, 0.5f);}
	
	/// <summary> Sets the target's pivot to Vector2(0.5f, 0.5f) </summary>
	/// <param name="target"> Target RectTransform </param>
	public static void CenterPivot(this RectTransform target) { target.pivot = new Vector2(0.5f, 0.5f); }
	
	/// <summary> Resets the target's sizeDelta to Vector2.zero </summary>
	/// <param name="target"> Target RectTransform </param>
	public static void SizeDeltaToZero(this RectTransform target) {target.sizeDelta = Vector2.zero;}
}