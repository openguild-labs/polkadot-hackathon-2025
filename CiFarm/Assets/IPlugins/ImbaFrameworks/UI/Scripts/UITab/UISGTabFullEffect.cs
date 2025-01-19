using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.Serialization;
using UnityEngine.UI;

namespace Imba.UI
{
    public class UISGTabFullEffect : UISGTabBaseEffect
    {
        public Image img;
        public Color imgNormalColor;
        [FormerlySerializedAs("imgDisableColor")] public Color imgSelectedColor;

        public TextMeshProUGUI lbl;
        public Color lblNormalColor;
        [FormerlySerializedAs("lblDisableColor")] public Color lblSelectedColor;

        // public Color outNormalColor;
        // public Color outDisableColor;

        public RectTransform rectTrans;
        public Vector2 localPosNormal;
        [FormerlySerializedAs("localPosDiable")] public Vector2 localPosSelected;

        // public Transform trans;
        public Vector3 scaleNormal;
        [FormerlySerializedAs("scaleDisable")] public Vector3 scaleSelected;

        public Image imgSpr;
        public Sprite imgSprNormal;
        [FormerlySerializedAs("imgSprDisble")] public Sprite imgSprSelected;

        public GameObject EffectObj;

        protected override void Enable()
        {
            if (img != null)
            {
                img.color = imgNormalColor;
            }

            if (lbl != null)
            {
                lbl.color = lblNormalColor;
            }

            // if (outline != null)
            // {
            // 	outline.effectColor = outNormalColor;
            // }
            if (rectTrans != null)
            {
                rectTrans.anchoredPosition = localPosNormal;
            }

            if (rectTrans != null)
            {
                rectTrans.localScale = scaleNormal;
            }

            if (imgSpr != null)
            	imgSpr.sprite = imgSprNormal;

            if (EffectObj != null)
                EffectObj.SetActive(false);
        }

        protected override void Disable()
        {
            if (img != null)
            {
                img.color = imgSelectedColor;
            }

            if (lbl != null)
            {
                lbl.color = lblSelectedColor;
            }

            // if (outline != null)
            // {
            // 	outline.effectColor = outDisableColor;
            // }
            if (rectTrans != null)
            {
                rectTrans.anchoredPosition = localPosSelected;
            }

            if (imgSpr != null)
            	imgSpr.sprite = imgSprSelected;

            if (rectTrans != null)
            {
                rectTrans.localScale = scaleSelected;
            }

            if (EffectObj != null)
                EffectObj.SetActive(true);
        }
    }
}