using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public static class UIExtentions
{

	/// <summary> Set alpha </summary>
	public static void SetAlpha (this Graphic g, float newAlpha)
	{
		var color = g.color;
		color.a = newAlpha;
		g.color = color;
	}

}
