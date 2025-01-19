using System.Collections;
using System.Collections.Generic;
using UnityEngine;


public static class MaskExtentions
{

	/// <summary> Checking whether the layer belongs to the current mask </summary>
	/// <returns> Return true if lauer in mask</returns>
	public static bool LayerInMask (this LayerMask mask, int layer)
	{
		return ((mask.value & (1 << layer)) != 0);
	}

}
