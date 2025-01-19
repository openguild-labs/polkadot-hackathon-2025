// Copyright (c) 2015 - 2019 Imba
// Author: Kaka
// Created: 2019/08

using System;
using System.Collections;
using UnityEngine;
using UnityEngine.UI;
using Imba.UI.Animation;


namespace Imba.UI
{
    
    /// <summary>
    /// Base class for all ui view
    /// </summary>
    [RequireComponent(typeof(RectTransform))]
    [RequireComponent(typeof(Canvas))]
    [RequireComponent(typeof(GraphicRaycaster))]
    //[RequireComponent(typeof(UIViewController))]
    [DisallowMultipleComponent]
    public class UIView : UIBaseComponent
    {
        #region Constants

        #endregion

        #region Static Fields
        #endregion

        #region Events
        #endregion

        #region Public Vars

        public bool CanGoBack = true;
        public bool ShowTopBar = false;
        public bool ShowProps = false;
        public bool ShowBackBtn = false;
        public string Title = "";
        #endregion

        #region Private Vars

        private bool _initialized;
        
        private UIViewController _controller;
        
        private Canvas _canvas;

        private GraphicRaycaster _graphicRaycaster;
        
        private CanvasGroup _canvasGroup;
        
        private Coroutine _showCoroutine;
        private Coroutine _hideCoroutine;
        
        #endregion

        #region Properties
        
        public object Parameter { get; protected set; }

        public UIViewController Controller
        {
            get
            {
                if (!_controller)
                    _controller = GetComponent<UIViewController>();

                return _controller;
            }
        }
        
        public Canvas Canvas
        {
            get
            {
                if (_canvas == null) _canvas = GetComponent<Canvas>();
                return _canvas;
            }
        }

        public GraphicRaycaster GraphicRaycaster
        {
            get
            {
                if (_graphicRaycaster == null) _graphicRaycaster = GetComponent<GraphicRaycaster>();
                return _graphicRaycaster;
            }
        }

        public CanvasGroup CanvasGroup
        {
            get
            {
                if (_canvasGroup == null) _canvasGroup = GetComponent<CanvasGroup>();
                return _canvasGroup;
            }
        }
        
        public VisibilityState VisibilityState
        {
            get;
            private set;
        }

       

        #endregion

        #region Constructors

        #endregion

        #region Unity Methods

        public override void Awake()
        {
            base.Awake();
            
            _initialized = false;
  
        }

        #endregion

        #region Public Methods

        public void Initialize(object p = null)
        {
            if (_initialized) return;
            
            if(p != null)
                Parameter = p;
            CanvasGroup.alpha = 0;
            this.gameObject.SetActive(false);
            VisibilityState = VisibilityState.Hidden;
            
            OnInit();
            
            _initialized = true;
        }
        
        public bool IsVisible()
        {
            if (Controller.DeactiveGameObjectWhenHide)
            {
                return gameObject.activeSelf;
            }
            else
            {
                return Canvas.enabled;
            }
        }


        
        public void Show(object p = null, bool isBack = false)
        {

            UIManager.DebugLog("Show " + name, this);

            if(p != null)
                Parameter = p;
            
            StopHide();

            bool instantAction = Controller.ShowBehavior.InstantAnimation;

            gameObject.SetActive(true);

            if (Controller.CanGoBack && !isBack)
            {
                Controller.ViewManager.LastShownView.Push(Controller.ViewName);
            }

            _showCoroutine = StartCoroutine(ShowEnumerator(instantAction));

            
            if (!Controller.ShowBehavior.Animation.Enabled && !instantAction)
            {
                Debug.LogError("You are trying to SHOW the (" + name + ") View, but you did not enable any SHOW animations. Enable at least one SHOW animation in order to fix this issue.");
                return; //no SHOW animations have been enabled -> cannot show this UIPopup -> stop here
            }

            //showing -> stop
            if (VisibilityState == VisibilityState.Showing)
            {
                UIManager.DebugLog("Popup is showing, pls wait " + name, this);
                return;
            }
            
            // set data if this dialog currently showing on the screen
            if (VisibilityState == VisibilityState.Shown)
            {
                UIManager.DebugLog("View was shown " + name, this);
                
                try
                {
                    OnShown();
                }
                catch (Exception e)
                {
                    Debug.LogError(e);
                }

                return;//if shown -> stop here
            }
        }
        
        private IEnumerator ShowEnumerator(bool instantAction)
        {
            yield return null; //skip a frame
            
            UIAnimator.StopAnimations(RectTransform, Controller.ShowBehavior.Animation.AnimationType); //stop any SHOW animations
            
            //Enable component & gameobject if needed
            Canvas.enabled = true;
            //GraphicRaycaster.enabled = false;
            
            
            //PLAY SHOW ANIMATION
             //MOVE
            Vector3 moveFrom = UIAnimator.GetAnimationMoveFrom(RectTransform, Controller.ShowBehavior.Animation, Vector3.zero);
            Vector3 moveTo = UIAnimator.GetAnimationMoveTo(RectTransform, Controller.ShowBehavior.Animation, Vector3.zero);
            if (!Controller.ShowBehavior.Animation.Move.Enabled || instantAction)
                ResetPosition();
            UIAnimator.Move(RectTransform, Controller.ShowBehavior.Animation, moveFrom, moveTo, instantAction); //initialize and play the SHOW Move tween

            //ROTATE
            Vector3 rotateFrom = UIAnimator.GetAnimationRotateFrom(Controller.ShowBehavior.Animation, Vector3.zero);
            Vector3 rotateTo = UIAnimator.GetAnimationRotateTo(Controller.ShowBehavior.Animation, Vector3.zero);
            if (!Controller.ShowBehavior.Animation.Rotate.Enabled || instantAction) 
                ResetRotation();
            UIAnimator.Rotate(RectTransform, Controller.ShowBehavior.Animation, rotateFrom, rotateTo, instantAction); //initialize and play the SHOW Rotate tween

            //SCALE
            Vector3 scaleFrom = UIAnimator.GetAnimationScaleFrom(Controller.ShowBehavior.Animation, Vector3.one);
            Vector3 scaleTo = UIAnimator.GetAnimationScaleTo(Controller.ShowBehavior.Animation, Vector3.one);
            if (!Controller.ShowBehavior.Animation.Scale.Enabled || instantAction) ResetScale();
            UIAnimator.Scale(RectTransform, Controller.ShowBehavior.Animation, scaleFrom, scaleTo, instantAction); //initialize and play the SHOW Scale tween

            //FADE
            float fadeFrom = UIAnimator.GetAnimationFadeFrom(Controller.ShowBehavior.Animation, 1f);
            float fadeTo = UIAnimator.GetAnimationFadeTo(Controller.ShowBehavior.Animation, 1f);
            if (!Controller.ShowBehavior.Animation.Fade.Enabled || instantAction)
            {
                ResetAlpha();
            }
            UIAnimator.Fade(RectTransform, Controller.ShowBehavior.Animation, fadeFrom, fadeTo, instantAction); //initialize and play the SHOW Fade tween
            
            VisibilityState = VisibilityState.Showing; //update the visibility state
            OnShowing();
            Controller.ShowBehavior.OnStart.Invoke(gameObject, !instantAction, !instantAction);
           
            if (!instantAction) //wait for the animation to finish
            {
                yield return new WaitForSecondsRealtime(Controller.ShowBehavior.Animation.TotalDuration);
            }

            Controller.ShowBehavior.OnFinished.Invoke(gameObject, !instantAction, !instantAction);

            _showCoroutine = null;

            OnShowAnimCompleted();
        }


        /// <summary>
        /// Hide this View
        /// </summary>
        /// <param name="instantHide">Hide without animation</param>
        /// <param name="isBack">is hide by back button</param>
        public void Hide(bool instantHide = false, bool isBack = false)
        {
    
            UIManager.DebugLog("Hide View " + name, this);
      
            
            bool instantAction = instantHide;
            if (Controller.HideBehavior.InstantAnimation) instantAction = true;
            
            StopShow();
            
            if (!Controller.HideBehavior.Animation.Enabled && !instantAction)
            {
                Debug.LogError("You are trying to HIDE the (" + name + ") UIView, but you did not enable any HIDE animations. Enable at least one HIDE animation in order to fix this issue.");
                return; //no HIDE animations have been enabled -> cannot hide this UIPopup -> stop here
            }

            if (VisibilityState == VisibilityState.Hiding)
            {
                UIManager.DebugLog("View is hidding, pls wait " + name, this);
                return;
            }
            
            // if (!isBack && Controller.CanGoBack)
            // {
            //     Controller.ViewManager.LastShownView.Push(Controller.ViewName);
            // }
         
            
            _hideCoroutine = StartCoroutine(HideEnumerator(instantAction));
        }
        
        private IEnumerator HideEnumerator(bool instantAction)
        {
            UIAnimator.StopAnimations(RectTransform, Controller.HideBehavior.Animation.AnimationType); //stop any HIDE animations

            //MOVE
            Vector3 moveFrom = UIAnimator.GetAnimationMoveFrom(RectTransform, Controller.HideBehavior.Animation, Vector3.zero);
            Vector3 moveTo = UIAnimator.GetAnimationMoveTo(RectTransform,Controller. HideBehavior.Animation, Vector3.zero);
            if (!Controller.HideBehavior.Animation.Move.Enabled || instantAction)
                ResetPosition();
            UIAnimator.Move(RectTransform, Controller.HideBehavior.Animation, moveFrom, moveTo, instantAction); //initialize and play the HIDE Move tween

            //ROTATE
            Vector3 rotateFrom = UIAnimator.GetAnimationRotateFrom(Controller.HideBehavior.Animation, Vector3.zero);
            Vector3 rotateTo = UIAnimator.GetAnimationRotateTo(Controller.HideBehavior.Animation, Vector3.zero);
            if (!Controller.HideBehavior.Animation.Rotate.Enabled || instantAction)
                ResetRotation();
            UIAnimator.Rotate(RectTransform, Controller.HideBehavior.Animation, rotateFrom, rotateTo, instantAction); //initialize and play the HIDE Rotate tween

            //SCALE
            Vector3 scaleFrom = UIAnimator.GetAnimationScaleFrom(Controller.HideBehavior.Animation, Vector3.one);
            Vector3 scaleTo = UIAnimator.GetAnimationScaleTo(Controller.HideBehavior.Animation, Vector3.one);
            if (!Controller.HideBehavior.Animation.Scale.Enabled || instantAction) 
                ResetScale();
            UIAnimator.Scale(RectTransform, Controller.HideBehavior.Animation, scaleFrom, scaleTo, instantAction); //initialize and play the HIDE Scale tween

            //FADE
            float fadeFrom = UIAnimator.GetAnimationFadeFrom(Controller.HideBehavior.Animation, 1f);
            float fadeTo = UIAnimator.GetAnimationFadeTo(Controller.HideBehavior.Animation, 1f);
            if (!Controller.HideBehavior.Animation.Fade.Enabled || instantAction)
            {
                ResetAlpha();
            }
            UIAnimator.Fade(RectTransform, Controller.HideBehavior.Animation, fadeFrom, fadeTo, instantAction); //initialize and play the HIDE Fade tween

  
            VisibilityState = VisibilityState.Hiding;
            OnHiding();
            Controller.HideBehavior.OnStart.Invoke(gameObject, !instantAction, !instantAction);

            if (!instantAction) //wait for the animation to finish
            {
                 yield return new WaitForSecondsRealtime(Controller.HideBehavior.Animation.TotalDuration + 0.05f); //wait for seconds realtime (ignore Unity's Time.Timescale)
            }

            Controller.HideBehavior.OnFinished.Invoke(gameObject, !instantAction, !instantAction);
            
            _hideCoroutine = null; //clear the coroutine reference
 
            OnTweenHideCompleted();
        }

        #endregion

        #region Private Methods

         void OnTweenHideCompleted()
        {
            VisibilityState = VisibilityState.Hidden;
            //UIManager.Instance.RemoveUIFromListBackButton(this);
           
            OnHidden();

            if (Controller.DeactiveGameObjectWhenHide)
                gameObject.SetActive(false);
            else
            {
                Canvas.enabled = false;
                GraphicRaycaster.enabled = false;
                //gameObject.SetActive(false)          
            }
        }

        void OnShowAnimCompleted()
        {
            try
            {
                OnShown();
            }
            catch (Exception e)
            {
                Debug.LogError(e);
            }

            VisibilityState = VisibilityState.Shown;
         
            GraphicRaycaster.enabled = true;
        }
        
        private void StopHide()
        {
            if (_hideCoroutine == null) return;

            if (VisibilityState == VisibilityState.Hidden) return;
            
            Debug.Log("Stop Hide" + name);
            
            StopCoroutine(_hideCoroutine);
            _hideCoroutine = null;
            VisibilityState = VisibilityState.Hidden;
            UIAnimator.StopAnimations(RectTransform, AnimationType.Hide);
        }

        private void StopShow()
        {
            if (_showCoroutine == null) return;
            
            Debug.Log("Stop Show");
            
            StopCoroutine(_showCoroutine);
            _showCoroutine = null;
            UIAnimator.StopAnimations(RectTransform, AnimationType.Show);
          
//            //Overlay.DOKill(true);
//            CanvasGroup.DOKill(true);
//            Container.transform.DOKill(true);
            
            VisibilityState = VisibilityState.Shown;
        }

     
        #endregion

        #region Virtual Methods
        
        /// <summary>
        /// Init this instance.
        /// </summary>
        protected virtual void OnInit()
        {
            UIManager.DebugLog("OnInit", this);
        }
    
        protected virtual void OnShown()
        {
            UIManager.DebugLog("OnShown", this);
        }

        protected virtual void OnHiding()
        {
            UIManager.DebugLog("OnHiding", this);
        }
        
        protected virtual void OnShowing()
        {
            UIManager.DebugLog("OnShowing", this);
        }

        protected virtual void OnHidden()
        {
            UIManager.DebugLog("OnHidden", this);
        }

        public override bool OnBackClick()
        {
             UIManager.DebugLog("OnBackClick " + name, this);
            
            Hide();
            
            return base.OnBackClick();
        }

        #endregion

        #region Static Methods

        #endregion

    }
  
}
