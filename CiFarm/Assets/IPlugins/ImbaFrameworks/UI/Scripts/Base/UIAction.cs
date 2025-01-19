// Copyright (c) 2015 - 2019 Imba
// Author: Kaka
// Created: 2019/08
using UnityEngine;
using UnityEngine.Events;

using System;
using Imba.Audio;

namespace Imba.UI
{
    [Serializable]
    public class UIAction
    {
        #region Constants
        #endregion

        #region Static Fields
        #endregion

        #region Properties
        /// <summary> Returns TRUE if the Event (UnityEvent) has at least one registered persistent listener </summary>
        public bool HasUnityEvent
        {
            get { return Event != null && UnityEventListenerCount > 0; }
        }

        /// <summary> Returns the number of registered persistent listeners </summary>
        public int UnityEventListenerCount
        {
            get { return Event.GetPersistentEventCount(); }
        }

        #endregion

        #region Public Vars
        
      
        
        /// <summary> Callback executed when this UIAction is executed </summary>
        public UnityEvent Event;
        
        /// <summary> Callback executed when this UIAction is executed </summary>
        public Action<GameObject> Action = delegate { };
        
        

        public AudioName AudioName = AudioName.NoSound;
 
        #endregion

        #region Private Vars
        #endregion

        #region Properties
        #endregion

        #region Constructors
        public UIAction() { Reset(); }
        #endregion

        #region Public Methods

        public void Reset()
        {
            Event = new UnityEvent();
            Action = delegate { };
        }
        
        /// <summary> Invokes the Event (UnityEvent) of this UIAction, if it's not null </summary>
        public void InvokeUnityEvent()
        {
            
            if (Event == null) return;
            //UIManager.DebugLog("InvokeUnityEvent", this);
            Event.Invoke();
        }
        
        public void InvokeAction(GameObject source)
        {
            if (Action == null) return;
            
            //UIManager.DebugLog("InvokeAction", this);
            Action.Invoke(source);
        }
        
        public void Invoke(GameObject source,
            bool invokeUnityEvent = true,
            bool invokeAction = true,
            bool playSound = false)
        {
            if (playSound) PlaySound();
            if (invokeUnityEvent) InvokeUnityEvent();
            if (invokeAction) InvokeAction(source);
        }

        
        /// <summary> Plays the sound (if enabled) of this UIAction </summary>
        public void PlaySound()
        {
            //if (!HasSound) return;
            //UIManager.DebugLog("PlaySound", this);
            if (AudioName == AudioName.NoSound) return;
            
            AudioManager.Instance.PlaySFX(AudioName);
        }

        public UIAction SetAction(Action<GameObject> action)
        {
            Action = action;
            return this;
        }
        #endregion

        #region Private Methods
        #endregion

        #region Virtual Methods
        #endregion

        #region Static Methods
        #endregion
    }
}