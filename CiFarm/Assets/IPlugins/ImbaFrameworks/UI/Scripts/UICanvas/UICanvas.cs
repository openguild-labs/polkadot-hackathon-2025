// Copyright (c) 2015 - 2019 Imba
// Author: Kaka
// Created: 2019/08

using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Events;
using UnityEngine.Serialization;

namespace Imba.UI
{
    /// <summary>
    /// UI Canvas: auto setup camera, auto align UI for north device
    /// </summary>
    [RequireComponent(typeof(Canvas))]
    public class UICanvas : MonoBehaviour
    {
        public RectTransform safeAreaTransform;
        
        public static UnityEvent onOrientationChange = new UnityEvent();
        public static UnityEvent onResolutionChange = new UnityEvent();
        
        public static bool isLandscape { get; private set; }

        private static List<UICanvas> _listCanvas = new List<UICanvas>();

        private static bool _screenChangeVarsInitialized;
        private static ScreenOrientation _lastOrientation = ScreenOrientation.AutoRotation;
        private static Vector2 _lastResolution = Vector2.zero;
        private static Rect _lastSafeArea = Rect.zero;

        // public Vector2 desireResolution;

        private static Vector2 _wantedReferenceResolution; // = new Vector2(1280, 720);
        private static Camera _wantedCanvasCamera;

        private Canvas _canvas;
        private CanvasScaler _scaler;
        private RectTransform _rectTransform;

        //private RectTransform _safeAreaTransform;

        void Awake()
        {
            if (UIManager.IsInstanceValid() == false) return;

            if (!_listCanvas.Contains(this))
                _listCanvas.Add(this);

            _canvas = GetComponent<Canvas>();
            _scaler = GetComponent<CanvasScaler>();
            _rectTransform = GetComponent<RectTransform>();

            _wantedReferenceResolution = _scaler.referenceResolution;
            _wantedCanvasCamera = UIManager.Instance.UICamera;

            UpdateReferenceResolution();
            UpdateCanvasCamera();

            if(safeAreaTransform == null)
                safeAreaTransform = transform.Find("SafeArea") as RectTransform;

            if (!_screenChangeVarsInitialized)
            {
                _lastOrientation = Screen.orientation;
                _lastResolution.x = Screen.width;
                _lastResolution.y = Screen.height;
                _lastSafeArea = Screen.safeArea;

                _screenChangeVarsInitialized = true;
            }
        }

        void Start()
        {
            //UpdateCanvasCamera();
            _lastSafeArea = Screen.safeArea;
            ApplySafeArea();
        }

        void Update()
        {
            //only update for first canvas
            if (_listCanvas.Count == 0 || _listCanvas[0] != this)
                return;
            
           

            if (Application.isMobilePlatform)
            {
                if (Screen.orientation != _lastOrientation)
                    OrientationChanged();

                if (Screen.safeArea != _lastSafeArea)
                    SafeAreaChanged();
            }
            else
            {
                //resolution of mobile devices should stay the same always, right?
                // so this check should only happen everywhere else
                if (Math.Abs(Screen.width - _lastResolution.x) > 1f || Math.Abs(Screen.height - _lastResolution.y) > 1f)
                    ResolutionChanged();
            }
            
            UpdateCanvasCamera();
        }

        void ApplySafeArea()
        {
            if (safeAreaTransform == null)
                return;

            var safeArea = Screen.safeArea;

            var anchorMin = safeArea.position;
            var anchorMax = safeArea.position + safeArea.size;
            var pixelRect = _canvas.pixelRect;
            anchorMin.x /= pixelRect.width;

            
            anchorMax.x /= pixelRect.width;

            if (isLandscape)
            {
                anchorMin.y = 0;
                anchorMax.y = 1;
            }
            else
            {
                anchorMin.y /= pixelRect.height;
                anchorMax.y /= pixelRect.height;
            }
            

            

            safeAreaTransform.anchorMin = anchorMin;
            safeAreaTransform.anchorMax = anchorMax;
        }

        void UpdateCanvasCamera()
        {
            if (_canvas.worldCamera == null && _wantedCanvasCamera != null)
                _canvas.worldCamera = _wantedCanvasCamera;
        }

        void UpdateReferenceResolution()
        {
            if (_scaler.referenceResolution != _wantedReferenceResolution)
                _scaler.referenceResolution = _wantedReferenceResolution;
        }

        void OnDestroy()
        {
            if (_listCanvas != null && _listCanvas.Contains(this))
                _listCanvas.Remove(this);
        }

        private static void OrientationChanged()
        {
            //Debug.Log("Orientation changed from " + lastOrientation + " to " + Screen.orientation + " at " + Time.time);

            _lastOrientation = Screen.orientation;
            _lastResolution.x = Screen.width;
            _lastResolution.y = Screen.height;

            isLandscape = _lastOrientation == ScreenOrientation.LandscapeLeft ||
                          _lastOrientation == ScreenOrientation.LandscapeRight ||
                          _lastOrientation == ScreenOrientation.LandscapeLeft;
            onOrientationChange.Invoke();

        }

        private static void ResolutionChanged()
        {
            if (Math.Abs(_lastResolution.x - Screen.width) < 1f && Math.Abs(_lastResolution.y - Screen.height) < 1f)
                return;

            //Debug.Log("Resolution changed from " + lastResolution + " to (" + Screen.width + ", " + Screen.height + ") at " + Time.time);

            _lastResolution.x = Screen.width;
            _lastResolution.y = Screen.height;

            //IsLandscape = Screen.width > Screen.height;
            onResolutionChange.Invoke();
        }

        private static void SafeAreaChanged()
        {
            if (_lastSafeArea == Screen.safeArea)
                return;

            //Debug.Log("Safe Area changed from " + lastSafeArea + " to " + Screen.safeArea.size + " at " + Time.time);

            _lastSafeArea = Screen.safeArea;

            for (int i = 0; i < _listCanvas.Count; i++)
            {
                _listCanvas[i].ApplySafeArea();
            }
        }

        public static void SetAllCanvasCamera(Camera cam)
        {
            if (_wantedCanvasCamera == cam)
                return;

            _wantedCanvasCamera = cam;

            for (int i = 0; i < _listCanvas.Count; i++)
            {
                _listCanvas[i].UpdateCanvasCamera();
            }
        }

        public static void SetAllReferenceResolutions(Vector2 newReferenceResolution)
        {
            if (_wantedReferenceResolution == newReferenceResolution)
                return;

            //Debug.Log("Reference resolution changed from " + wantedReferenceResolution + " to " + newReferenceResolution + " at " + Time.time);

            _wantedReferenceResolution = newReferenceResolution;

            for (int i = 0; i < _listCanvas.Count; i++)
            {
                _listCanvas[i].UpdateReferenceResolution();
            }
        }

        public static Vector2 CanvasSize()
        {
            return _listCanvas[0]._rectTransform.sizeDelta;
        }

        public static Vector2 SafeAreaSize()
        {
            for (int i = 0; i < _listCanvas.Count; i++)
            {
                if (_listCanvas[i].safeAreaTransform != null)
                {
                    return _listCanvas[i].safeAreaTransform.sizeDelta;
                }
            }

            return CanvasSize();
        }

        public static Vector2 GetReferenceResolution()
        {
            return _wantedReferenceResolution;
        }
    }
}