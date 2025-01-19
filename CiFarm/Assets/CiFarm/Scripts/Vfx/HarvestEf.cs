using System;
using DG.Tweening;
using TMPro;
using UnityEngine;

namespace CiFarm.Scripts.Vfx
{
    public class HarvestEf : MonoBehaviour
    {
        [SerializeField] private SpriteRenderer icon;
        [SerializeField] private TextMeshPro    textValue;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="spriteIc"></param>
        /// <param name="quantity"></param>
        /// <param name="flySpeed">the higher mean faster</param>
        public void Init(Sprite spriteIc, int quantity, float flySpeed = 10)
        {
            icon.sprite    = spriteIc;
            textValue.text = "+" +quantity.ToString();
            transform.DOMoveY(flySpeed, 3f).SetLoops(-1, LoopType.Yoyo).SetEase(Ease.Linear);
        }

        private void OnDisable()
        {
            transform.DOKill();
        }
    }
}