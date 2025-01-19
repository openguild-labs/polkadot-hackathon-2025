// Copyright (c) 2015 - 2019 Imba
// Author: Kaka
// Created: 2019/08
using System;
using System.Collections;
using System.Collections.Generic;
using Imba.UI.Animation;
using UnityEngine;
using UnityEngine.Events;

namespace Imba.UI
{
    
    public enum UIButtonBehaviorType
    {

        OnClick,

        OnDoubleClick,

        OnLongClick,

        OnPointerEnter,

        OnPointerExit,

        OnPointerDown,

        OnPointerUp
    }

    [Serializable]
    public class UIButtonBehavior
    {
        #region Constants
        #endregion

        #region Static Fields
        #endregion

        #region Events
        #endregion

        #region Public Vars
        
        /// <summary> Toggles this behavior </summary>
        public bool Enabled;
        
        /// <summary> Determines what type of animation is enabled on this behavior </summary>
        public ButtonAnimationType ButtonAnimationType;
        
        [HideInInspector]
        /// <summary> Keeps track if this behavior is ready to get fired again. This is needed if a disable interval has been set </summary>
        public bool Ready;
        
        [HideInInspector]
        /// <summary> Time interval after this behavior has been fired while it cannot be fired again (works only for OnPointerEnter and OnPointerExit) </summary>
        public float DisableInterval;
        
        /// <summary> Actions executed when the behavior is triggered </summary>
        public UIAction OnTrigger;

        /// <summary> Punch animation settings </summary>
        public UIAnimation PunchAnimation;
        
        /// <summary> State animation settings </summary>
        public UIAnimation StateAnimation;
        
        #endregion

        #region Private Vars

        private UIButtonBehaviorType _behaviorType;
        
        
        #endregion

        #region Properties

        #endregion

        #region Constructors
        public UIButtonBehavior(UIButtonBehaviorType behaviorType, bool enabled = false)
        {
            Reset(behaviorType);
            Enabled = enabled;
        }

        public UIButtonBehaviorType BehaviorType
        {
            get { return _behaviorType; }
        }

        #endregion


        #region Public Methods
        /// <summary> Resets this instance to the default values </summary>
        /// <param name="behaviorType"> Behavior type </param>
        public void Reset(UIButtonBehaviorType behaviorType)
        {
            _behaviorType = behaviorType;
            Enabled = false;
            Ready = true;
            DisableInterval = 0.4f;
            ButtonAnimationType = ButtonAnimationType.Punch;
            PunchAnimation = new UIAnimation(AnimationType.Punch);
            StateAnimation = new UIAnimation(AnimationType.State);
            OnTrigger = new UIAction();
        }

        public void PlayAnimation(UIButton button, bool withSound = true, UnityAction onStartCallback = null,
            UnityAction onCompleteCallback = null)
        {

            switch (ButtonAnimationType)
            {
                case ButtonAnimationType.Punch:
                    if (PunchAnimation == null) return;

                    //UIManager.DebugLog("PlayAnimation " + button.name, this);

                    UIAnimator.StopAnimations(button.RectTransform, AnimationType.Punch);

                    if (PunchAnimation.Move.Enabled) button.ResetPosition();
                    if (PunchAnimation.Rotate.Enabled) button.ResetRotation();
                    if (PunchAnimation.Scale.Enabled) button.ResetScale();

                    UIAnimator.MovePunch(button.RectTransform, PunchAnimation,
                        button.StartPosition); //play the move punch animation
                    UIAnimator.RotatePunch(button.RectTransform, PunchAnimation,
                        button.StartRotation); //play the rotate punch animation
                    UIAnimator.ScalePunch(button.RectTransform, PunchAnimation,
                        button.StartScale); //play the scale punch animation
                    button.StartCoroutine(InvokeCallbacks(PunchAnimation, onStartCallback, onCompleteCallback));
                    break;
                case ButtonAnimationType.State:
                    if (StateAnimation == null) return;

                    UIManager.DebugLog("PlayAnimation " + button.name, this);

                    UIAnimator.StopAnimations(button.RectTransform, AnimationType.State);

                    UIAnimator.MoveState(button.RectTransform, StateAnimation,
                        button.StartPosition); //play the move state animation
                    UIAnimator.RotateState(button.RectTransform, StateAnimation,
                        button.StartRotation); //play the rotate state animation
                    UIAnimator.ScaleState(button.RectTransform, StateAnimation,
                        button.StartScale); //play the scale state animation
                    UIAnimator.FadeState(button.RectTransform, StateAnimation, button.StartAlpha);
                    button.StartCoroutine(InvokeCallbacks(StateAnimation, onStartCallback, onCompleteCallback));
                    break;
            }

            if (withSound) OnTrigger.PlaySound();
        }

        #endregion

        #region Private Methods

        private static IEnumerator InvokeCallbacks(UIAnimation animation, UnityAction onStartCallback, UnityAction onCompleteCallback)
        {
            if (animation == null || !animation.Enabled) yield break;
            yield return new WaitForSecondsRealtime(animation.StartDelay);
            if (onStartCallback != null) onStartCallback.Invoke();
            yield return new WaitForSecondsRealtime(animation.TotalDuration - animation.StartDelay);
            if (onCompleteCallback != null) onCompleteCallback.Invoke();
        }

        #endregion

        #region Virtual Methods

        #endregion

        #region Static Methods

        #endregion
    }
}