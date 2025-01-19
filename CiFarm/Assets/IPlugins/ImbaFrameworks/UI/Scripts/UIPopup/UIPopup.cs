// Copyright (c) 2015 - 2019 Imba
// Author: Kaka
// Created: 2019/08
using System;
using System.Collections;
using UnityEngine;
using UnityEngine.UI;
using DG.Tweening;
using Imba.Audio;
using Button = UnityEngine.UI.Button;
using Imba.UI.Animation;

namespace Imba.UI
{

    /// <summary>
    /// Base class for all ui popup
    /// </summary>
    [RequireComponent(typeof(RectTransform))]
    [RequireComponent(typeof(Canvas))]
    [RequireComponent(typeof(GraphicRaycaster))]
    [DisallowMultipleComponent]
	public abstract class UIPopup : UIBaseComponent
    {
        #region Constants
        #endregion

        #region Static Fields
        #endregion

        #region Events

        #endregion

        #region Public Vars

        public UIContainer Container;
        public UIContainer Overlay;

        //public Vector3 StartPosition;


        #endregion

        #region Private Vars
        /// <summary> Internal variable used to suppress invoking events when the first Hide is executed </summary>
        private bool _initialized;

        private Canvas _canvas;

        private GraphicRaycaster _graphicRaycaster;
        
        private CanvasGroup _canvasGroup;
        
        private Coroutine _showCoroutine;
        private Coroutine _hideCoroutine;
     
        #endregion

        #region Properties


        public VisibilityState VisibilityState
        {
            get;
            private set;
        }

        public UIPopupController Controller { get; private set; }


        public object Parameter { get; protected set; }
        
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

        #endregion

        #region Constructors
        #endregion

        #region Unity Methods

        private void OnValidate()
        {
            if(Container.RectTransform == null) Container.RectTransform = transform.Find("Container").AsRectTransform();
            if(Overlay.RectTransform == null) Overlay.RectTransform = transform.Find("Overlay").AsRectTransform();
        }

        public override void Awake()
        {
            base.Awake();
            
            _initialized = false;
  
        }

        #endregion


        #region Public Methods

        public void Initialize(UIPopupController controller, object p)
        {
            if (_initialized) return;
            
            if(p != null)
                Parameter = p;
            
            VisibilityState = VisibilityState.Hidden;
            Controller = controller;
            
            Overlay.Disable();
            Container.Disable();

            if (Controller.CloseByClickOutside)
            {
                Button b = Overlay.RectTransform.GetComponent<Button>();
                if (!b)
                {
                    b = Overlay.RectTransform.gameObject.AddComponent<Button>();
                    b.transition = Selectable.Transition.None;
                }
 
                b.onClick.AddListener(() =>
                {
                    UIManager.DebugLog("Close by click Overlay", this);
                    //AudioManager.Instance.PlaySFX(AudioName.BackOrCancel);
                    Hide();
                });
            }
            
            

            OnInit();
            
            _initialized = true;
        }

        /// <summary>
        /// Show popup with data 
        /// </summary>
        /// <param name="p">Data to show</param>
        public void Show(object p = null)
        {

            UIManager.DebugLog("Show " + Controller.PopupName, this);

            if(p != null)
                Parameter = p;
            
            StopHide();

            bool instantAction = Controller.ShowBehavior.InstantAnimation;
            
            if (!Controller.ShowBehavior.Animation.Enabled && !instantAction)
            {
                Debug.LogError("You are trying to SHOW the (" + name + ") UIPopup, but you did not enable any SHOW animations. Enable at least one SHOW animation in order to fix this issue.");
                return; //no SHOW animations have been enabled -> cannot show this UIPopup -> stop here
            }

            //showing -> stop
            if (VisibilityState == VisibilityState.Showing)
            {
                UIManager.DebugLog("Popup is showing, pls wait " + Controller.PopupName, this);
                return;
            }
            
            //update order in parent
            if (Controller.AlwaysOnTop)
                MoveToTop();
            else if (Controller.PopupManager.GetHighestAlwaysOnTopPopupOrder() > 0)//neu co popup always on top
                OrderInParent = Controller.PopupManager.GetLowestAlwaysOnTopPopupOrder() - 1;//dat sau popup always on top
            else
                OrderInParent = Controller.PopupManager.GetActiveTopPopupOrder() + 1;//dat tren popup active

            // set data if this dialog currently showing on the screen
            if (VisibilityState == VisibilityState.Shown)
            {
                UIManager.DebugLog("Popup was shown " + Controller.PopupName, this);
                Controller.PopupManager.AddVisiblePopup(this);
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

            _showCoroutine = StartCoroutine(ShowEnumerator(instantAction));

        }


        private IEnumerator ShowEnumerator(bool instantAction)
        {
            yield return null; //skip a frame
            
            UIAnimator.StopAnimations(Container.RectTransform, Controller.ShowBehavior.Animation.AnimationType); //stop any SHOW animations
            
            //Enable component & gameobject if needed
            gameObject.SetActive(true);
            Canvas.enabled = true;
            GraphicRaycaster.enabled = true;
            Container.Enable();
            if(Controller.ShowOverlay)
                Overlay.Enable();
            else
                Overlay.Disable();
            
            
            //PLAY SHOW ANIMATION
             //MOVE
            Vector3 moveFrom = UIAnimator.GetAnimationMoveFrom(Container.RectTransform, Controller.ShowBehavior.Animation, Vector3.zero);
            Vector3 moveTo = UIAnimator.GetAnimationMoveTo(Container.RectTransform, Controller.ShowBehavior.Animation, Vector3.zero);
            if (!Controller.ShowBehavior.Animation.Move.Enabled || instantAction)
                Container.ResetPosition();
            UIAnimator.Move(Container.RectTransform, Controller.ShowBehavior.Animation, moveFrom, moveTo, instantAction); //initialize and play the SHOW Move tween

            //ROTATE
            Vector3 rotateFrom = UIAnimator.GetAnimationRotateFrom(Controller.ShowBehavior.Animation, Vector3.zero);
            Vector3 rotateTo = UIAnimator.GetAnimationRotateTo(Controller.ShowBehavior.Animation, Vector3.zero);
            if (!Controller.ShowBehavior.Animation.Rotate.Enabled || instantAction) 
                Container.ResetRotation();
            UIAnimator.Rotate(Container.RectTransform, Controller.ShowBehavior.Animation, rotateFrom, rotateTo, instantAction); //initialize and play the SHOW Rotate tween

            //SCALE
            Vector3 scaleFrom = UIAnimator.GetAnimationScaleFrom(Controller.ShowBehavior.Animation, Vector3.one);
            Vector3 scaleTo = UIAnimator.GetAnimationScaleTo(Controller.ShowBehavior.Animation, Vector3.one);
            if (!Controller.ShowBehavior.Animation.Scale.Enabled || instantAction) Container.ResetScale();
            UIAnimator.Scale(Container.RectTransform, Controller.ShowBehavior.Animation, scaleFrom, scaleTo, instantAction); //initialize and play the SHOW Scale tween

            //FADE
            float fadeFrom = UIAnimator.GetAnimationFadeFrom(Controller.ShowBehavior.Animation, 1f);
            float fadeTo = UIAnimator.GetAnimationFadeTo(Controller.ShowBehavior.Animation, 1f);
            if (!Controller.ShowBehavior.Animation.Fade.Enabled || instantAction)
            {
                Container.ResetAlpha();
            }
            UIAnimator.Fade(Container.RectTransform, Controller.ShowBehavior.Animation, fadeFrom, fadeTo, instantAction); //initialize and play the SHOW Fade tween
            
            if (Controller.FadeContent)
            {
                //Overlay.DOFade(Controller.OverlayFadeAlpha, Controller.AnimationTime);
                CanvasGroup.DOFade(1, Controller.ShowBehavior.Animation.TotalDuration);
            }
            else
            {
                CanvasGroup.alpha = 1;
            }


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





        // ReSharper disable Unity.PerformanceAnalysis
        /// <summary>
        /// Raises the hide event.
        /// </summary>
        public void Hide(bool instantHide = false)
        {
            bool instantAction = instantHide;
            if (Controller.HideBehavior.InstantAnimation) instantAction = true;
            
            StopShow();
            
            if (!Controller.HideBehavior.Animation.Enabled && !instantAction)
            {
                Debug.LogError("You are trying to HIDE the (" + name + ") UIPopup, but you did not enable any HIDE animations. Enable at least one HIDE animation in order to fix this issue.");
                return; //no HIDE animations have been enabled -> cannot hide this UIPopup -> stop here
            }
            
            if (VisibilityState == VisibilityState.Hiding) return;
            
            _hideCoroutine = StartCoroutine(HideEnumerator(instantAction));
        }
        
        private IEnumerator HideEnumerator(bool instantAction)
        {
            UIAnimator.StopAnimations(Container.RectTransform, Controller.HideBehavior.Animation.AnimationType); //stop any HIDE animations

            //MOVE
            Vector3 moveFrom = UIAnimator.GetAnimationMoveFrom(Container.RectTransform, Controller.HideBehavior.Animation, Vector3.zero);
            Vector3 moveTo = UIAnimator.GetAnimationMoveTo(Container.RectTransform,Controller. HideBehavior.Animation, Vector3.zero);
            if (!Controller.HideBehavior.Animation.Move.Enabled || instantAction)
                Container.ResetPosition();
            UIAnimator.Move(Container.RectTransform, Controller.HideBehavior.Animation, moveFrom, moveTo, instantAction); //initialize and play the HIDE Move tween

            //ROTATE
            Vector3 rotateFrom = UIAnimator.GetAnimationRotateFrom(Controller.HideBehavior.Animation, Vector3.zero);
            Vector3 rotateTo = UIAnimator.GetAnimationRotateTo(Controller.HideBehavior.Animation, Vector3.zero);
            if (!Controller.HideBehavior.Animation.Rotate.Enabled || instantAction)
                Container.ResetRotation();
            UIAnimator.Rotate(Container.RectTransform, Controller.HideBehavior.Animation, rotateFrom, rotateTo, instantAction); //initialize and play the HIDE Rotate tween

            //SCALE
            Vector3 scaleFrom = UIAnimator.GetAnimationScaleFrom(Controller.HideBehavior.Animation, Vector3.one);
            Vector3 scaleTo = UIAnimator.GetAnimationScaleTo(Controller.HideBehavior.Animation, Vector3.one);
            if (!Controller.HideBehavior.Animation.Scale.Enabled || instantAction) 
                Container.ResetScale();
            UIAnimator.Scale(Container.RectTransform, Controller.HideBehavior.Animation, scaleFrom, scaleTo, instantAction); //initialize and play the HIDE Scale tween

            //FADE
            float fadeFrom = UIAnimator.GetAnimationFadeFrom(Controller.HideBehavior.Animation, 1f);
            float fadeTo = UIAnimator.GetAnimationFadeTo(Controller.HideBehavior.Animation, 1f);
            if (!Controller.HideBehavior.Animation.Fade.Enabled || instantAction)
            {
                Container.ResetAlpha();
            }
            UIAnimator.Fade(Container.RectTransform, Controller.HideBehavior.Animation, fadeFrom, fadeTo, instantAction); //initialize and play the HIDE Fade tween

            if (Controller.FadeContent)
            {
                CanvasGroup.DOFade(0, Controller.ShowBehavior.Animation.TotalDuration);
            }
            else
            {
                //CanvasGroup.alpha = 1;
            }
  
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

        
        /// <summary>
        /// Call when click Back button ( Android Back or Escape)
        /// </summary>
        public override bool OnBackClick()
        {
            base.OnBackClick();
            if (Controller.CloseByBackButton)
            {
                Hide();
                return true;
            }
          
            return false;
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

      

        #endregion

        #region Private Methods
        void OnTweenHideCompleted()
        {
            VisibilityState = VisibilityState.Hidden;
            Controller.PopupManager.RemoveVisiblePopup(this);
            Controller.PopupManager.RemoveHiddenFromVisiblePopups();
            
            OnHidden();

            Overlay.Disable();
            Container.Disable();
            if (Controller.DeactiveGameObjectWhenHide)
                gameObject.SetActive(false);
            else
            {
                Canvas.enabled = false;
                GraphicRaycaster.enabled = false;
            }

            if (Controller && Controller.AfterHideBehaviour == AfterHideBehaviour.Destroy)
            {
                StopAllCoroutines();
                Destroy(gameObject);
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
            Controller.PopupManager.RemoveHiddenFromVisiblePopups();
            Controller.PopupManager.AddVisiblePopup(this);
           
        }
        
        private void StopHide()
        {
            if (_hideCoroutine == null) return;
            
            Debug.Log("Stop Hide");
            
            StopCoroutine(_hideCoroutine);
            _hideCoroutine = null;
            VisibilityState = VisibilityState.Hidden;
            UIAnimator.StopAnimations(Container.RectTransform, AnimationType.Hide);
            Controller.PopupManager.RemoveVisiblePopup(this);
        }

        private void StopShow()
        {
            if (_showCoroutine == null) return;
            
          //  Debug.Log("Stop Show");
            
            StopCoroutine(_showCoroutine);
            _showCoroutine = null;
            UIAnimator.StopAnimations(Container.RectTransform, AnimationType.Show);
          //  Debug.Log("End Showw");
          
//            //Overlay.DOKill(true);
//            CanvasGroup.DOKill(true);
//            Container.transform.DOKill(true);
            
            VisibilityState = VisibilityState.Shown;
            Controller.PopupManager.AddVisiblePopup(this);
        }

        
        #endregion

    }
}