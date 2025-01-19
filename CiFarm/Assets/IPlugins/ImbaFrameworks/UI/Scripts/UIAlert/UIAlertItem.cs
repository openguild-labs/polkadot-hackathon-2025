// Copyright (c) 2015 - 2019 Imba
// Author: Kaka
// Created: 2019/08

using UnityEngine;
using UnityEngine.UI;
using System.Collections;
using System.Collections.Generic;
using DG.Tweening;
using TMPro;
namespace Imba.UI
{

    public class UIAlertItem : MonoBehaviour
    {
        public UIAlertManager Manager;

        public TextMeshProUGUI AlertMessage;
        public Image AlertIcon;
        public Transform Container;

        public Color AlertNormalColor;
        public Color AlertErrorColor;

        private List<TextMeshProUGUI> _msgPool = new List<TextMeshProUGUI>();//cached message
        private List<Image> _imgPool = new List<Image>();//cached Icon

        private const float MOVE_HEIGHT = 150;

        void Awake()
        {
            AlertMessage.gameObject.SetActive(false);//Only for Pooling purpose
            AlertIcon.gameObject.SetActive(false);//Only for Pooling purpose
        }

        public void Show(float alertTimeShow, float startPositionY = 0, AlertType type = AlertType.Normal,
            params object[] data)
        {
            int txtIndex = 0;
            int imgIndex = 0;

            for (int i = 0; i < data.Length; i++)
            {
                string strData = data[i] as string;
                if (!string.IsNullOrEmpty(strData))
                {
                    TextMeshProUGUI item = CreateOrGetMsgItem(txtIndex);
                    item.text = strData;
                    item.color = type == AlertType.Normal ? AlertNormalColor : AlertErrorColor;
                    DOFadeItem(item, alertTimeShow);
                    txtIndex++;
                    item.transform.SetSiblingIndex(i);
                    continue;
                }

                Sprite spriteData = data[i] as Sprite;
                if (spriteData != null)
                {
                    Image item = CreateOrGetImageItem(imgIndex);
                    bool isAlertError = type == AlertType.Normal? true : false;
                    item.gameObject.SetActive(isAlertError);
                    item.sprite = spriteData;
                    DOFadeItem(item, alertTimeShow);
                    imgIndex++;
                    item.transform.SetSiblingIndex(i);
                    continue;
                }

                Debug.LogError("[Show Alert] Wrong data");
            }

            for (int i = txtIndex; i < _msgPool.Count; i++)
            {
                _msgPool[i].gameObject.SetActive(false);
            }

            for (int i = imgIndex; i < _imgPool.Count; i++)
            {
                _imgPool[i].gameObject.SetActive(false);
            }

            transform.localPosition = new Vector3(0, startPositionY, 0);
            transform.DOLocalMove(new Vector3(0, startPositionY + MOVE_HEIGHT, 0), alertTimeShow).SetEase(Ease.Linear)
                .OnComplete(OnShowComplete);
        }

        private TextMeshProUGUI CreateOrGetMsgItem(int index)
        {
            TextMeshProUGUI item = null;
            if (index < _msgPool.Count)
            {
                item = _msgPool[index];
            }
            else
            {
                item = Instantiate(AlertMessage, Container);
                _msgPool.Add(item);
            }
            item.gameObject.SetActive(true);
            return item;
        }

        private Image CreateOrGetImageItem(int index)
        {
            Image item = null;
            if (index < _imgPool.Count)
            {
                item = _imgPool[index];
            }
            else
            {
                item = Instantiate(AlertIcon, Container);
                _imgPool.Add(item);
            }
            item.gameObject.SetActive(true);
            return item;
        }

        private void DOFadeItem(TextMeshProUGUI item, float alertTimeShow)
        {
            Color col = item.color;
            col.a = 1;
            item.color = col;
            item.DOFade(0, 1).SetDelay(alertTimeShow - 1).SetEase(Ease.OutExpo);
        }

        private void DOFadeItem(Image item, float alertTimeShow)
        {
            Color col = item.color;
            col.a = 1;
            item.color = col;
            item.DOFade(0, 1).SetDelay(alertTimeShow - 1).SetEase(Ease.OutExpo);
        }

        private void OnShowComplete()
        {
            Manager.EnqueueAlertItem(this);
        }
    }

}