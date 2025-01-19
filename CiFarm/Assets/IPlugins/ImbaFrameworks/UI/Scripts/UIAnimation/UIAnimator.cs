// Copyright (c) 2015 - 2019 Imba
// Author: Kaka
// Created: 2019/08

using DG.Tweening;
using Imba.UI;
using UnityEngine;
using UnityEngine.Events;

namespace Imba.UI.Animation
{
    public static class UIAnimator
    {
        #region Tweens

        #region MoveTween, MoveLoopTween, MovePunchTween, MoveStateTween

        /// <summary> Returns tween that animates a position from a start value to an end value </summary>
        /// <param name="target"> Target RectTransform </param>
        /// <param name="animation"> Animation settings </param>
        /// <param name="startValue"> Start position </param>
        /// <param name="endValue"> End position </param>
        public static Tween MoveTween(RectTransform target, UIAnimation animation, Vector3 startValue, Vector3 endValue)
        {
            target.anchoredPosition3D = startValue;
            Tweener tween = target.DOAnchorPos3D(endValue, animation.Move.Duration)
                                  .SetDelay(animation.Move.StartDelay)
                                  .SetUpdate(true)
                                  .SetSpeedBased(false);
            tween.SetEase(animation.Move.Ease);
            return tween;
        }

        /// <summary> Returns a start position for a move loop animation </summary>
        /// <param name="animation"> Animation settings </param>
        /// <param name="startValue"> Start position </param>
        public static Vector3 MoveLoopPositionA(UIAnimation animation, Vector3 startValue) { return startValue - animation.Move.By; }

        /// <summary> Returns an end position for a move loop animation </summary>
        /// <param name="animation"> Animation settings </param>
        /// <param name="startValue"> Start position </param>
        public static Vector3 MoveLoopPositionB(UIAnimation animation, Vector3 startValue) { return startValue + animation.Move.By; }

        /// <summary> Returns tween that animates a position in a loop </summary>
        /// <param name="target"> Target RectTransform </param>
        /// <param name="animation"> Animation settings </param>
        /// <param name="startValue"> Start position </param>
        public static Tween MoveLoopTween(RectTransform target, UIAnimation animation, Vector3 startValue)
        {
            Tween loopTween = target.DOAnchorPos(MoveLoopPositionB(animation, startValue), animation.Move.Duration)
                                    .SetUpdate(true)
                                    .SetSpeedBased(false)
                                    .SetLoops(animation.Move.NumberOfLoops, animation.Move.LoopType);
            loopTween.SetEase(animation.Move.Ease);
            return loopTween;
        }

        /// <summary> Returns a tween that animates a position with a fast animation that returns to the start values when finished </summary>
        /// <param name="target"> Target RectTransform </param>
        /// <param name="animation"> Animation settings </param>
        public static Tween MovePunchTween(RectTransform target, UIAnimation animation)
        {
            UIManager.DebugLog("MovePunchTween", animation);
            return target.DOPunchAnchorPos(animation.Move.By, animation.Move.Duration, animation.Move.Vibrato, animation.Move.Elasticity)
                         .SetDelay(animation.Move.StartDelay)
                         .SetUpdate(true)
                         .SetSpeedBased(false);
        }

        /// <summary> Returns a tween that animates a position from its current value to a target value </summary>
        /// <param name="target"> Target RectTransform </param>
        /// <param name="animation"> Animation settings </param>
        /// <param name="startValue"> Start position </param>
        public static Tween MoveStateTween(RectTransform target, UIAnimation animation, Vector3 startValue)
        {
            UIManager.DebugLog("MoveStateTween", animation);
            Tween tween = target.DOAnchorPos(startValue + animation.Move.By, animation.Move.Duration)
                                .SetDelay(animation.Move.StartDelay)
                                .SetUpdate(true)
                                .SetSpeedBased(false);
            tween.SetEase(animation.Move.Ease);
            return tween;
        }

        #endregion

        #region RotateTween, RotateLoopTween, RotatePunchTween, RotateStateTween

        /// <summary> Returns tween that animates a rotation from a start value to an end value </summary>
        /// <param name="target"> Target RectTransform </param>
        /// <param name="animation"> Animation settings </param>
        /// <param name="startValue"> Start rotation</param>
        /// <param name="endValue"> End rotation </param>
        public static Tween RotateTween(RectTransform target, UIAnimation animation, Vector3 startValue, Vector3 endValue)
        {
            UIManager.DebugLog("RotateTween", animation);
            target.localRotation = Quaternion.Euler(startValue);
            Tweener tween = target.DOLocalRotate(endValue, animation.Rotate.Duration, animation.Rotate.RotateMode)
                                  .SetDelay(animation.Rotate.StartDelay)
                                  .SetUpdate(true)
                                  .SetSpeedBased(false);
            tween.SetEase(animation.Rotate.Ease);
            return tween;
        }

        /// <summary> Returns a start rotation for a rotate loop animation </summary>
        /// <param name="animation"> Animation settings </param>
        /// <param name="startValue"> Start rotation </param>
        public static Vector3 RotateLoopRotationA(UIAnimation animation, Vector3 startValue) { return startValue - animation.Rotate.By; }

        /// <summary> Returns an end rotation for a rotate loop animation </summary>
        /// <param name="animation"> Animation settings </param>
        /// <param name="startValue"> Start rotation </param>
        public static Vector3 RotateLoopRotationB(UIAnimation animation, Vector3 startValue) { return startValue + animation.Rotate.By; }

        /// <summary> Returns tween that animates a rotation in a loop </summary>
        /// <param name="target"> Target RectTransform </param>
        /// <param name="animation"> Animation settings </param>
        /// <param name="startValue"> Start rotation </param>
        public static Tween RotateLoopTween(RectTransform target, UIAnimation animation, Vector3 startValue)
        {
            UIManager.DebugLog("RotateLoopTween", animation);
            Tween loopTween = target.DOLocalRotate(RotateLoopRotationB(animation, startValue), animation.Rotate.Duration, animation.Rotate.RotateMode)
                                    .SetUpdate(true)
                                    .SetSpeedBased(false)
                                    .SetLoops(animation.Rotate.NumberOfLoops, animation.Rotate.LoopType);
            loopTween.SetEase(animation.Rotate.Ease);
            return loopTween;
        }

        /// <summary> Returns a tween that animates a rotation with a fast animation that returns to the start values when finished </summary>
        /// <param name="target"> Target RectTransform </param>
        /// <param name="animation"> Animation settings </param>
        public static Tween RotatePunchTween(RectTransform target, UIAnimation animation)
        {
            UIManager.DebugLog("RotatePunchTween", animation);
            return target.DOPunchRotation(animation.Rotate.By, animation.Rotate.Duration, animation.Rotate.Vibrato, animation.Rotate.Elasticity)
                         .SetDelay(animation.Rotate.StartDelay)
                         .SetUpdate(true)
                         .SetSpeedBased(false);
        }

        /// <summary> Returns a tween that animates a rotation from its current value to a target value </summary>
        /// <param name="target"> Target RectTransform </param>
        /// <param name="animation"> Animation settings </param>
        /// <param name="startValue"> Start rotation </param>
        public static Tween RotateStateTween(RectTransform target, UIAnimation animation, Vector3 startValue)
        {
            UIManager.DebugLog("RotateStateTween", animation);
            Tween tween = target.DOLocalRotate(startValue + animation.Rotate.By, animation.Rotate.Duration, animation.Rotate.RotateMode)
                                .SetDelay(animation.Rotate.StartDelay)
                                .SetUpdate(true)
                                .SetSpeedBased(false);
            tween.SetEase(animation.Rotate.Ease);
            return tween;
        }

        #endregion

        #region ScaleTween, ScaleLoopTween, ScalePunchTween, ScaleStateTween

        /// <summary> Returns tween that animates a scale from a start value to an end value </summary>
        /// <param name="target"> Target RectTransform </param>
        /// <param name="animation"> Animation settings </param>
        /// <param name="startValue"> Start scale</param>
        /// <param name="endValue"> End scale </param>
        public static Tween ScaleTween(RectTransform target, UIAnimation animation, Vector3 startValue, Vector3 endValue)
        {
            //UIManager.DebugLog("ScaleTween", animation);
            startValue.z = 1f;
            endValue.z = 1f;
            target.localScale = startValue;
            Tweener tween = target.DOScale(endValue, animation.Scale.Duration)
                                  .SetDelay(animation.Scale.StartDelay)
                                  .SetUpdate(true)
                                  .SetSpeedBased(false);

            tween.SetEase(animation.Scale.Ease);

            return tween;
        }

        /// <summary> Returns tween that animates a scale in a loop </summary>
        /// <param name="target"> Target RectTransform </param>
        /// <param name="animation"> Animation settings </param>
        public static Tween ScaleLoopTween(RectTransform target, UIAnimation animation)
        {
            //UIManager.DebugLog("ScaleLoopTween", animation);
            animation.Scale.From.z = 1f;
            animation.Scale.To.z = 1f;
            Tweener loopTween = target.DOScale(animation.Scale.To, animation.Scale.Duration)
                                      .SetUpdate(true)
                                      .SetSpeedBased(false)
                                      .SetLoops(animation.Scale.NumberOfLoops, animation.Scale.LoopType);
            loopTween.SetEase(animation.Scale.Ease);
            return loopTween;
        }

        /// <summary> Returns a tween that animates a scale with a fast animation that returns to the start values when finished </summary>
        /// <param name="target"> Target RectTransform </param>
        /// <param name="animation"> Animation settings </param>
        public static Tween ScalePunchTween(RectTransform target, UIAnimation animation)
        {
            //UIManager.DebugLog("ScalePunchTween", animation);
            animation.Scale.By.z = 0f;
            return target.DOPunchScale(animation.Scale.By, animation.Scale.Duration, animation.Scale.Vibrato, animation.Scale.Elasticity)
                         .SetDelay(animation.Scale.StartDelay)
                         .SetUpdate(true)
                         .SetSpeedBased(false);
        }

        /// <summary> Returns a tween that animates a scale from its current value to a target value </summary>
        /// <param name="target"> Target RectTransform </param>
        /// <param name="animation"> Animation settings </param>
        /// <param name="startValue"> Start scale </param>
        public static Tween ScaleStateTween(RectTransform target, UIAnimation animation, Vector3 startValue)
        {
            UIManager.DebugLog("ScaleStateTween", animation);
            animation.Scale.By.z = 0f;
            Tween tween = target.DOScale(startValue + animation.Scale.By, animation.Scale.Duration)
                                .SetDelay(animation.Scale.StartDelay)
                                .SetUpdate(true)
                                .SetSpeedBased(false);
            tween.SetEase(animation.Scale.Ease);
            return tween;
        }

        #endregion

        #region FadeTween, FadeLoopTween, FadeStateTween

        /// <summary> Returns tween that animates an alpha value from a start value to an end value </summary>
        /// <param name="target"> Target RectTransform </param>
        /// <param name="animation"> Animation settings </param>
        /// <param name="startValue"> Start alpha </param>
        /// <param name="endValue"> End alpha </param>
        public static Tween FadeTween(RectTransform target, UIAnimation animation, float startValue, float endValue)
        {
            //UIManager.DebugLog("FadeTween", animation);
            startValue = Mathf.Clamp01(startValue);
            endValue = Mathf.Clamp01(endValue);
            CanvasGroup canvasGroup = target.GetComponent<CanvasGroup>() ?? target.gameObject.AddComponent<CanvasGroup>();
            canvasGroup.alpha = startValue;
            Tweener tween = canvasGroup.DOFade(endValue, animation.Fade.Duration)
                                       .SetDelay(animation.Fade.StartDelay)
                                       .SetUpdate(true)
                                       .SetSpeedBased(false);

            tween.SetEase(animation.Fade.Ease);
            return tween;
        }

        /// <summary> Returns tween that animates an alpha value in a loop </summary>
        /// <param name="target"> Target RectTransform </param>
        /// <param name="animation"> Animation settings </param>
        public static Tween FadeLoopTween(RectTransform target, UIAnimation animation)
        {
            //UIManager.DebugLog("FadeLoopTween", animation);
            animation.Fade.From = Mathf.Clamp01(animation.Fade.From);
            animation.Fade.To = Mathf.Clamp01(animation.Fade.To);
            CanvasGroup canvasGroup = target.GetComponent<CanvasGroup>() != null ? target.GetComponent<CanvasGroup>() : target.gameObject.AddComponent<CanvasGroup>();
            Tweener loopTween = canvasGroup.DOFade(animation.Fade.To, animation.Fade.Duration)
                                           .SetUpdate(true)
                                           .SetSpeedBased(false)
                                           .SetLoops(animation.Fade.NumberOfLoops, animation.Fade.LoopType);
            loopTween.SetEase(animation.Fade.Ease);
            return loopTween;
        }

        /// <summary> Returns a tween that animates an alpha value from its current value to a target value </summary>
        /// <param name="target"> Target RectTransform </param>
        /// <param name="animation"> Animation settings </param>
        /// <param name="startValue"> Start alpha </param>
        public static Tween FadeStateTween(RectTransform target, UIAnimation animation, float startValue)
        {
            //UIManager.DebugLog("FadeStateTween", animation);
            CanvasGroup canvasGroup = target.GetComponent<CanvasGroup>() != null ? target.GetComponent<CanvasGroup>() : target.gameObject.AddComponent<CanvasGroup>();
            float targetAlpha = startValue + animation.Fade.By;
            targetAlpha = Mathf.Clamp01(targetAlpha);
            Tween tween = canvasGroup.DOFade(targetAlpha, animation.Fade.Duration)
                                     .SetDelay(animation.Fade.StartDelay)
                                     .SetUpdate(true)
                                     .SetSpeedBased(false);
            tween.SetEase(animation.Fade.Ease);
            return tween;
        }

        #endregion

        #endregion

        #region Animations

        #region Move, Rotate, Scale, Fade

        /// <summary> Moves the specified target by animating the anchoredPosition3D value </summary>
        /// <param name="target"> Target RectTransform </param>
        /// <param name="animation"> Animation settings </param>
        /// <param name="startValue"> Start position </param>
        /// <param name="endValue"> End position </param>
        /// <param name="instantAction"> Determines if the animation should happen instantly (in zero seconds) </param>
        /// <param name="onStartCallback"> Callback executed when the animation starts playing </param>
        /// <param name="onCompleteCallback"> Callback executed when the animation completed playing </param>
        public static void Move(RectTransform target, UIAnimation animation, Vector3 startValue, Vector3 endValue, bool instantAction = false, UnityAction onStartCallback = null, UnityAction onCompleteCallback = null)
        {
            //UIManager.DebugLog("Move", animation);
            if (!animation.Move.Enabled && !instantAction) return;
            
            if (instantAction)
            {
                target.anchoredPosition3D = endValue;
                if (onStartCallback != null) onStartCallback.Invoke();
                if (onCompleteCallback != null) onCompleteCallback.Invoke();
                return;
            }

            DOTween.Sequence()
                   .SetId(GetTweenId(target, animation.AnimationType, AnimationAction.Move))
                   .SetUpdate(true)
                   .SetSpeedBased(false)
                   .OnStart(() =>
                            {
                                if (onStartCallback != null) onStartCallback.Invoke();
                            })
                   .OnComplete(() =>
                               {
                                   if (onCompleteCallback != null) onCompleteCallback.Invoke();
                               })
                   .Append(MoveTween(target, animation, startValue, endValue))
                   .Play();
        }

        /// <summary> Rotates the specified target by animating the localRotation value </summary>
        /// <param name="target"> Target RectTransform </param>
        /// <param name="animation"> Animation settings </param>
        /// <param name="startValue"> Start rotation </param>
        /// <param name="endValue"> End rotation </param>
        /// <param name="instantAction"> Determines if the animation should happen instantly (in zero seconds) </param>
        /// <param name="onStartCallback"> Callback executed when the animation starts playing </param>
        /// <param name="onCompleteCallback">  Callback executed when the animation completed playing </param>
        public static void Rotate(RectTransform target, UIAnimation animation, Vector3 startValue, Vector3 endValue, bool instantAction = false, UnityAction onStartCallback = null, UnityAction onCompleteCallback = null)
        {
            //UIManager.DebugLog("Rotate", animation);
            if (!animation.Rotate.Enabled && !instantAction) return;
            
            if (instantAction)
            {
                target.localRotation = Quaternion.Euler(endValue);
                if (onStartCallback != null) onStartCallback.Invoke();
                if (onCompleteCallback != null) onCompleteCallback.Invoke();
                return;
            }

            DOTween.Sequence()
                   .SetId(GetTweenId(target, animation.AnimationType, AnimationAction.Rotate))
                   .SetUpdate(true)
                   .SetSpeedBased(false)
                   .OnStart(() =>
                            {
                                if (onStartCallback != null) onStartCallback.Invoke();
                            })
                   .OnComplete(() =>
                               {
                                   if (onCompleteCallback != null) onCompleteCallback.Invoke();
                               })
                   .Append(RotateTween(target, animation, startValue, endValue))
                   .Play();
        }

        /// <summary> Scales the specified target by animating the localScale value </summary>
        /// <param name="target"> Target RectTransform </param>
        /// <param name="animation"> Animation settings </param>
        /// <param name="startValue"> Start scale </param>
        /// <param name="endValue"> End scale </param>
        /// <param name="instantAction"> Determines if the animation should happen instantly (in zero seconds) </param>
        /// <param name="onStartCallback"> Callback executed when the animation starts playing </param>
        /// <param name="onCompleteCallback">  Callback executed when the animation completed playing </param>
        public static void Scale(RectTransform target, UIAnimation animation, Vector3 startValue, Vector3 endValue, bool instantAction = false, UnityAction onStartCallback = null, UnityAction onCompleteCallback = null)
        {
            //UIManager.DebugLog("Scale", animation);
            if (!animation.Scale.Enabled && !instantAction) return;

            startValue.z = 1;
            endValue.z = 1;
            if (instantAction)
            {
                target.localScale = endValue;
                if (onStartCallback != null) onStartCallback.Invoke();
                if (onCompleteCallback != null) onCompleteCallback.Invoke();
                return;
            }

            DOTween.Sequence()
                   .SetId(GetTweenId(target, animation.AnimationType, AnimationAction.Scale))
                   .SetUpdate(true)
                   .SetSpeedBased(false)
                   .OnStart(() =>
                            {
                                if (onStartCallback != null) onStartCallback.Invoke();
                            })
                   .OnComplete(() =>
                               {
                                   if (onCompleteCallback != null) onCompleteCallback.Invoke();
                               })
                   .Append(ScaleTween(target, animation, startValue, endValue))
                   .Play();
        }

        /// <summary> Fades a CanvasGroup attached to the specified target by animating an alpha value. If a CanvasGroup is not attached to the target, one will be automatically attached in order to perform the fade animation </summary>
        /// <param name="target"> Target RectTransform </param>
        /// <param name="animation"> Animation settings </param>
        /// <param name="startValue"> Start alpha value (transparency) </param>
        /// <param name="endValue"> End alpha value (transparency) </param>
        /// <param name="instantAction"> Determines if the animation should happen instantly (in zero seconds) </param>
        /// <param name="onStartCallback"> Callback executed when the animation starts playing </param>
        /// <param name="onCompleteCallback">  Callback executed when the animation completed playing </param>
        public static void Fade(RectTransform target, UIAnimation animation, float startValue, float endValue, bool instantAction = false, UnityAction onStartCallback = null, UnityAction onCompleteCallback = null)
        {
            //UIManager.DebugLog("Fade", animation);
            if (!animation.Fade.Enabled && !instantAction) return;
            
            CanvasGroup canvasGroup = target.GetComponent<CanvasGroup>() ?? target.gameObject.AddComponent<CanvasGroup>();
            if (instantAction)
            {
                canvasGroup.alpha = endValue;
                if (onStartCallback != null) onStartCallback.Invoke();
                if (onCompleteCallback != null) onCompleteCallback.Invoke();
                return;
            }

            DOTween.Sequence()
                   .SetId(GetTweenId(target, animation.AnimationType, AnimationAction.Fade))
                   .SetUpdate(true)
                   .SetSpeedBased(false)
                   .OnStart(() =>
                            {
                                if (onStartCallback != null) onStartCallback.Invoke();
                            })
                   .OnComplete(() =>
                               {
                                   if (onCompleteCallback != null) onCompleteCallback.Invoke();
                               })
                   .Append(FadeTween(target, animation, startValue, endValue))
                   .Play();
        }

        #endregion

        #region MoveLoop, RotateLoop, ScaleLoop, FadeLoop

        /// <summary> Moves the specified target by animating the anchoredPosition3D value in a loop </summary>
        /// <param name="target"> Target RectTransform </param>
        /// <param name="animation"> Animation settings  </param>
        /// <param name="startValue"> Start anchoredPosition3D for the animation </param>
        /// <param name="onStartCallback"> Callback executed when the animation starts playing </param>
        /// <param name="onCompleteCallback"> Callback executed when the animation completed playing </param>
        public static void MoveLoop(RectTransform target, UIAnimation animation, Vector3 startValue, UnityAction onStartCallback = null, UnityAction onCompleteCallback = null)
        {
            UIManager.DebugLog("MoveLoop", animation);
            if (!animation.Move.Enabled) return;
            if (animation.AnimationType != AnimationType.Loop) return;

            // positionA <---> startPosition <---> positionB
            Vector3 positionA = MoveLoopPositionA(animation, startValue);
//            Vector3 positionB = MoveLoopPositionB(animation, startValue);

            Sequence loopSequence = DOTween.Sequence()
                                           .SetId(GetTweenId(target, animation.AnimationType, AnimationAction.Move))
                                           .SetUpdate(true)
                                           .SetSpeedBased(false)
                                           .Append(MoveLoopTween(target, animation, startValue))
                                           .SetLoops(animation.Move.NumberOfLoops, animation.Move.LoopType)
                                           .OnComplete(() =>
                                                       {
                                                           if (onCompleteCallback != null) onCompleteCallback.Invoke();
                                                       })
                                           .OnKill(() =>
                                                   {
                                                       if (onCompleteCallback != null) onCompleteCallback.Invoke();
                                                   })
                                           .Pause();


            Tween startTween = target.DOAnchorPos(positionA, animation.Move.Duration / 2f)
                                     .SetDelay(animation.Move.StartDelay)
                                     .SetUpdate(true)
                                     .SetSpeedBased(false)
                                     .Pause();


            DOTween.Sequence()
                   .SetId(GetTweenId(target, animation.AnimationType, AnimationAction.Move))
                   .SetUpdate(true)
                   .SetSpeedBased(false)
                   .Append(startTween)
                   .OnStart(() =>
                            {
                                if (onStartCallback != null) onStartCallback.Invoke();
                            })
                   .OnComplete(() =>
                               {
                                   loopSequence.Play();
                               });
        }

        /// <summary> Rotates the specified target by animating the localRotation value in a loop </summary>
        /// <param name="target"> Target RectTransform </param>
        /// <param name="animation"> Animation settings </param>
        /// <param name="startValue"> Start local rotation for the animation </param>
        /// <param name="onStartCallback"> Callback executed when the animation starts playing </param>
        /// <param name="onCompleteCallback"> Callback executed when the animation completed playing </param>
        public static void RotateLoop(RectTransform target, UIAnimation animation, Vector3 startValue, UnityAction onStartCallback = null, UnityAction onCompleteCallback = null)
        {
            UIManager.DebugLog("RotateLoop", animation);
            if (!animation.Rotate.Enabled) return;
            if (animation.AnimationType != AnimationType.Loop) return;

            // rotationA <---> startRotation <---> rotationB
            Vector3 rotationA = RotateLoopRotationA(animation, startValue);
//            Vector3 rotationB = RotateLoopRotationB(animation, startValue);

            Sequence loopSequence = DOTween.Sequence()
                                           .SetId(GetTweenId(target, animation.AnimationType, AnimationAction.Rotate))
                                           .SetUpdate(true)
                                           .SetSpeedBased(false)
                                           .Append(RotateLoopTween(target, animation, startValue))
                                           .SetLoops(animation.Rotate.NumberOfLoops, animation.Rotate.LoopType)
                                           .OnComplete(() =>
                                                       {
                                                           if (onCompleteCallback != null) onCompleteCallback.Invoke();
                                                       })
                                           .OnKill(() =>
                                                   {
                                                       if (onCompleteCallback != null) onCompleteCallback.Invoke();
                                                   })
                                           .Pause();

            Tween startTween = target.DOLocalRotate(rotationA, animation.Rotate.Duration / 2f, animation.Rotate.RotateMode)
                                     .SetDelay(animation.Rotate.StartDelay)
                                     .SetUpdate(true)
                                     .SetSpeedBased(false)
                                     .Pause();


            DOTween.Sequence()
                   .SetId(GetTweenId(target, animation.AnimationType, AnimationAction.Rotate))
                   .SetUpdate(true)
                   .SetSpeedBased(false)
                   .Append(startTween)
                   .OnStart(() =>
                            {
                                if (onStartCallback != null) onStartCallback.Invoke();
                            })
                   .OnComplete(() =>
                               {
                                   loopSequence.Play();
                               });
        }

        /// <summary> Scales the specified target by animating the localScale value in a loop </summary>
        /// <param name="target"> Target RectTransform </param>
        /// <param name="animation"> Animation settings </param>
        /// <param name="onStartCallback"> Callback executed when the animation starts playing </param>
        /// <param name="onCompleteCallback"> Callback executed when the animation completed playing </param>
        public static void ScaleLoop(RectTransform target, UIAnimation animation, UnityAction onStartCallback = null, UnityAction onCompleteCallback = null)
        {
            UIManager.DebugLog("ScaleLoop", animation);
            if (!animation.Scale.Enabled) return;
            if (animation.AnimationType != AnimationType.Loop) return;

            Sequence loopSequence = DOTween.Sequence()
                                           .SetId(GetTweenId(target, animation.AnimationType, AnimationAction.Scale))
                                           .SetUpdate(true)
                                           .SetSpeedBased(false)
                                           .Append(ScaleLoopTween(target, animation))
                                           .SetLoops(animation.Scale.NumberOfLoops, animation.Scale.LoopType)
                                           .OnComplete(() =>
                                                       {
                                                           if (onCompleteCallback != null) onCompleteCallback.Invoke();
                                                       })
                                           .OnKill(() =>
                                                   {
                                                       if (onCompleteCallback != null) onCompleteCallback.Invoke();
                                                   })
                                           .Pause();


            Tween startTween = target.DOScale(animation.Scale.From, animation.Scale.Duration / 2f)
                                     .SetDelay(animation.Scale.StartDelay)
                                     .SetUpdate(true)
                                     .SetSpeedBased(false)
                                     .Pause();


            DOTween.Sequence()
                   .SetId(GetTweenId(target, animation.AnimationType, AnimationAction.Scale))
                   .SetUpdate(true)
                   .SetSpeedBased(false)
                   .Append(startTween)
                   .OnStart(() =>
                            {
                                if (onStartCallback != null) onStartCallback.Invoke();
                            })
                   .OnComplete(() =>
                               {
                                   loopSequence.Play();
                               });
        }

        /// <summary>
        ///     Fades a CanvasGroup attached to the specified target by animating an alpha value in a loop.
        ///     If a CanvasGroup is not attached to the target, one will be automatically attached in order to perform the fade animation
        /// </summary>
        /// <param name="target"> Target RectTransform </param>
        /// <param name="animation"> Animation settings </param>
        /// <param name="onStartCallback"> Callback executed when the animation starts playing </param>
        /// <param name="onCompleteCallback"> Callback executed when the animation completed playing </param>
        public static void FadeLoop(RectTransform target, UIAnimation animation, UnityAction onStartCallback = null, UnityAction onCompleteCallback = null)
        {
            UIManager.DebugLog("FadeLoop", animation);
            if (!animation.Fade.Enabled) return;
            if (animation.AnimationType != AnimationType.Loop) return;

            CanvasGroup canvasGroup = target.GetComponent<CanvasGroup>() != null ? target.GetComponent<CanvasGroup>() : target.gameObject.AddComponent<CanvasGroup>();

            Sequence loopSequence = DOTween.Sequence()
                                           .SetId(GetTweenId(target, animation.AnimationType, AnimationAction.Fade))
                                           .SetUpdate(true)
                                           .SetSpeedBased(false)
                                           .Append(FadeLoopTween(target, animation))
                                           .SetLoops(animation.Fade.NumberOfLoops, animation.Fade.LoopType)
                                           .OnComplete(() =>
                                                       {
                                                           if (onCompleteCallback != null) onCompleteCallback.Invoke();
                                                       })
                                           .OnKill(() =>
                                                   {
                                                       if (onCompleteCallback != null) onCompleteCallback.Invoke();
                                                   })
                                           .Pause();


            Tween startTween = canvasGroup.DOFade(animation.Fade.From, animation.Fade.Duration / 2f)
                                          .SetDelay(animation.Fade.StartDelay)
                                          .SetUpdate(true)
                                          .SetSpeedBased(false)
                                          .Pause();


            DOTween.Sequence()
                   .SetId(GetTweenId(target, animation.AnimationType, AnimationAction.Fade))
                   .SetUpdate(true)
                   .SetSpeedBased(false)
                   .Append(startTween)
                   .OnStart(() =>
                            {
                                if (onStartCallback != null) onStartCallback.Invoke();
                            })
                   .OnComplete(() =>
                               {
                                   loopSequence.Play();
                               });
        }

        #endregion

        #region MovePunch, RotatePunch, ScalePunch

        /// <summary> Punches a RectTransform's localScale towards the given scale (using the by value of the animation) and then back to the starting one as if it was connected to the starting scale via an elastic </summary>
        /// <param name="target"> Target RectTransform </param>
        /// <param name="animation"> Animation settings </param>
        /// <param name="startValue"> Start scale (initial scale) </param>
        /// <param name="onStartCallback"> Callback executed when the animation starts playing </param>
        /// <param name="onCompleteCallback"> Callback executed when the animation completed playing </param>
        public static void ScalePunch(RectTransform target, UIAnimation animation, Vector3 startValue, UnityAction onStartCallback = null, UnityAction onCompleteCallback = null)
        {
            if (!animation.Scale.Enabled) return;
            if (animation.AnimationType != AnimationType.Punch) return;

            //UIManager.DebugLog("ScalePunch", animation);
            
            DOTween.Sequence()
                .SetId(GetTweenId(target, animation.AnimationType, AnimationAction.Scale))
                .SetUpdate(true)
                .SetSpeedBased(false)
                .OnStart(() =>
                {
                    if (onStartCallback != null) onStartCallback.Invoke();
                })
                .OnComplete(() =>
                {
                    target.DOScale(startValue, 0.05f).OnComplete(() =>
                    {
                        if (onCompleteCallback != null) onCompleteCallback.Invoke();
                    }).Play();
                })
                .Append(ScalePunchTween(target, animation))
                .Play();
        }

        /// <summary> Punches a RectTransform's anchoredPosition towards the given position (using the by value of the animation) and then back to the starting one as if it was connected to the starting position via an elastic </summary>
        /// <param name="target"> Target RectTransform </param>
        /// <param name="animation"> Animation settings </param>
        /// <param name="startValue"> Start position (initial position) </param>
        /// <param name="onStartCallback"> Callback executed when the animation starts playing </param>
        /// <param name="onCompleteCallback"> Callback executed when the animation completed playing </param>
        public static void MovePunch(RectTransform target, UIAnimation animation, Vector3 startValue, UnityAction onStartCallback = null, UnityAction onCompleteCallback = null)
        {
            if (!animation.Move.Enabled) return;
            if (animation.AnimationType != AnimationType.Punch) return;

            //UIManager.DebugLog("MovePunch", animation);
            DOTween.Sequence()
                   .SetId(GetTweenId(target, animation.AnimationType, AnimationAction.Move))
                   .SetUpdate(true)
                   .SetSpeedBased(false)
                   .OnStart(() =>
                            {
                                if (onStartCallback != null) onStartCallback.Invoke();
                            })
                   .OnComplete(() =>
                               {
                                   target.DOAnchorPos(startValue, 0.05f)
                                         .OnComplete(() =>
                                                     {
                                                         if (onCompleteCallback != null) onCompleteCallback.Invoke();
                                                     }).Play();
                               })
                   .Append(MovePunchTween(target, animation))
                   .Play();
        }

        /// <summary> Punches a RectTransform's localRotation towards the given rotation (using the by value of the animation) and then back to the starting one as if it was connected to the starting rotation via an elastic </summary>
        /// <param name="target"> Target RectTransform </param>
        /// <param name="animation"> Animation settings </param>
        /// <param name="startValue"> Start rotation (initial rotation) </param>
        /// <param name="onStartCallback"> Callback executed when the animation starts playing </param>
        /// <param name="onCompleteCallback"> Callback executed when the animation completed playing </param>
        public static void RotatePunch(RectTransform target, UIAnimation animation, Vector3 startValue, UnityAction onStartCallback = null, UnityAction onCompleteCallback = null)
        {
            if (!animation.Rotate.Enabled) return;
            if (animation.AnimationType != AnimationType.Punch) return;

            //UIManager.DebugLog("RotatePunch", animation);
            
            DOTween.Sequence()
                   .SetId(GetTweenId(target, animation.AnimationType, AnimationAction.Rotate))
                   .SetUpdate(true)
                   .SetSpeedBased(false)
                   .OnStart(() =>
                            {
                                if (onStartCallback != null) onStartCallback.Invoke();
                            })
                   .OnComplete(() =>
                               {
                                   target.DOLocalRotate(startValue, 0.05f).OnComplete(() =>
                                                                                                          {
                                                                                                              if (onCompleteCallback != null) onCompleteCallback.Invoke();
                                                                                                          }).Play();
                               })
                   .Append(RotatePunchTween(target, animation))
                   .Play();
        }

        #endregion

        #region MoveState, RotateState, ScaleState, FadeState

        /// <summary> Moves the specified target by animating the anchoredPosition3D value from its current value to a target value </summary>
        /// <param name="target"> Target RectTransform </param>
        /// <param name="animation"> Animation settings </param>
        /// <param name="startValue"> Start position </param>
        /// <param name="onStartCallback"> Callback executed when the animation starts playing </param>
        /// <param name="onCompleteCallback"> Callback executed when the animation completed playing </param>
        public static void MoveState(RectTransform target, UIAnimation animation, Vector3 startValue, UnityAction onStartCallback = null, UnityAction onCompleteCallback = null)
        {
            if (!animation.Move.Enabled) return;
            if (animation.AnimationType != AnimationType.State) return;
            
            UIManager.DebugLog("MoveState", animation);

            DOTween.Sequence()
                   .SetId(GetTweenId(target, animation.AnimationType, AnimationAction.Move))
                   .SetUpdate(true)
                   .SetSpeedBased(false)
                   .OnStart(() =>
                            {
                                if (onStartCallback != null) onStartCallback.Invoke();
                            })
                   .OnComplete(() =>
                               {
                                   if (onCompleteCallback != null) onCompleteCallback.Invoke();
                               })
                   .Append(MoveStateTween(target, animation, startValue))
                   .Play();
        }

        /// <summary> Rotates the specified target by animating the localRotation value from its current value to a target value </summary>
        /// <param name="target"> Target RectTransform </param>
        /// <param name="animation"> Animation settings </param>
        /// <param name="startValue"> Start rotation </param>
        /// <param name="onStartCallback"> Callback executed when the animation starts playing </param>
        /// <param name="onCompleteCallback"> Callback executed when the animation completed playing </param>
        public static void RotateState(RectTransform target, UIAnimation animation, Vector3 startValue, UnityAction onStartCallback = null, UnityAction onCompleteCallback = null)
        {
            if (!animation.Rotate.Enabled) return;
            if (animation.AnimationType != AnimationType.State) return;

            UIManager.DebugLog("RotateState", animation);
            
            DOTween.Sequence()
                   .SetId(GetTweenId(target, animation.AnimationType, AnimationAction.Rotate))
                   .SetUpdate(true)
                   .SetSpeedBased(false)
                   .OnStart(() =>
                            {
                                if (onStartCallback != null) onStartCallback.Invoke();
                            })
                   .OnComplete(() =>
                               {
                                   if (onCompleteCallback != null) onCompleteCallback.Invoke();
                               })
                   .Append(RotateStateTween(target, animation, startValue))
                   .Play();
        }

        /// <summary> Scales the specified target by animating the localScale value from its current value to a target value </summary>
        /// <param name="target"> Target RectTransform </param>
        /// <param name="animation"> Animation settings </param>
        /// <param name="startValue"> Start scale </param>
        /// <param name="onStartCallback"> Callback executed when the animation starts playing </param>
        /// <param name="onCompleteCallback"> Callback executed when the animation completed playing </param>
        public static void ScaleState(RectTransform target, UIAnimation animation, Vector3 startValue, UnityAction onStartCallback = null, UnityAction onCompleteCallback = null)
        {
            if (!animation.Scale.Enabled) return;
            if (animation.AnimationType != AnimationType.State) return;

            UIManager.DebugLog("ScaleState", animation);
            
            DOTween.Sequence()
                   .SetId(GetTweenId(target, animation.AnimationType, AnimationAction.Scale))
                   .SetUpdate(true)
                   .SetSpeedBased(false)
                   .OnStart(() =>
                            {
                                if (onStartCallback != null) onStartCallback.Invoke();
                            })
                   .OnComplete(() =>
                               {
                                   if (onCompleteCallback != null) onCompleteCallback.Invoke();
                               })
                   .Append(ScaleStateTween(target, animation, startValue))
                   .Play();
        }

        /// <summary> Fades the specified target by animating an alpha value from its current value to a target value </summary>
        /// <param name="target"> Target RectTransform </param>
        /// <param name="animation"> Animation settings </param>
        /// <param name="startValue"> Start alpha </param>
        /// <param name="onStartCallback"> Callback executed when the animation starts playing </param>
        /// <param name="onCompleteCallback"> Callback executed when the animation completed playing </param>
        public static void FadeState(RectTransform target, UIAnimation animation, float startValue, UnityAction onStartCallback = null, UnityAction onCompleteCallback = null)
        {
            if (!animation.Fade.Enabled) return;
            if (animation.AnimationType != AnimationType.State) return;

            UIManager.DebugLog("FadeState", animation);
            
            DOTween.Sequence()
                   .SetId(GetTweenId(target, animation.AnimationType, AnimationAction.Fade))
                   .SetUpdate(true)
                   .SetSpeedBased(false)
                   .OnStart(() =>
                            {
                                if (onStartCallback != null) onStartCallback.Invoke();
                            })
                   .OnComplete(() =>
                               {
                                   if (onCompleteCallback != null) onCompleteCallback.Invoke();
                               })
                   .Append(FadeStateTween(target, animation, startValue))
                   .Play();
        }

        #endregion

        #endregion

        #region Helper Methods

        /// <summary> Returns a MoveFrom value for a target RectTransform, depending on the given animation settings and the animation start position </summary>
        /// <param name="target"> Target RectTransform </param>
        /// <param name="animation"> Animation settings </param>
        /// <param name="startValue"> Start position </param>
        public static Vector3 GetAnimationMoveFrom(RectTransform target, UIAnimation animation, Vector3 startValue)
        {
            // ReSharper disable once SwitchStatementMissingSomeCases
            switch (animation.AnimationType)
            {
                case AnimationType.Show: return animation.Move.UseCustomFromAndTo ? animation.Move.From : GetToPositionByDirection(target, animation, animation.Move.UseCustomFromAndTo ? animation.Move.CustomPosition : startValue);
                case AnimationType.Hide: return animation.Move.UseCustomFromAndTo ? animation.Move.From : startValue;
                default:                 return Vector3.zero;
            }
        }

        /// <summary> Returns a MoveTo value for a target RectTransform, depending on the given animation settings and the animation start position </summary>
        /// <param name="target"> Target RectTransform </param>
        /// <param name="animation"> Animation settings </param>
        /// <param name="startValue"> Start position </param>
        public static Vector3 GetAnimationMoveTo(RectTransform target, UIAnimation animation, Vector3 startValue)
        {
            // ReSharper disable once SwitchStatementMissingSomeCases
            switch (animation.AnimationType)
            {
                case AnimationType.Show: return animation.Move.UseCustomFromAndTo ? animation.Move.To : startValue;
                case AnimationType.Hide: return animation.Move.UseCustomFromAndTo ? animation.Move.To : GetToPositionByDirection(target, animation, animation.Move.UseCustomFromAndTo ? animation.Move.CustomPosition : startValue);
                default:                 return Vector3.zero;
            }
        }

        /// <summary> Returns a RotateFrom value depending on the given animation settings and the animation start rotation </summary>
        /// <param name="animation"> Animation settings </param>
        /// <param name="startValue"> Start rotation </param>
        public static Vector3 GetAnimationRotateFrom(UIAnimation animation, Vector3 startValue)
        {
            // ReSharper disable once SwitchStatementMissingSomeCases
            switch (animation.AnimationType)
            {
                case AnimationType.Show: return animation.Rotate.From;
                case AnimationType.Hide: return animation.Rotate.UseCustomFromAndTo ? animation.Rotate.From : startValue;
                default:                 return Vector3.zero;
            }
        }

        /// <summary> Returns a RotateTo value depending on the given animation settings and the animation start rotation </summary>
        /// <param name="animation"> Animation settings </param>
        /// <param name="startValue"> Start rotation </param>
        public static Vector3 GetAnimationRotateTo(UIAnimation animation, Vector3 startValue)
        {
            // ReSharper disable once SwitchStatementMissingSomeCases
            switch (animation.AnimationType)
            {
                case AnimationType.Show: return animation.Rotate.UseCustomFromAndTo ? animation.Rotate.To : startValue;
                case AnimationType.Hide: return animation.Rotate.To;
                default:                 return Vector3.zero;
            }
        }

        /// <summary> Returns a ScaleFrom value depending on the given animation settings and the animation start scale </summary>
        /// <param name="animation"> Animation settings </param>
        /// <param name="startValue"> Start scale </param>
        public static Vector3 GetAnimationScaleFrom(UIAnimation animation, Vector3 startValue)
        {
            // ReSharper disable once SwitchStatementMissingSomeCases
            switch (animation.AnimationType)
            {
                case AnimationType.Show: return animation.Scale.From;
                case AnimationType.Hide: return animation.Scale.UseCustomFromAndTo ? animation.Scale.From : startValue;
                default:                 return Vector3.one;
            }
        }

        /// <summary> Returns a ScaleTo value depending on the given animation settings and the animation start scale </summary>
        /// <param name="animation"> Animation settings </param>
        /// <param name="startValue"> Start scale </param>
        public static Vector3 GetAnimationScaleTo(UIAnimation animation, Vector3 startValue)
        {
            // ReSharper disable once SwitchStatementMissingSomeCases
            switch (animation.AnimationType)
            {
                case AnimationType.Show: return animation.Scale.UseCustomFromAndTo ? animation.Scale.To : startValue;
                case AnimationType.Hide: return animation.Scale.To;
                default:                 return Vector3.one;
            }
        }

        /// <summary> Returns a FadeFrom value depending on the given animation settings and the animation start alpha </summary>
        /// <param name="animation"> Animation settings </param>
        /// <param name="startValue"> Start alpha </param>
        public static float GetAnimationFadeFrom(UIAnimation animation, float startValue)
        {
            // ReSharper disable once SwitchStatementMissingSomeCases
            switch (animation.AnimationType)
            {
                case AnimationType.Show: return animation.Fade.From;
                case AnimationType.Hide: return animation.Fade.UseCustomFromAndTo ? animation.Fade.From : startValue;
                default:                 return 1f;
            }
        }

        /// <summary> Returns a FadeTo value depending on the given animation settings and the animation start alpha </summary>
        /// <param name="animation"> Animation settings </param>
        /// <param name="startValue"> Start alpha </param>
        public static float GetAnimationFadeTo(UIAnimation animation, float startValue)
        {
            // ReSharper disable once SwitchStatementMissingSomeCases
            switch (animation.AnimationType)
            {
                case AnimationType.Show: return animation.Fade.UseCustomFromAndTo ? animation.Fade.To : startValue;
                case AnimationType.Hide: return animation.Fade.To;
                default:                 return 1f;
            }
        }

        /// <summary> Reverses the specified direction </summary>
        /// <param name="direction"> The direction that needs to be reversed </param>
        public static Direction ReverseDirection(Direction direction)
        {
            switch (direction)
            {
                case Direction.Left:           return Direction.Right;
                case Direction.Right:          return Direction.Left;
                case Direction.Top:            return Direction.Bottom;
                case Direction.Bottom:         return Direction.Top;
                case Direction.TopLeft:        return Direction.BottomRight;
                case Direction.TopCenter:      return Direction.BottomCenter;
                case Direction.TopRight:       return Direction.BottomLeft;
                case Direction.MiddleLeft:     return Direction.MiddleRight;
                case Direction.MiddleCenter:   return Direction.MiddleCenter;
                case Direction.MiddleRight:    return Direction.MiddleLeft;
                case Direction.BottomLeft:     return Direction.TopRight;
                case Direction.BottomCenter:   return Direction.TopCenter;
                case Direction.BottomRight:    return Direction.TopLeft;
                case Direction.CustomPosition: return Direction.CustomPosition;
                default:                       return Direction.Left;
            }
        }

        /// <summary> Returns the 'to' (destination) position depending on the animation's direction and the target's rect size </summary>
        /// <param name="target"> Target RectTransform </param>
        /// <param name="animation"> Animation settings </param>
        /// <param name="startValue"> Start position </param>
        public static Vector3 GetToPositionByDirection(RectTransform target, UIAnimation animation, Vector3 startValue)
        {
            Canvas canvas = target.GetComponent<Canvas>();
            if(!canvas) return Vector3.zero;
            
            Canvas rootCanvas = canvas.rootCanvas;
            Rect rootCanvasRect = rootCanvas.GetComponent<RectTransform>().rect;
            float xOffset = rootCanvasRect.width / 2 + target.rect.width * target.pivot.x;
            float yOffset = rootCanvasRect.height / 2 + target.rect.height * target.pivot.y;

            switch (animation.Move.Direction)
            {
                case Direction.Left:           return new Vector3(-xOffset, startValue.y, startValue.z);
                case Direction.Right:          return new Vector3(xOffset, startValue.y, startValue.z);
                case Direction.Top:            return new Vector3(startValue.x, yOffset, startValue.z);
                case Direction.Bottom:         return new Vector3(startValue.x, -yOffset, startValue.z);
                case Direction.TopLeft:        return new Vector3(-xOffset, yOffset, startValue.z);
                case Direction.TopCenter:      return new Vector3(0, yOffset, startValue.z);
                case Direction.TopRight:       return new Vector3(xOffset, yOffset, startValue.z);
                case Direction.MiddleLeft:     return new Vector3(-xOffset, 0, startValue.z);
                case Direction.MiddleCenter:   return new Vector3(0, 0, startValue.z);
                case Direction.MiddleRight:    return new Vector3(xOffset, 0, startValue.z);
                case Direction.BottomLeft:     return new Vector3(-xOffset, -yOffset, startValue.z);
                case Direction.BottomCenter:   return new Vector3(0, -yOffset, startValue.z);
                case Direction.BottomRight:    return new Vector3(xOffset, -yOffset, startValue.z);
                case Direction.CustomPosition: return animation.Move.CustomPosition;
                default:                       return Vector3.zero;
            }
        }

        /// <summary> Generates and returns a string tween identifier from the target's InstanceID, the animationType and the animationAction </summary>
        /// <param name="target"> The target RectTransform </param>
        /// <param name="animationType"> The animation type that determines the behavior of this animation </param>
        /// <param name="animationAction"> The animation action </param>
        public static string GetTweenId(RectTransform target, AnimationType animationType, AnimationAction animationAction) { return target.GetInstanceID() + "-" + animationType + "-" + animationAction; }

        /// <summary> Resets the CanvasGroup attached to the target RectTransform (if there is one) </summary>
        public static void ResetCanvasGroup(RectTransform target, bool interactable = true, bool blocksRaycasts = true)
        {
            if (target == null) return;
            var canvasGroup = target.GetComponent<CanvasGroup>();
            if (canvasGroup == null) return;
            canvasGroup.interactable = interactable;
            canvasGroup.blocksRaycasts = blocksRaycasts;
        }

        /// <summary> Stops all the animations (tweens) running on the specified target for the given animationType </summary>
        /// <param name="target"> Target RectTransform </param>
        /// <param name="animationType"> The animation type that determines the behavior of this animation </param>
        /// <param name="complete">>If TRUE completes the tweens before killing them</param>
        public static void StopAnimations(RectTransform target, AnimationType animationType, bool complete = true)
        {
            if (target == null) return;
            
            //UIManager.DebugLog("StopAnimations", animationType);
            
            DOTween.Kill(GetTweenId(target, animationType, AnimationAction.Move), complete);
            DOTween.Kill(GetTweenId(target, animationType, AnimationAction.Rotate), complete);
            DOTween.Kill(GetTweenId(target, animationType, AnimationAction.Scale), complete);
            DOTween.Kill(GetTweenId(target, animationType, AnimationAction.Fade), complete);
        }

        #endregion

      
    }
}