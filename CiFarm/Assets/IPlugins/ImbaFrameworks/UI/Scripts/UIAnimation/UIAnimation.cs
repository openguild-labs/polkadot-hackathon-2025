// Copyright (c) 2015 - 2019 Imba
// Author: Kaka
// Created: 2019/08

using System;
using UnityEngine;

namespace Imba.UI.Animation
{
    [Serializable]
    public class UIAnimation
    {
        #region Properties

        /// <summary> Returns TRUE if at least one animation type is enabled (move, rotate, scale or fade), false otherwise </summary>
        public bool Enabled
        {
            get
            {
                
                return Move.Enabled || Rotate.Enabled || Scale.Enabled || Fade.Enabled;
                   
            }
        }

        /// <summary> Returns the minimum start delay set for the animation  </summary>
        public float StartDelay
        {
            get
            {
                if (!Enabled) return 0;
                return Mathf.Min(Move.Enabled ? Move.StartDelay : 10000,
                                 Rotate.Enabled ? Rotate.StartDelay : 10000,
                                 Scale.Enabled ? Scale.StartDelay : 10000,
                                 Fade.Enabled ? Fade.StartDelay : 10000);
            }
        }
        
        /// <summary> Returns the maximum duration (including start delay) of the animation </summary>
        public float TotalDuration
        {
            get
            {
                return Mathf.Max(Move.Enabled ? Move.TotalDuration : 0,
                                 Rotate.Enabled ? Rotate.TotalDuration : 0,
                                 Scale.Enabled ? Scale.TotalDuration : 0,
                                 Fade.Enabled ? Fade.TotalDuration : 0);
            }
        }

        #endregion
        
        #region Public Variables

        /// <summary> The animation type that determines the animation behavior </summary>

        /// <summary> Move animation settings </summary>
        public TweenMove Move;

        /// <summary> Rotate animation settings </summary>
        public TweenRotate Rotate;

        /// <summary> Scale animation settings </summary>
        public TweenScale Scale;

        /// <summary> Fade animation settings </summary>
        public TweenFade Fade;

        [HideInInspector]
        public AnimationType AnimationType = AnimationType.Undefined;

        #endregion
        
        #region Constructors

        /// <summary> Initializes a new instance of the <see cref="UIAnimation" /> class </summary>
        public UIAnimation(AnimationType animationType ) { Reset(animationType); }

        /// <inheritdoc />
        /// <summary> Initializes a new instance of the <see cref="UIAnimation" /> class </summary>
        /// <param name="move"> Move animation settings </param>
        /// <param name="rotate"> Rotate animation settings </param>
        /// <param name="scale"> Scale animation settings </param>
        /// <param name="fade"> Fade animation settings </param>
        public UIAnimation(AnimationType animationType, TweenMove move, TweenRotate rotate, TweenScale scale, TweenFade fade) : this(animationType)
        {
            Move = move;
            Rotate = rotate;
            Scale = scale;
            Fade = fade;
        }

        #endregion
        
        #region Public Methods

        /// <summary> Resets this instance to the default values </summary>
        public void Reset(AnimationType animationType)
        {
            AnimationType = animationType;
            Move = new TweenMove(animationType);
            Rotate = new TweenRotate(animationType);
            Scale = new TweenScale(animationType);
            Fade = new TweenFade(animationType);
        }

        /// <summary> Returns a deep copy </summary>
        public UIAnimation Copy()
        {
            return new UIAnimation(AnimationType)
            {
                AnimationType = AnimationType,
                Move = Move.Copy(),
                Rotate = Rotate.Copy(),
                Scale = Scale.Copy(),
                Fade = Fade.Copy()
            };
        }

        #endregion
    }
}