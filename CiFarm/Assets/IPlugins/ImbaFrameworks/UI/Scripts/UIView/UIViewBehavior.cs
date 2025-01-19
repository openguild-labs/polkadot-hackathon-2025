// Copyright (c) 2015 - 2019 Imba
// Author: Kaka
// Created: 2019/08
using System;
using Imba.UI.Animation;

namespace Imba.UI
{
    [Serializable]
    public class UIViewBehavior
    {
        #region Public Variables

        /// <summary> Determines if this animation should happen instantly (in zero seconds) </summary>
        public bool InstantAnimation = false;
        
        /// <summary> Animation settings </summary>
        public UIAnimation Animation;

        /// <summary> Actions performed when the animations finished playing </summary>
        public UIAction OnFinished;

        /// <summary> Actions performed when the animations start playing </summary>
        public UIAction OnStart;
        
        #endregion
        
        #region Constructors

        /// <summary> Initializes a new instance of the class </summary>
        /// <param name="animationType"> AnimationType for the UIAnimation Animation </param>
        public UIViewBehavior(AnimationType animationType) { Reset(animationType); }

        /// <summary> Resets this instance to the default values </summary>
        /// <param name="animationType"> AnimationType for the UIAnimation Animation </param>
        public void Reset(AnimationType animationType)
        {
            Animation = new UIAnimation(animationType);
            OnStart = new UIAction();
            OnFinished = new UIAction();
        }
        #endregion
    }
}