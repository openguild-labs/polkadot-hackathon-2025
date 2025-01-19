// Copyright (c) 2015 - 2019 Imba
// Author: Kaka
// Created: 2019/08

using System;
using DG.Tweening;
using UnityEngine;

namespace Imba.UI.Animation
{
    
    /// <summary> Describes types of animations </summary>
    public enum AnimationType
    {
        /// <summary>
        /// Unknown animation
        /// </summary>
        Undefined,
        
        /// <summary>
        /// Show animation (enter screen view)
        /// </summary>
        Show,
        
        /// <summary>
        /// Hide animation (exit screen view)
        /// </summary>
        Hide,
        
        /// <summary>
        /// Loop animation (repeats/restarts itself)
        /// </summary>
        Loop,
        
        /// <summary>
        /// Punch animation (fast animation that returns to the start values when finished)
        /// </summary>
        Punch,
        
        /// <summary>
        /// State animation (changes the state of the target by setting new values for position, rotation, scale and/or alpha)
        /// </summary>
        State
    }
    
    /// <summary> Describes the directions available for the Move animation </summary>
    public enum Direction
    {
        Left = 0,
        Right = 1,
        Top = 2,
        Bottom = 3,
        TopLeft = 4,
        TopCenter = 5,
        TopRight = 6,
        MiddleLeft = 7,
        MiddleCenter = 8,
        MiddleRight = 9,
        BottomLeft = 10,
        BottomCenter = 11,
        BottomRight = 12,
        CustomPosition = 13
    }
    
    public enum AnimationAction
    {
        /// <summary>
        /// Move Animation
        /// </summary>
        Move,
        
        /// <summary>
        /// Rotate Animation
        /// </summary>
        Rotate,
        
        /// <summary>
        /// Scale Animation
        /// </summary>
        Scale,
        
        /// <summary>
        /// Fade Animation
        /// </summary>
        Fade
    }
    
    [Serializable]
    public class TweenMove
    {
        #region Properties

        /// <summary> Returns the maximum duration (including StartDelay) of the animation </summary>
        public float TotalDuration
        {
            get { return StartDelay + Duration; }
        }

        #endregion
        
        #region Public Variables

        public AnimationType AnimationType = AnimationType.Undefined;
        
        /// <summary> Determines if this animation is enabled or not </summary>
        public bool Enabled;

        /// <summary> Allows the usage of custom from and to values for the Move animation </summary>
        public bool UseCustomFromAndTo;
        
        /// <summary> Start value for the animation </summary>
        public Vector3 From;

        /// <summary> End value for the animation </summary>
        public Vector3 To;

        /// <summary> By value for the animation (used to perform relative changes to the current values or punch animations) </summary>
        public Vector3 By;
        
        

        /// <summary>
        ///     The vibrato indicates how much will a punch animation will vibrate
        ///     <para> (used only by punch animations) </para>
        /// </summary>
        public int Vibrato;

        /// <summary>
        ///     The elasticity represents how much (0 to 1) the vector will go beyond the starting position when bouncing backwards after a punch
        ///     <para> 1 creates a full oscillation between the punch direction and the opposite direction, while 0 oscillates only between the punch and the start position </para>
        ///     <para> (used only by punch animations) </para>
        /// </summary>
        public float Elasticity;

        /// <summary>
        ///     The number of loops this animation performs until it stops. If set to -1 it will perform infinite loops
        ///     <para> (used only by loop animations) </para>
        /// </summary>
        public int NumberOfLoops;

        /// <summary>
        ///     The loop type
        ///     <para> (used only by loop animations) </para>
        /// </summary>
        public LoopType LoopType;

        /// <summary> The direction this animation is set to </summary>
        public Direction Direction;

        /// <summary> Custom value used only when Direction is set to CustomPosition </summary>
        public Vector3 CustomPosition;


        /// <summary> Sets the ease of the tween. Easing functions specify the rate of change of a parameter over time. To see how default ease curves look, check out easings.net. Enabled only if easeType is set to EaseType.Ease </summary>
        public Ease Ease;


        /// <summary> Start delay duration for the animation </summary>
        public float StartDelay;

        /// <summary> Length of time for the animation (does not include the StartDelay) </summary>
        public float Duration;
        
        #endregion
        
        
         #region Constructors

        /// <summary> Initializes a new instance of the <see cref="Move" /> class </summary>
        public TweenMove(AnimationType animationType) { Reset(animationType); }


        public TweenMove(AnimationType animationType,
                    bool enabled,
                    Vector3 from, Vector3 to, Vector3 by,
                    bool useCustomFromAndTo,
                    int vibrato, float elasticity,
                    int numberOfLoops, LoopType loopType,
                    Direction direction,
                    Vector3 customPosition,
                    Ease ease,
                    float startDelay, float duration) : this(animationType)
        {
            AnimationType = animationType;
            Enabled = enabled;
            From = from;
            To = to;
            By = by;
            UseCustomFromAndTo = useCustomFromAndTo;
            Vibrato = vibrato;
            Elasticity = elasticity;
            NumberOfLoops = numberOfLoops;
            LoopType = loopType;
            Direction = direction;
            CustomPosition = customPosition;
          
            Ease = ease;
           
            StartDelay = startDelay;
            Duration = duration;
        }

        #endregion
        
         #region Public Methods

        /// <summary> Resets this instance to the default values </summary>
        public void Reset(AnimationType animationType)
        {
            AnimationType = animationType;
            Enabled = false;
            From = Vector3.zero;
            To = Vector3.zero;
            By = Vector3.zero;
            UseCustomFromAndTo = false;
            Vibrato = 10;
            Elasticity = 1;
            NumberOfLoops = -1;
            LoopType = LoopType.Yoyo;
            Direction = Direction.Left;
            CustomPosition = Vector3.zero;
            Ease = Ease.Linear;
            StartDelay = 0f;
            Duration = 1f;
        }

        /// <summary> Returns a deep copy </summary>
        public TweenMove Copy()
        {
            return new TweenMove(AnimationType)
                   {
                       AnimationType = AnimationType,
                       Enabled = Enabled,
                       From = From,
                       To = To,
                       By = By,
                       UseCustomFromAndTo = UseCustomFromAndTo,
                       Vibrato = Vibrato,
                       Elasticity = Elasticity,
                       NumberOfLoops = NumberOfLoops,
                       LoopType = LoopType,
                       Direction = Direction,
                       CustomPosition = CustomPosition,
                       Ease = Ease,
                       StartDelay = StartDelay,
                       Duration = Duration
                   };
        }

        #endregion
    }
    
     /// <summary> Scale animation settings </summary>
    [Serializable]
    public class TweenScale
    {
        #region Properties

        /// <summary> Returns the maximum duration (including StartDelay) of the animation </summary>
        public float TotalDuration
        {
            get { return StartDelay + Duration; }
        }

        #endregion

        #region Public Variables
        
        public AnimationType AnimationType = AnimationType.Undefined;

        /// <summary> Determines if this animation is enabled or not </summary>
        public bool Enabled;

        /// <summary> Start value for the animation </summary>
        public Vector3 From;

        /// <summary> End value for the animation </summary>
        public Vector3 To;

        /// <summary> By value for the animation (used to perform relative changes to the current values) </summary>
        public Vector3 By;

        /// <summary> Allows the usage of custom from and to values for the Scale animation </summary>
        public bool UseCustomFromAndTo;

        /// <summary>
        ///     The vibrato indicates how much will a punch animation will vibrate
        ///     <para> (used only by punch animations) </para>
        /// </summary>
        public int Vibrato;

        /// <summary>
        ///     The elasticity represents how much (0 to 1) the vector will go beyond the starting scale when bouncing backwards after a punch
        ///     <para> 1 creates a full oscillation between the punch direction and the opposite direction, while 0 oscillates only between the punch and the start scale </para>
        ///     <para> (used only by punch animations) </para>
        /// </summary>
        public float Elasticity;

        /// <summary>
        ///     The number of loops this animation performs until it stops. If set to -1 it will perform infinite loops
        ///     <para> (used only by loop animations) </para>
        /// </summary>
        public int NumberOfLoops;

        /// <summary>
        ///     The loop type
        ///     <para> (used only by loop animations) </para>
        /// </summary>
        public LoopType LoopType;


        /// <summary> Sets the ease of the tween. Easing functions specify the rate of change of a parameter over time. To see how default ease curves look, check out easings.net. Enabled only if EaseType is set to EaseType.Ease </summary>
        public Ease Ease;


        /// <summary> Start delay duration for the animation </summary>
        public float StartDelay;

        /// <summary> Length of time for the animation (does not include the StartDelay) </summary>
        public float Duration;

        #endregion

        #region Constructors

        /// <summary> Initializes a new instance of the <see cref="TweenScale" /> class </summary>
        public TweenScale(AnimationType animationType) { Reset(animationType); }

        public TweenScale(AnimationType animationType,
                     bool enabled,
                     Vector3 from, Vector3 to, Vector3 by,
                     bool useCustomFromAndTo,
                     int vibrato, float elasticity,
                     int numberOfLoops, LoopType loopType,
                     Ease ease,
                     float startDelay, float duration) : this(animationType)
        {
            AnimationType = animationType;
            Enabled = enabled;
            From = from;
            To = to;
            By = by;
            UseCustomFromAndTo = useCustomFromAndTo;
            Vibrato = vibrato;
            Elasticity = elasticity;
            NumberOfLoops = numberOfLoops;
            LoopType = loopType;

            Ease = ease;

            StartDelay = startDelay;
            Duration = duration;
        }

        #endregion

        #region Public Methods

        /// <summary> Resets this instance to the default values </summary>
        public void Reset( AnimationType animationType)
        {
            AnimationType = animationType;
            Enabled = false;
            From = new Vector3(0.7f, 0.7f, 1);;
            To = new Vector3(1.2f, 1.2f, 1);;
            By = new Vector3(0.2f, 0.2f, 1);
            UseCustomFromAndTo = false;
            Vibrato = 5;
            Elasticity = 1;
            NumberOfLoops = -1;
            LoopType = LoopType.Yoyo;
            Ease = Ease.Linear;
            StartDelay = 0f;
            Duration = 1f;
        }

        /// <summary> Returns a deep copy </summary>
        public TweenScale Copy()
        {
            return new TweenScale(AnimationType)
                   {
                       AnimationType = AnimationType,
                       Enabled = Enabled,
                       From = From,
                       To = To,
                       By = By,
                       UseCustomFromAndTo = UseCustomFromAndTo,
                       Vibrato = Vibrato,
                       Elasticity = Elasticity,
                       NumberOfLoops = NumberOfLoops,
                       LoopType = LoopType,
                       Ease = Ease,
                       StartDelay = StartDelay,
                       Duration = Duration
                   };
        }

        #endregion
    }
    
    /// <summary> Fade animation settings </summary>
    [Serializable]
    public class TweenFade
    {
        #region Properties

        /// <summary> Returns the maximum duration (including StartDelay) of the animation </summary>
        public float TotalDuration
        {
            get { return StartDelay + Duration; }
        }

        #endregion

        #region Public Variables

        public AnimationType AnimationType = AnimationType.Undefined;
        
        /// <summary> Determines if this animation is enabled or not </summary>
        public bool Enabled;

        /// <summary> Start value for the animation </summary>
        public float From;

        /// <summary> End value for the animation </summary>
        public float To;

        /// <summary> By value for the animation (used to perform relative changes to the current values) </summary>
        public float By;

        /// <summary> Allows the usage of custom from and to values for the Fade animation </summary>
        public bool UseCustomFromAndTo;

        /// <summary>
        ///     The number of loops this animation performs until it stops. If set to -1 it will perform infinite loops
        ///     <para> (used only by loop animations) </para>
        /// </summary>
        public int NumberOfLoops;

        /// <summary>
        ///     The loop type
        ///     <para> (used only by loop animations) </para>
        /// </summary>
        public LoopType LoopType;

        /// <summary> Sets the ease of the tween. Easing functions specify the rate of change of a parameter over time. To see how default ease curves look, check out easings.net. Enabled only if EaseType is set to EaseType.Ease </summary>
        public Ease Ease;


        /// <summary> Start delay duration for the animation </summary>
        public float StartDelay;

        /// <summary> Length of time for the animation (does not include the StartDelay) </summary>
        public float Duration;

        #endregion

        #region Constructors

        /// <summary> Initializes a new instance of the <see cref="TweenFade" /> class </summary>
        public TweenFade(AnimationType animationType) { Reset(animationType); }

       
        public TweenFade(AnimationType animationType,
                    bool enabled,
                    float from, float to, float by,
                    bool useCustomFromAndTo,
                    int numberOfLoops, LoopType loopType,
                    Ease ease,
                    float startDelay, float duration) : this(animationType)
        {
            AnimationType = animationType;
            Enabled = enabled;
            From = from;
            To = to;
            By = by;
            UseCustomFromAndTo = useCustomFromAndTo;
            NumberOfLoops = numberOfLoops;
            LoopType = loopType;
            Ease = ease;
            StartDelay = startDelay;
            Duration = duration;
        }

        #endregion

        #region Public Methods

        /// <summary> Resets this instance to the default values </summary>
        public void Reset(AnimationType animationType)
        {
            AnimationType = animationType;
            Enabled = false;
            From = 0f;
            To = 0f;
            By = 0.5f;
            UseCustomFromAndTo = false;
            NumberOfLoops = -1;
            LoopType = LoopType.Yoyo;
            Ease = Ease.Linear;
            StartDelay = 0f;
            Duration = 1f;
        }

        /// <summary> Returns a deep copy </summary>
        public TweenFade Copy()
        {
            return new TweenFade(AnimationType)
                {
                   AnimationType = AnimationType,
                   Enabled = Enabled,
                   From = From,
                   To = To,
                   By = By,
                   UseCustomFromAndTo = UseCustomFromAndTo,
                   NumberOfLoops = NumberOfLoops,
                   LoopType = LoopType,
                   Ease = Ease,
                   StartDelay = StartDelay,
                   Duration = Duration
               };
        }

        #endregion
    }
    
     /// <summary> Rotate animation settings </summary>
    [Serializable]
    public class TweenRotate
    {
        #region Properties

        /// <summary> Returns the maximum duration (including StartDelay) of the animation </summary>
        public float TotalDuration
        {
            get { return StartDelay + Duration; }
        }

        #endregion

        #region Public Variables

        public AnimationType AnimationType = AnimationType.Undefined;
        
        /// <summary> Determines if this animation is enabled or not </summary>
        public bool Enabled;

        /// <summary> Start value for the animation </summary>
        public Vector3 From;

        /// <summary> End value for the animation </summary>
        public Vector3 To;

        /// <summary> By value for the animation (used to perform relative changes to the current values) </summary>
        public Vector3 By;

        /// <summary> Allows the usage of custom from and to values for the Rotate animation </summary>
        public bool UseCustomFromAndTo;

        /// <summary>
        ///     The vibrato indicates how much will a punch animation will vibrate
        ///     <para> (used only by punch animations) </para>
        /// </summary>
        public int Vibrato;

        /// <summary>
        ///     The elasticity represents how much (0 to 1) the vector will go beyond the starting rotation when bouncing backwards after a punch
        ///     <para> 1 creates a full oscillation between the punch direction and the opposite direction, while 0 oscillates only between the punch and the start rotation </para>
        ///     <para> (used only by punch animations) </para>
        /// </summary>
        public float Elasticity;

        /// <summary>
        ///     The number of loops this animation performs until it stops. If set to -1 it will perform infinite loops
        ///     <para> (used only by loop animations) </para>
        /// </summary>
        public int NumberOfLoops;

        /// <summary>
        ///     The loop type
        ///     <para> (used only by loop animations) </para>
        /// </summary>
        public LoopType LoopType;

        /// <summary> Rotation mode used with DORotate methods </summary>
        public RotateMode RotateMode;

        /// <summary> Sets the ease of the tween. Easing functions specify the rate of change of a parameter over time. To see how default ease curves look, check out easings.net. Enabled only if EaseType is set to EaseType.Ease </summary>
        public Ease Ease;

        /// <summary> Start delay duration for the animation </summary>
        public float StartDelay;

        /// <summary> Length of time for the animation (does not include the StartDelay) </summary>
        public float Duration;

        #endregion

        #region Constructors

        /// <summary> Initializes a new instance of the <see cref="TweenRotate" /> class </summary>
        /// <param name="animationType"> The animation type that determines the behavior of this animation </param>
        public TweenRotate(AnimationType animationType) { Reset(animationType); }

        
        public TweenRotate(AnimationType animationType,
                      bool enabled,
                      Vector3 from, Vector3 to, Vector3 by,
                      bool useCustomFromAndTo,
                      int vibrato, float elasticity,
                      int numberOfLoops, LoopType loopType, RotateMode rotateMode,
                      Ease ease, AnimationCurve animationCurve,
                      float startDelay, float duration) : this(animationType)
        {
            AnimationType = animationType;
            Enabled = enabled;
            From = from;
            To = to;
            By = by;
            UseCustomFromAndTo = useCustomFromAndTo;
            Vibrato = vibrato;
            Elasticity = elasticity;
            NumberOfLoops = numberOfLoops;
            LoopType = loopType;
            RotateMode = rotateMode;
            Ease = ease;
            StartDelay = startDelay;
            Duration = duration;
        }

        #endregion

        #region Public Methods

        /// <summary> Resets this instance to the default values </summary>
        public void Reset(AnimationType animationType)
        {
            AnimationType = animationType;
            Enabled = false;
            From = Vector3.zero;
            To = Vector3.zero;
            By = Vector3.zero;
            UseCustomFromAndTo = false;
            NumberOfLoops = -1;
            LoopType = LoopType.Yoyo;
            Vibrato = 10;
            Elasticity = 1;
            RotateMode = RotateMode.FastBeyond360;
            Ease = Ease.Linear;
            StartDelay = 0f;
            Duration = 1f;
        }

        /// <summary> Returns a deep copy </summary>
        public TweenRotate Copy()
        {
            return new TweenRotate(AnimationType)
                   {
                       AnimationType = AnimationType,
                       Enabled = Enabled,
                       From = From,
                       To = To,
                       By = By,
                       UseCustomFromAndTo = UseCustomFromAndTo,
                       Vibrato = Vibrato,
                       Elasticity = Elasticity,
                       NumberOfLoops = NumberOfLoops,
                       LoopType = LoopType,
                       RotateMode = RotateMode,
                       Ease = Ease,
                       StartDelay = StartDelay,
                       Duration = Duration
                   };
        }

        #endregion
    }
    
}