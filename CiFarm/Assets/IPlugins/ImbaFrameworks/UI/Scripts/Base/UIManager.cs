// Copyright (c) 2015 - 2019 Imba
// Author: Kaka
// Created: 2019/08

using System.Collections.Generic;
using DG.Tweening;
using Imba.Utils;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.SceneManagement;

namespace Imba.UI
{
    /// <summary>
    /// UIManager: Manage all UI element include Popups, Views, Notices, Alert ...
    /// </summary>
    public class UIManager : ManualSingletonMono<UIManager>
    {
        public Camera         UICamera;
        public UIViewManager  ViewManager;
        public UIPopupManager PopupManager;
        public UIAlertManager AlertManager;

        public RectTransform CanvasRect;

        [Header("LOADING")]
        public RectTransform LoadingObject;

        public List<RectTransform> miniTomato;
        public List<RectTransform> bigTomato;
        public float               bigSize   = 1.5f;
        public float               minSize   = 0.8f;
        public float               interVert = 1f;

        [Header("T  ransition")]
        public RectTransform transitionRect;

        public RectTransform transitionRender;

        public bool IsShowingLoading
        {
            get
            {
                if (LoadingObject)
                {
                    return LoadingObject.gameObject.activeSelf;
                }

                return false;
            }
        }

        public override void Awake()
        {
            base.Awake();
            if (!ViewManager)
            {
                ViewManager = GetComponentInChildren<UIViewManager>();
            }

            if (!PopupManager)
            {
                PopupManager = GetComponentInChildren<UIPopupManager>();
            }

            if (!AlertManager)
            {
                AlertManager = GetComponentInChildren<UIAlertManager>();
            }

            if (LoadingObject)
            {
                LoadingObject.gameObject.SetActive(false);
            }

            // mainCanvas.referenceResolution = new Vector2(Screen.width, Screen.height);


#if DISABLE_LOG
			Debug.unityLogger.filterLogType = LogType.Error;
#endif
        }

        void Start()
        {
            SceneManager.sceneLoaded += OnSceneLoaded;
        }



        void OnSceneLoaded(Scene scene, LoadSceneMode loadSceneMode)
        {
        }

        public void DoLoadingAnimation()
        {
            foreach (RectTransform mini in miniTomato)
            {
                mini.DOScale(bigSize, 0.2f)
                    .OnComplete(() =>
                    {
                        mini.DOScale(minSize, 0.2f)
                            .SetDelay(interVert)
                            .SetLoops(-1, LoopType.Yoyo);
                    });
            }

            foreach (RectTransform big in bigTomato)
            {
                big.DOScale(minSize, 0.2f)
                    .OnComplete(() =>
                    {
                        big.DOScale(bigSize, 0.2f)
                            .SetDelay(interVert)
                            .SetLoops(-1, LoopType.Yoyo);
                    });
            }
        }

        public void ShowLoading(float timeToHide = 0)
        {
            //Debug.Log ("ShowLoading");
            //DoLoadingAnimation();
            LoadingObject.gameObject.SetActive(true);
            if (timeToHide <= 0) CancelInvoke("HideLoadingCallback");
            else Invoke("HideLoadingCallback", timeToHide);
        }

        public void HideLoading()
        {
            CancelInvoke("HideLoadingCallback");
            LoadingObject.gameObject.SetActive(false);
        }

        public void ShowTransition(UnityAction onDone)
        {
            transitionRect.SetActive(true);
            transitionRender.localScale = Vector3.zero;
            transitionRender.DOScale(Vector3.one * 8, 0.5f).OnComplete(() => { onDone?.Invoke(); })
                .SetEase(Ease.Linear);
        }

        public void HideTransition(UnityAction onDone)
        {
            transitionRender.DOScale(Vector3.zero, 0.5f).OnComplete(() =>
            {
                transitionRect.SetActive(false);
                onDone?.Invoke();
            }).SetEase(Ease.Linear);
        }

        void HideLoadingCallback()
        {
            LoadingObject.gameObject.SetActive(false);
        }

        public bool ShowDebugLog = true;

        public static void DebugLog<T>(string message, T com)
        {
#if UNITY_EDITOR
            if (!Instance || !Instance.ShowDebugLog) return;

            string msg = string.Format("[{0}] {1}", com != null ? com.GetType().ToString() : "", message);
            Debug.Log(string.Format("<color=blue>[UIManager][{0}] {1}</color>", com.GetType(), message));
#endif
        }
    }
}