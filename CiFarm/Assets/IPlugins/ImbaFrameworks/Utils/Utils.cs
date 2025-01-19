using UnityEngine;
using UnityEngine.Rendering;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Net;
using System.IO;
using System.Runtime.Serialization.Formatters.Binary;

namespace Imba.Utils
{
	public static class Utils
	{
		public static TEnum ToEnum<TEnum>(this string strEnumValue, TEnum defaultValue)
		{
			if (!Enum.IsDefined(typeof(TEnum), strEnumValue))
			{
				Debug.LogWarning("Not defined enum: " + strEnumValue);
				return defaultValue;
			}

			return (TEnum) Enum.Parse(typeof(TEnum), strEnumValue);
		}

		public static bool CheckNetSGUtilsworkConnection(string resource)
		{
			HttpWebRequest req = (HttpWebRequest) WebRequest.Create(resource);
			try
			{
				using (HttpWebResponse resp = (HttpWebResponse) req.GetResponse())
				{
					return ((int) resp.StatusCode < 299 && (int) resp.StatusCode >= 200);
				}
			}
			catch
			{
			}
			return false;
		}

		#region Datetime Helper

		private static readonly DateTime UnixEpoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);

		public static DateTime ConvertMilsecToDateTime(long milsec)
		{
			return (UnixEpoch + TimeSpan.FromMilliseconds(milsec)).AddHours(7);
		}

		public static long ConvertDateTimeTo(DateTime date)
		{
			DateTime UnixEpoch = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
			return (long) ((date - UnixEpoch).TotalMilliseconds);
		}

		public static TimeSpan GetTimeSpanFromNowByMilsec(long milsec)
		{
			DateTime curDT = ConvertMilsecToDateTime(milsec);
			DateTime nowDT = DateTime.UtcNow.AddHours(7);
			TimeSpan ts = (curDT - nowDT);
			return ts;
		}

		public static int ConvertToUnixTimestampInDay(DateTime date)
		{
			var timeInSec = ConvertToUnixTimestamp(date);
			return (int) (timeInSec / (60 * 60 * 24));
		}

		public static DateTime ConvertFromUnixTimestamp(double timestamp)
		{
			DateTime origin = new DateTime(1970, 1, 1, 0, 0, 0, 0);
			return origin.AddSeconds(timestamp);
		}

		public static DateTime ConvertFromString(string stringDate, string format)
		{

			try
			{
				DateTime dt = DateTime.ParseExact(stringDate, format, null);
				return dt;
			}
			catch (System.Exception e)
			{
				Debug.LogError("cannot parse birthday " + stringDate + "-" + format + ": " + e);
			}

			return new DateTime(1990, 5, 3);
		}

		public static double ConvertToUnixTimestamp(DateTime date)
		{
			DateTime origin = new DateTime(1970, 1, 1, 0, 0, 0, 0);
			TimeSpan diff = date.ToUniversalTime() - origin;
			return Math.Floor(diff.TotalSeconds);
		}

		public static string GetStringTimeByTotalMinutes(int totalMinutes)
		{
			int h = totalMinutes / 60; //value = minutes
			int d = h / 24;

			if (d > 0)
				return (d + "d");
			if (h > 0)
				return (h + "h");
			return (totalMinutes > 0) ? (totalMinutes + "min(s)") : "--";
		}

		public static string GetStringTimeByTotalSeconds(int totalSeconds)
		{
			int h = totalSeconds / 60 / 60; //value = minutes
			int m = (totalSeconds - (h * 60 * 60)) / 60;
			int s = totalSeconds - (h * 60 * 60) - (m * 60);

			string sHour = (h < 10) ? "0" + h : h.ToString();
			string sMin = (m < 10) ? "0" + m : m.ToString();
			string sSec = (s < 10) ? "0" + s : s.ToString();

			return (sHour + ":" + sMin + ":" + sSec);
		}

		#endregion

		#region Color Helper

		public static Color HexToColor(string hex, byte alpha = 255)
		{
			if (hex.Length == 7)
			{
				hex = hex.Substring(1, 6);
			}

			if (hex.Length < 6)
				hex = hex.PadLeft(6, '0');

			byte r = byte.Parse(hex.Substring(0, 2), System.Globalization.NumberStyles.HexNumber);
			byte g = byte.Parse(hex.Substring(2, 2), System.Globalization.NumberStyles.HexNumber);
			byte b = byte.Parse(hex.Substring(4, 2), System.Globalization.NumberStyles.HexNumber);
			return new Color32(r, g, b, alpha);
		}

		public static string ColorToHex(Color32 color)
		{
			return "#" + (color.r).ToString("X2") + (color.g).ToString("X2") + (color.b).ToString("X2");
		}

		public static int HexToInt(string hex)
		{
			if (hex.Length == 7)
			{
				hex = hex.Substring(1, 6);
			}

			return int.Parse(hex, System.Globalization.NumberStyles.HexNumber);
		}

		public static Color IntToColor(int colorValue)
		{
			string hex = "#" + colorValue.ToString("X6");

			return HexToColor(hex);
		}

		public static int ColorToInt(Color color)
		{
			string hex = ColorToHex(color);
			return HexToInt(hex);
		}

		#endregion

		#region Check Rarity
		public static string RarityParse(int _num)
		{

			string _rarity = "Common";
			switch (_num) {
				case 1: _rarity = "Rare";
					break;
				case 2: _rarity = "Epic";
					break;
				case 3: _rarity = "Legendary";
					break;
			}
			return _rarity;

		}
        #endregion

        #region Check Item Type
        public static string ItemTypeParse(int _num)
        {
            string _type = "Projectile";
            switch (_num)
            {
                case 1: _type = "Trap";
                    break;
                case 2: _type = "PowerUp";
                    break;
                case 3: _type = "GlobalEffect";
                    break;
            }
            return _type;
        }
        #endregion

        public delegate bool BubbleSortCompare<T>(T a, T b);

		public static void BubbleSort<T>(List<T> list, BubbleSortCompare<T> compare)
		{
			if (list == null)
				return;
			for (int i = list.Count - 1; i > 0; i--)
			{
				for (int j = 0; j <= i - 1; j++)
				{
					if (compare(list[i], list[j]))
					{
						var highValue = list[i];

						list[i] = list[j];
						list[j] = highValue;
					}
				}
			}
		}

		/// <summary>
		/// Clears all child of parent tranform
		/// </summary>
		/// <param name="parent">Parent.</param>
		public static void ClearAllChild(Transform parent)
		{
			var children = new List<GameObject>();

			foreach (Transform child in parent)
				children.Add(child.gameObject);

			parent.DetachChildren();

			if (Application.isEditor)
			{
				children.ForEach(child => GameObject.DestroyImmediate(child));
			}
			else
			{
				children.ForEach(child => GameObject.Destroy(child));
			}

			Resources.UnloadUnusedAssets(); //giam mem sau khi destroy list
		}

		/// <summary>
		/// Sets the active all child.
		/// </summary>
		/// <param name="parent">Parent.</param>
		/// <param name="active">If set to <c>true</c> active.</param>
		public static void SetActiveAllChild(GameObject parent, bool active)
		{
//		Debug.LogWarning("SetActiveAllChild " + parent.name + ":" + active);
			foreach (Transform child in parent.transform)
			{
				//	Debug.LogWarning("child " + child.name + ":" + active);
				child.gameObject.SetActive(active);
			}
		}

		public static GameObject AddChild(GameObject parent, string name = "NewGO")
		{
			GameObject c = new GameObject();
			c.name = name;
			c.transform.SetParent(parent.transform);
			c.transform.localPosition = Vector3.zero;
			c.transform.localScale = Vector3.one;
			c.transform.localEulerAngles = Vector3.zero;

			return c;
		}


		public static T CreateUIItem<T>(GameObject prefab, Transform parent) where T : MonoBehaviour
		{
			if (prefab != null)
			{
				GameObject go = GameObject.Instantiate(prefab) as GameObject;
				go.transform.SetParent(parent);
				go.transform.localScale = Vector3.one;
				go.transform.localRotation = Quaternion.identity;
				return go.GetComponent<T>();
			}
			return null;
		}



		public static T InstantiateObject<T>(T prefab, Transform parent) where T : Component
		{
			if (prefab != null)
			{
				T go = GameObject.Instantiate<T>(prefab) as T;
				go.transform.SetParent(parent);
				go.transform.localScale = Vector3.one;
				go.transform.localRotation = Quaternion.identity;
				go.transform.localPosition = Vector3.zero;
				return go;
			}
			return null;
		}

		public static T InstantiateUI<T>(T prefab, Transform parent) where T : MonoBehaviour
		{
			if (prefab != null)
			{
				T go = GameObject.Instantiate<T>(prefab) as T;
				go.transform.SetParent(parent);
				go.transform.localScale = Vector3.one;
				go.transform.localRotation = Quaternion.identity;
				go.GetComponent<RectTransform>().anchoredPosition = Vector2.zero;
				return go;
			}
			return null;
		}


		public static Component FindComponentInParent(Transform child, Type type)
		{
			Transform p = child.parent;
			if (p == null)
			{
				return null;
			}

			if (p.GetComponent(type) != null)
				return p.GetComponent(type);

			return FindComponentInParent(p, type);
		}



		public static Texture LoadTexture(string path)
		{
			//Debug.Log("LoadTexture from resources" + path);
			try
			{
				return Resources.Load(path, typeof(Texture)) as Texture;
			}
			catch (Exception e)
			{
				Debug.LogError("Cannot load texture " + path + "with error " + e.Message);
			}
			return null;
		}

		public static TextAsset LoadTextAsset(string path)
		{
			//Debug.Log("LoadTextAsset " + path);
			try
			{
				return Resources.Load(path, typeof(TextAsset)) as TextAsset;
			}
			catch (Exception e)
			{
				Debug.LogError("Cannot load text asset " + path + "with error " + e.Message);
			}
			return null;
		}

		public static IEnumerator LoadPrefabAsync<T>(string path, System.Action<T> cb) where T : Component
		{
			var request = Resources.LoadAsync<T>(path);
			yield return request;
			if (request.asset != null)
			{
				T prefab = request.asset as T;
				cb(prefab);
			}
			else
				cb(null);
		}

		public static GameObject LoadPrefab(string path)
		{
			try
			{
				GameObject ret = Resources.Load(path, typeof(GameObject)) as GameObject;
				if (ret == null)
					Debug.LogError("Cannot load prefab " + path);
				return ret;
			}
			catch (Exception e)
			{
				Debug.LogError("Cannot load prefab " + path + "with error " + e.Message);
			}
			return null;
		}

		public static GameObject LoadGameObject(string path)
		{
			return LoadGameObject(null, path);
		}

		public static GameObject LoadGameObject(GameObject prefab)
		{
			return LoadGameObject(null, prefab);
		}

		public static GameObject LoadGameObject(Transform parent, string path)
		{
			GameObject prefab = LoadPrefab(path);
			if (prefab == null) return null;

			GameObject go = (GameObject) GameObject.Instantiate(prefab, Vector3.zero, Quaternion.identity);
            go.transform.SetParent(parent.transform);
            go.transform.localPosition = Vector3.zero;
			go.transform.localRotation = Quaternion.identity;
			go.transform.localScale = Vector3.one;

			return go;

		}

		public static GameObject LoadGameObject(Transform parent, GameObject prefab)
		{
			if (prefab == null) return null;

			GameObject go = GameObject.Instantiate(prefab, Vector3.zero, Quaternion.identity) as GameObject;
            go.transform.SetParent(parent.transform);
			go.transform.localPosition = Vector3.zero;
			go.transform.localRotation = Quaternion.identity;
			go.transform.localScale = Vector3.one;
			//Debug.LogError(go.name);
			return go;

		}

//    public static void SetLayerRecursively(GameObject go, int layer)
//    {
//        go.layer = layer;
//        int count = go.transform.childCount;
//        for(int i = 0; i < count; i++)
//        {
//            SetLayerRecursively(go.transform.GetChild(i).gameObject, layer);
//        }        
//    }



#if UNITY_EDITOR
    public static GameObject LoadPrefabInAsset(Transform parent, string name)
    {
        GameObject prefab = UnityEditor.AssetDatabase.LoadAssetAtPath(name, typeof(GameObject)) as GameObject;
		if(prefab == null)
		{
#if UNITY_EDITOR
			Debug.LogError("Cannot load asset at path " + name);
#endif
			return null;
		}
        GameObject go = (GameObject) GameObject.Instantiate(prefab, Vector3.zero, Quaternion.identity);
        go.transform.SetParent(parent.transform);
        go.transform.localPosition = Vector3.zero;
        go.transform.localRotation = Quaternion.identity;
        go.transform.localScale = Vector3.one;
        return go;
    }

    public static Sprite LoadSpriteInAsset(string path)
    {
        Debug.Log(path);
        Sprite tex = UnityEditor.AssetDatabase.LoadAssetAtPath<Sprite>(path);
#if UNITY_EDITOR
        if(tex == null)
            Debug.LogError("Khong tim thay " + path);
#endif
        return tex;
    }

	public static TextAsset LoadTextInAsset(string path)
	{
		Debug.Log(path);
		TextAsset ret = UnityEditor.AssetDatabase.LoadAssetAtPath<TextAsset>(path);
#if UNITY_EDITOR
		if(ret == null)
			Debug.LogError("Khong tim thay " + path);
#endif
		return ret;
	}
#endif


		// Concurrent Thread Filter Badwords
		public static IEnumerator DoFilterBadWords(string input, Action<string> callback)
		{
#if KR
        input = input.FilterBadwordsChatKr();
#else
			input = input.FilterBadwords();
#endif
			if (callback != null)
				callback(input);
			yield return 0;
		}

		// Takes a screenshot and puts it in the Application.persistentDataPath directory (which is Documents on iOS)
		public static void SaveToFile(Texture2D tex, string filename)
		{
			var bytes = tex.EncodeToPNG();
			string path = Application.dataPath + "/" + filename + ".png";
			File.WriteAllBytes(path, bytes);
			Debug.Log("Finish save file to " + path);
		}

	
		// Takes a screenshot and puts it in the Application.persistentDataPath directory (which is Documents on iOS)
		public static IEnumerator TakeScreenShotToTexture(Rect rect, Action<Texture2D> callback)
		{
			yield return new WaitForSeconds(1);
			// We should only read the screen after all rendering is complete
			yield return new WaitForEndOfFrame();
			//yield return new WaitForSeconds(1);
			try
			{
				Texture2D tex = new Texture2D((int) rect.width, (int) rect.height, TextureFormat.RGB24, false);
				Debug.Log("Capture rec " + rect);
				// Read screen contents into the texture
				tex.ReadPixels(rect, 0, 0);
				tex.Apply();
				callback(tex);
			}
			catch (Exception ex)
			{
				Debug.LogError("TakeScreenShotToTexture ERROR " + ex.StackTrace);
				callback(null);
			}
		}

		static System.Random rand = new System.Random();

		/// <summary>
		/// Randoms the int. Not include max
		/// </summary>
		/// <returns>The int.</returns>
		/// <param name="max">Max.</param>
		public static int RandomInt(int max)
		{
			return rand.Next(max);
		}

		/// <summary>
		/// Randoms the int. Not include max
		/// </summary>
		/// <returns>The int.</returns>
		/// <param name="max">Max.</param>
		public static int RandomInt(int min, int max)
		{
			return rand.Next(min, max);
		}

		public static int GetRandomFormDistance(string str, string[] split)
		{
			string[] _data = str.Split(split, StringSplitOptions.RemoveEmptyEntries);
			try
			{
				int _min = int.Parse(_data[0]);
				int _max = int.Parse(_data[1]);
				return GetRandomFormDistance(_min, _max);
			}
			catch (Exception ex)
			{
				Debug.LogError("GetRandomFormDistance Error:" + ex.Message);
				return 0;
			}
		}

		public static int GetRandomFormDistance(string str)
		{
			string[] _split = new string[] {"-"};
			return GetRandomFormDistance(str, _split);
		}

		public static int GetRandomFormDistance(int min, int max)
		{
			if (min >= max)
			{
				return min;
			}
			else
			{
				return rand.Next(min, max);
			}
		}
        /// <summary>
        /// Ham random by probality , return index of prob
        /// </summary>
        /// <param name="probs"> array </param>
        /// <returns></returns>
        public static int RandomByProbs(float[] probs)
        {

            float total = 0;

            foreach (float elem in probs)
            {
                total += elem;
            }

            float randomPoint = UnityEngine.Random.value * total;

            for (int i = 0; i < probs.Length; i++)
            {
                if (randomPoint < probs[i])
                {
                    return i;
                }
                else
                {
                    randomPoint -= probs[i];
                }
            }
            return probs.Length - 1;
        }


        /// <summary>
        /// Ham random vi tri xung quanh vi tri duoc cung cap
        /// </summary>
        /// <returns>Tra ve vi tri random</returns>
        /// <param name="curPos">vi tri trung tam </param>
        /// <param name="radius">ban kinh random</param>
        public static Vector3 RandomPositionAroundPos(Vector3 curPos, float radius)
		{
			Vector3 result = Vector3.zero;

			return result;
		}

		public static void DestroyAllChild(Transform t)
		{
			var children = new List<GameObject>();

			foreach (Transform child in t)
			{
				children.Add(child.gameObject);
			}
			t.DetachChildren();

			children.ForEach(child => UnityEngine.Object.Destroy(child));
		}

		public static void DeleteAllChilds(GameObject obj)
		{
			int childNum = obj.transform.childCount;
			for (int i = childNum - 1; i >= 0; i--)
				GameObject.Destroy(obj.transform.GetChild(i).gameObject);
			obj.transform.DetachChildren();
		}

		public static Sprite ConvertToSprite(this Texture2D texture)
		{
			return Sprite.Create(texture, new Rect(0, 0, texture.width, texture.height), Vector2.zero);
		}

		public static string GetFullPath(Transform go)
		{
			string path = "";

			if (go == null)
			{
				return path;
			}
			else
			{
				if (go.transform.parent != null)
					path = GetFullPath(go.transform.parent);
				path += "/" + go.name;
			}

			return path;
		}

	
		[System.Diagnostics.Conditional("ASSERT")]
		public static void Assert(bool expression, string msgLabel = "", UnityEngine.Object c = null)
		{
			string contextName = c != null ? c.GetType().Name : "ASSERT";
			Debug.Log(
				string.Format(
					"<b><color=#0080ff>[{3}]</color></b> <i><color=#ffff00>{0}</color></i>: <b><color={1}>{2}</color></b>", msgLabel,
					(expression ? "#00ff00" : "#ff5655"), (expression ? "OK" : "FAILED"), contextName), c);
		}

		[System.Diagnostics.Conditional("ASSERT")]
		public static void AssertEquals(this object obj, object other, string msgLabel = "", UnityEngine.Object c = null)
		{
			Assert(obj == other, "AssertEquals " + msgLabel, c);
		}

		[System.Diagnostics.Conditional("ASSERT")]
		public static void AssertNotEquals(this object obj, object other, string msgLabel = "", UnityEngine.Object c = null)
		{
			Assert(obj != other, "AssertNotEquals " + msgLabel, c);
		}

		public static string CreatLongUID()
		{
			return System.Guid.NewGuid().ToString();
		}

		public static string CreatShortUID()
		{
			string enc = Convert.ToBase64String(System.Guid.NewGuid().ToByteArray());
			enc = enc.Replace("/", "_");
			enc = enc.Replace("+", "-");
			return enc.Substring(0, 22);
		}

		public static Transform FindChildWithName(string name, Transform parent)
		{
			for (int i = 0; i < parent.childCount; i++)
			{
				Transform child = parent.GetChild(i);
				if (child.name == name)
					return child;
			}

			for (int i = 0; i < parent.childCount; i++)
			{
				Transform child = parent.GetChild(i);
				Transform result = FindChildWithName(name, child);
				if (result != null)
					return result;
			}
			return null;
		}

		public static T FindCompChildByName<T>(string name, Transform parent) where T : Component
		{
			Transform trans = FindChildWithName(name, parent);
			if (trans != null)
				return trans.GetComponent<T>();
			return null;
		}

		public static string SecondsToHMS(int total, int format = 0)
		{
			int hours = total / 3600;
			int minutes = (total % 3600) / 60;
			int second = (total % 3600) % 60;

			string result = "";
			if (format == 0)
			{

				if (hours > 0)
					result += string.Format("{0:00}", hours) + ":";

				return result + string.Format("{0:00}", minutes) + ":" + string.Format("{0:00}", second);
			}
			else if (format == 1)
			{
				if (hours > 0)
					result += hours + "h ";
				if (minutes > 0)
					result += minutes + "m ";
				if (second > 0)
					result += second + "s ";
			}

			return result;
		}


		public static string MinutesToDHM(int total, string format = null)
		{
			int days = total / 1440;
			int hours = (total % 1440) / 60;
			int mins = (total % 1440) % 60;

			string result = "";
			if (format == null)
			{
				if (days > 0)
					result += days + "d ";
				if (hours > 0)
					result += hours + "h ";

				result += mins + "m ";
			}
			else
				result = string.Format(format, days, hours, mins);
			return result;
		}

		public static string CropString(string source, int len)
		{
			if (string.IsNullOrEmpty(source))
			{
				return "";
			}
			if (len >= source.Length - 3)
				return source;
			return source.Substring(0, len) + "...";
		}

		public static void SetLayerRecursively(GameObject go, int layerNumber)
		{
			if (go == null) return;
			foreach (Transform trans in go.GetComponentsInChildren<Transform>(true))
			{
				trans.gameObject.layer = layerNumber;
			}
		}

		public static void SetSpriteLayerRecursively(GameObject go, int layerNumber)
		{
			if (go == null) return;
			foreach (Renderer trans in go.GetComponentsInChildren<Renderer>(true))
			{
				trans.gameObject.layer = layerNumber;
			}
		}

		public static string MD5Sum(string strToEncrypt)
		{
			System.Text.UTF8Encoding ue = new System.Text.UTF8Encoding();
			byte[] bytes = ue.GetBytes(strToEncrypt);

			// encrypt bytes
			System.Security.Cryptography.MD5CryptoServiceProvider md5 =
				new System.Security.Cryptography.MD5CryptoServiceProvider();
			byte[] hashBytes = md5.ComputeHash(bytes);

			// Convert the encrypted bytes back to a string (base 16)
			string hashString = "";

			for (int i = 0; i < hashBytes.Length; i++)
			{
				hashString += System.Convert.ToString(hashBytes[i], 16).PadLeft(2, '0');
			}

			return hashString.PadLeft(32, '0');
		}

		public static bool IsLowPerformanceDevice()
		{
			var ram = SystemInfo.systemMemorySize;
#if UNITY_ANDROID
		if (ram < 1500)
			return true;
		return false;
		#elif UNITY_WEBGL
		if (ram < 2048)
			return true;
		return false;
		#else //ios
			if (ram < 900)
				return true;
			return false;
#endif
		}


		public static Vector2 GetPivot(Sprite sprite)
		{
			Bounds bounds = sprite.bounds;
			var pivotX = -bounds.center.x / bounds.extents.x / 2 + 0.5f;
			var pivotY = -bounds.center.y / bounds.extents.y / 2 + 0.5f;
			return new Vector2(pivotX, pivotY);
		}

		public static Stack<T> CloneStack<T>(this Stack<T> original)
		{
			var arr = new T[original.Count];
			original.CopyTo(arr, 0);
			Array.Reverse(arr);
			return new Stack<T>(arr);
		}

		public static string GenerateUid()
		{
			return Guid.NewGuid().ToString();
		}

		public static Sprite GetSkillIcon(int id)
		{
			return Resources.Load<Sprite>("UI/SkillIcon/" + id);
		}

		public static bool IsEqualFloat(float a, float b, float diff = 0.01f)
		{
			var delta = Math.Abs(a - b);
			//Debug.LogError(delta < diff);
			return delta < diff;
		}

		public static string GetBundleVersionCode()
		{
#if UNITY_EDITOR && UNITY_ANDROID
		return "." + UnityEditor.PlayerSettings.Android.bundleVersionCode;
#elif UNITY_EDITOR && UNITY_IOS
        return "." + UnityEditor.PlayerSettings.iOS.buildNumber;
#elif UNITY_ANDROID
		AndroidJavaClass up = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
		var ca = up.GetStatic<AndroidJavaObject>("currentActivity");
		AndroidJavaObject packageManager = ca.Call<AndroidJavaObject>("getPackageManager");
		var pInfo = packageManager.Call<AndroidJavaObject>("getPackageInfo", Application.identifier, 0);
		return "." + pInfo.Get<int>("versionCode");
		#else
			return string.Empty;
#endif
		}

		public static void ShuffleList<T>(List<T> list)
		{
			int n = list.Count;

			for (int i = list.Count - 1; i > 1; i--)
			{
				int rnd = rand.Next(i + 1);
				T value = list[rnd];
				list[rnd] = list[i];
				list[i] = value;
			}
		}
	}

	public static class RendererExtensions
	{
		public static bool IsVisibleFrom(this Renderer renderer, Camera camera)
		{
			Plane[] planes = GeometryUtility.CalculateFrustumPlanes(camera);
			return GeometryUtility.TestPlanesAABB(planes, renderer.bounds);
		}
	}

	public static class ObjectSerializationExtension
	{

		public static byte[] SerializeToByteArray(this object obj)
		{
			if (obj == null)
			{
				return null;
			}
			var bf = new BinaryFormatter();
			using (var ms = new MemoryStream())
			{
				bf.Serialize(ms, obj);
				return ms.ToArray();
			}
		}

		public static T Deserialize<T>(this byte[] byteArray) where T : class
		{
			if (byteArray == null)
			{
				return null;
			}
			using (var memStream = new MemoryStream())
			{
				var binForm = new BinaryFormatter();
				memStream.Write(byteArray, 0, byteArray.Length);
				memStream.Seek(0, SeekOrigin.Begin);
				var obj = (T) binForm.Deserialize(memStream);
				return obj;
			}
		}
	}

    /*
     * Calls function on every Update until it returns true
     * */
    public class FunctionUpdater {
        /*
    * Class to hook Actions into MonoBehaviour
    * */
        private class MonoBehaviourHook : MonoBehaviour {

            public Action OnUpdate;

            private void Update () {
                if (OnUpdate != null) OnUpdate();
            }

        }

        private static List<FunctionUpdater> updaterList; // Holds a reference to all active updaters
        private static GameObject initGameObject; // Global game object used for initializing class, is destroyed on scene change

        private static void InitIfNeeded () {
            if (initGameObject == null) {
                initGameObject = new GameObject("FunctionUpdater_Global");
                updaterList = new List<FunctionUpdater>();
            }
        }

        public static FunctionUpdater Create (Action updateFunc) {
            return Create(() => { updateFunc(); return false; }, "", true, false);
        }
        public static FunctionUpdater Create (Func<bool> updateFunc) {
            return Create(updateFunc, "", true, false);
        }
        public static FunctionUpdater Create (Func<bool> updateFunc, string functionName) {
            return Create(updateFunc, functionName, true, false);
        }
        public static FunctionUpdater Create (Func<bool> updateFunc, string functionName, bool active) {
            return Create(updateFunc, functionName, active, false);
        }
        public static FunctionUpdater Create (Func<bool> updateFunc, string functionName, bool active, bool stopAllWithSameName) {
            InitIfNeeded();

            if (stopAllWithSameName) {
                StopAllUpdatersWithName(functionName);
            }

            GameObject gameObject = new GameObject("FunctionUpdater Object " + functionName, typeof(MonoBehaviourHook));
            FunctionUpdater functionUpdater = new FunctionUpdater(gameObject, updateFunc, functionName, active);
            gameObject.GetComponent<MonoBehaviourHook>().OnUpdate = functionUpdater.Update;

            updaterList.Add(functionUpdater);
            return functionUpdater;
        }
        private static void RemoveUpdater (FunctionUpdater funcUpdater) {
            InitIfNeeded();
            updaterList.Remove(funcUpdater);
        }
        public static void DestroyUpdater (FunctionUpdater funcUpdater) {
            InitIfNeeded();
            if (funcUpdater != null) {
                funcUpdater.DestroySelf();
            }
        }
        public static void StopUpdaterWithName (string functionName) {
            InitIfNeeded();
            for (int i = 0; i < updaterList.Count; i++) {
                if (updaterList[i].functionName == functionName) {
                    updaterList[i].DestroySelf();
                    return;
                }
            }
        }
        public static void StopAllUpdatersWithName (string functionName) {
            InitIfNeeded();
            for (int i = 0; i < updaterList.Count; i++) {
                if (updaterList[i].functionName == functionName) {
                    updaterList[i].DestroySelf();
                    i--;
                }
            }
        }

        private GameObject gameObject;
        private string functionName;
        private bool active;
        private Func<bool> updateFunc; // Destroy Updater if return true;

        public FunctionUpdater (GameObject gameObject, Func<bool> updateFunc, string functionName, bool active) {
            this.gameObject = gameObject;
            this.updateFunc = updateFunc;
            this.functionName = functionName;
            this.active = active;
        }
        public void Pause () {
            active = false;
        }
        public void Resume () {
            active = true;
        }

        private void Update () {
            if (!active) return;
            if (updateFunc()) {
                DestroySelf();
            }
        }
        public void DestroySelf () {
            RemoveUpdater(this);
            if (gameObject != null) {
                UnityEngine.Object.Destroy(gameObject);
            }
        }
    }
}