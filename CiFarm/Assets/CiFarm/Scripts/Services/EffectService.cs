using System.Collections;
using System.Collections.Generic;
using Imba.Utils;
using UnityEngine;
using UnityEngine.Events;

namespace CiFarm.Scripts.Services
{
    public class EffectService : ManualSingletonMono<EffectService>
    {
        public VFXDatabase Database;

        private static Dictionary<VFXType, GameObject> dic;

        public override void Awake()
        {
            base.Awake();
            dic = new();
            foreach (var item in Database.entries)
            {
                dic.Add(item.Type, item.Prefab);
            }
        }

        public GameObject PlayVFX(VFXType type, Vector3 position, float time = 0)
        {
            if (!dic.ContainsKey(type))
            {
                return null;
            }

            GameObject eff = SimplePool.Spawn(dic[type], position, dic[type].transform.rotation);
            if (time > 0)
            {
                StartCoroutine(OnEffect(time, () => { SimplePool.Despawn(eff); }));
            }

            return eff;
        }

        private IEnumerator OnEffect(float time, UnityAction onAction)
        {
            yield return new WaitForSeconds(time);
            onAction?.Invoke();
        }
    }
}