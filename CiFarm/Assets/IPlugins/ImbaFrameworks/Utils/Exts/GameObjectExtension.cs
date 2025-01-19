using System.Collections.Generic;
using UnityEngine;

namespace Imba.Utils
{
    public static class ImbaExtension
    {
        public static List<GameObject> GetAllChilds(this GameObject go)
        {
            List<GameObject> list = new List<GameObject>();
            for (int i = 0; i < go.transform.childCount; i++)
            {
                list.Add(go.transform.GetChild(i).gameObject);
            }

            return list;
        }

        public static List<Transform> GetAllChilds(this Transform trans)
        {
            List<Transform> ts = new List<Transform>();

            foreach (Transform t in trans)
            {
                ts.Add(t);
            }

            return ts;
        }
    }
}