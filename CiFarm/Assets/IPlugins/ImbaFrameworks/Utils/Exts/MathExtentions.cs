using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public static class MathExtentions
{
	public static int Repeat (int value, int minValue, int maxValue)
	{
		while (value < minValue || value > maxValue)
		{
			if (value < minValue)
			{
				value += maxValue - minValue + 1;
			}
			else if (value > maxValue)
			{
				value -= maxValue - minValue + 1;
			}
		}
		return value;
	}

	public static float Repeat (float value, float minValue, float maxValue)
	{
		while (value < minValue || value >= maxValue)
		{
			if (value < minValue)
			{
				value += maxValue - minValue;
			}
			else if (value >= maxValue)
			{
				value -= maxValue - minValue;
			}
		}
		return value;
	}

	public static float Abs (this float value)
	{
		return Mathf.Abs (value);
	}

	public static int Abs (this int value)
	{
		return Mathf.Abs (value);
	}

	public static float Clamp (this float value)
	{
		return Mathf.Clamp01 (value);
	}

	public static float Clamp (this float value, float minValue, float maxValue)
	{
		return Mathf.Clamp (value, minValue, maxValue);
	}

	public static float AbsClamp (this float value)
	{
		return value.Abs ().Clamp ();
	}

	public static float AbsClamp (this float value, float minValue, float maxValue)
	{
		return value.Abs ().Clamp (minValue, maxValue);
	}

	public static int ToInt (this float value)
	{
		return Mathf.RoundToInt (value);
	}

	public static byte ToByte01 (this float value)
	{
		return (byte)(value.Clamp(-1, 1) * 128 + 128);
	}

	public static float ToFloat01 (this byte value)
	{
		return ((float)value - 128f) * 0.0078125f;
	}
}
