// Copyright (c) 2015 - 2019 Imba
// Author: Kaka
// Created: 2019/08

using System;
using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine.UI;

using Imba.UI.Animation;

namespace Imba.UI
{
    
    /// <summary>
    /// Component to control the view
    /// </summary>
    [RequireComponent(typeof(RectTransform))]
    [RequireComponent(typeof(Canvas))]
    [RequireComponent(typeof(GraphicRaycaster))]
    [DisallowMultipleComponent]
    [ExecuteInEditMode]
    public class UIAnimationComponent : UIBaseComponent
    {
        #region Constants

        #endregion

        #region Static Fields
        #endregion

        #region Events
        #endregion

        #region Public Vars
        
        public bool DeactiveGameObjectWhenHide = false;

        public UIViewBehavior ShowBehavior = new UIViewBehavior(AnimationType.Show);
	    
        public UIViewBehavior HideBehavior = new UIViewBehavior(AnimationType.Hide);

        #endregion

        #region Private Vars

        private Canvas _canvas;

        private GraphicRaycaster _graphicRaycaster;
        
        private CanvasGroup _canvasGroup;
        
        private Coroutine _showCoroutine;
        
        private Coroutine _hideCoroutine;

        #endregion

        #region Properties
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
        
        public void Show()
        {
         
            StopHide();

            bool instantAction = ShowBehavior.InstantAnimation;
            
            if (!this.ShowBehavior.Animation.Enabled && !instantAction)
            {
                Debug.LogError("You are trying to SHOW the (" + name + ") View, but you did not enable any SHOW animations. Enable at least one SHOW animation in order to fix this issue.");
                return; //no SHOW animations have been enabled -> cannot show this UIPopup -> stop here
            }

            //showing -> stop
            if (VisibilityState == VisibilityState.Showing)
            {
                UIManager.DebugLog("Component is showing, pls wait " + name, this);
                return;
            }
            
            // set data if this dialog currently showing on the screen
            if (VisibilityState == VisibilityState.Shown)
            {
                UIManager.DebugLog("Component was shown " + name, this);
                
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
            gameObject.SetActive(true);
            

            UIManager.DebugLog("Show Anim " + name, this);

            
         
            _showCoroutine = StartCoroutine(ShowEnumerator(instantAction));
        }

            private IEnumerator ShowEnumerator(bool instantAction)
        {
            yield return null; //skip a frame
            
            UIAnimator.StopAnimations(RectTransform, this.ShowBehavior.Animation.AnimationType); //stop any SHOW animations
            
            //Enable component & gameobject if needed
            Canvas.enabled = true;
            //GraphicRaycaster.enabled = false;
            
            
            //PLAY SHOW ANIMATION
             //MOVE
            Vector3 moveFrom = UIAnimator.GetAnimationMoveFrom(RectTransform, this.ShowBehavior.Animation, Vector3.zero);
            Vector3 moveTo = UIAnimator.GetAnimationMoveTo(RectTransform, this.ShowBehavior.Animation, Vector3.zero);
            if (!this.ShowBehavior.Animation.Move.Enabled || instantAction)
                ResetPosition();
            UIAnimator.Move(RectTransform, this.ShowBehavior.Animation, moveFrom, moveTo, instantAction); //initialize and play the SHOW Move tween

            //ROTATE
            Vector3 rotateFrom = UIAnimator.GetAnimationRotateFrom(this.ShowBehavior.Animation, Vector3.zero);
            Vector3 rotateTo = UIAnimator.GetAnimationRotateTo(this.ShowBehavior.Animation, Vector3.zero);
            if (!this.ShowBehavior.Animation.Rotate.Enabled || instantAction) 
                ResetRotation();
            UIAnimator.Rotate(RectTransform, this.ShowBehavior.Animation, rotateFrom, rotateTo, instantAction); //initialize and play the SHOW Rotate tween

            //SCALE
            Vector3 scaleFrom = UIAnimator.GetAnimationScaleFrom(this.ShowBehavior.Animation, Vector3.one);
            Vector3 scaleTo = UIAnimator.GetAnimationScaleTo(this.ShowBehavior.Animation, Vector3.one);
            if (!this.ShowBehavior.Animation.Scale.Enabled || instantAction) ResetScale();
            UIAnimator.Scale(RectTransform, this.ShowBehavior.Animation, scaleFrom, scaleTo, instantAction); //initialize and play the SHOW Scale tween

            //FADE
            float fadeFrom = UIAnimator.GetAnimationFadeFrom(this.ShowBehavior.Animation, 1f);
            float fadeTo = UIAnimator.GetAnimationFadeTo(this.ShowBehavior.Animation, 1f);
            if (!this.ShowBehavior.Animation.Fade.Enabled || instantAction)
            {
                ResetAlpha();
            }
            UIAnimator.Fade(RectTransform, this.ShowBehavior.Animation, fadeFrom, fadeTo, instantAction); //initialize and play the SHOW Fade tween
            
            VisibilityState = VisibilityState.Showing; //update the visibility state
            OnShowing();
            this.ShowBehavior.OnStart.Invoke(gameObject, !instantAction, !instantAction);
           
            if (!instantAction) //wait for the animation to finish
            {
                yield return new WaitForSecondsRealtime(this.ShowBehavior.Animation.TotalDuration);
            }

            this.ShowBehavior.OnFinished.Invoke(gameObject, !instantAction, !instantAction);

            _showCoroutine = null;

            OnShowAnimCompleted();
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

            
        public void Hide(bool instantHide = false)
        {
#if UNITY_EDITOR
            Debug.Log("Hide Anim " + name);
#endif
            
            bool instantAction = instantHide;
            if (this.HideBehavior.InstantAnimation) instantAction = true;
            
            StopShow();
            
            if (!this.HideBehavior.Animation.Enabled && !instantAction)
            {
                Debug.LogError("You are trying to HIDE the (" + name + ") UIView, but you did not enable any HIDE animations. Enable at least one HIDE animation in order to fix this issue.");
                return; //no HIDE animations have been enabled -> cannot hide this UIPopup -> stop here
            }

            if (VisibilityState == VisibilityState.Hiding) return;

            _hideCoroutine = StartCoroutine(HideEnumerator(instantAction));
        }
         private IEnumerator HideEnumerator(bool instantAction)
        {
            UIAnimator.StopAnimations(RectTransform, this.HideBehavior.Animation.AnimationType); //stop any HIDE animations

            //MOVE
            Vector3 moveFrom = UIAnimator.GetAnimationMoveFrom(RectTransform, this.HideBehavior.Animation, Vector3.zero);
            Vector3 moveTo = UIAnimator.GetAnimationMoveTo(RectTransform,this. HideBehavior.Animation, Vector3.zero);
            if (!this.HideBehavior.Animation.Move.Enabled || instantAction)
                ResetPosition();
            UIAnimator.Move(RectTransform, this.HideBehavior.Animation, moveFrom, moveTo, instantAction); //initialize and play the HIDE Move tween

            //ROTATE
            Vector3 rotateFrom = UIAnimator.GetAnimationRotateFrom(this.HideBehavior.Animation, Vector3.zero);
            Vector3 rotateTo = UIAnimator.GetAnimationRotateTo(this.HideBehavior.Animation, Vector3.zero);
            if (!this.HideBehavior.Animation.Rotate.Enabled || instantAction)
                ResetRotation();
            UIAnimator.Rotate(RectTransform, this.HideBehavior.Animation, rotateFrom, rotateTo, instantAction); //initialize and play the HIDE Rotate tween

            //SCALE
            Vector3 scaleFrom = UIAnimator.GetAnimationScaleFrom(this.HideBehavior.Animation, Vector3.one);
            Vector3 scaleTo = UIAnimator.GetAnimationScaleTo(this.HideBehavior.Animation, Vector3.one);
            if (!this.HideBehavior.Animation.Scale.Enabled || instantAction) 
                ResetScale();
            UIAnimator.Scale(RectTransform, this.HideBehavior.Animation, scaleFrom, scaleTo, instantAction); //initialize and play the HIDE Scale tween

            //FADE
            float fadeFrom = UIAnimator.GetAnimationFadeFrom(this.HideBehavior.Animation, 1f);
            float fadeTo = UIAnimator.GetAnimationFadeTo(this.HideBehavior.Animation, 0f);
            if (!this.HideBehavior.Animation.Fade.Enabled || instantAction)
            {
                ResetAlpha();
            }
            UIAnimator.Fade(RectTransform, this.HideBehavior.Animation, fadeFrom, fadeTo, instantAction); //initialize and play the HIDE Fade tween

  
            VisibilityState = VisibilityState.Hiding;
            OnHiding();
            this.HideBehavior.OnStart.Invoke(gameObject, !instantAction, !instantAction);

            if (!instantAction) //wait for the animation to finish
            {
                 yield return new WaitForSecondsRealtime(this.HideBehavior.Animation.TotalDuration + 0.05f); //wait for seconds realtime (ignore Unity's Time.Timescale)
            }

            this.HideBehavior.OnFinished.Invoke(gameObject, !instantAction, !instantAction);
            
            _hideCoroutine = null; //clear the coroutine reference
 
            OnTweenHideCompleted();
        }

        

      
         void OnTweenHideCompleted()
        {
            VisibilityState = VisibilityState.Hidden;
            //UIManager.Instance.RemoveUIFromListBackButton(this);
           
            OnHidden();

            if (this.DeactiveGameObjectWhenHide)
                gameObject.SetActive(false);
            else
            {
                Canvas.enabled = false;
                GraphicRaycaster.enabled = false;
                //gameObject.SetActive(false)          
            }
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
    }
}