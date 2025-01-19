using UnityEngine;
using System.Collections;
using System.Collections.Generic;

namespace Imba.Utils
{
	[AddComponentMenu("Imba/Utils/Global Data")]
	public class GlobalData : MonoBehaviour
	{
		private static Dictionary<string, GameObject> cache = new Dictionary<string, GameObject>();
		public static Dictionary<string, Texture> cacheAvatarFbId = new Dictionary<string, Texture>();

		// Use this for initialization
		void Awake()
		{
			DontDestroyOnLoad(gameObject);
			if (cache.ContainsKey(name))
			{
//			Debug.LogWarning("Object [" + name + "] exists. Destroy new one");
				Object.Destroy(this.gameObject);
			}
			else
				cache[name] = gameObject;
		}
	}

}