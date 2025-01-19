using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public static class ArrayExtensions
{
	private static System.Random rng = new System.Random();

	public static IEnumerable<TSource> Shuffle<TSource>(this IEnumerable<TSource> list)
	{
		var result = list.ToList();
		int n = result.Count;
		while (n > 1)
		{
			n--;
			int k = rng.Next(n + 1);
			TSource value = result[k];
			result[k] = result[n];
			result[n] = value;
		}
		return result;
	}

	public static T GetSafe<T> (this T[] array, int index)
	{
		if (array == null || index < 0 || index > array.Length)
		{
			return default (T);
		}
		return array[index];
	}

	public static T RandomChoice<T> (this List<T> list)
	{
		if (list == null || list.Count == 0)
		{
			Debug.LogError ("List is null or empty");
			return default (T);
		}

		return list[UnityEngine.Random.Range (0, list.Count)];
	}

}
