// Copyright (c) 2015 - 2019 Imba
// Author: Kaka
// Created: 2019/08

using UnityEngine;
using System;
using System.Collections;
using UnityEngine.UI;
using UnityEngine.Events;
using UnityEngine.EventSystems;

using TMPro;
using Imba.UI.Animation;

namespace Imba.UI
{
	[ExecuteInEditMode]
	[RequireComponent(typeof(Button))]
	public class UIButton : UIBaseComponent, IPointerDownHandler, IPointerUpHandler, IPointerExitHandler,
		IPointerClickHandler, IPointerEnterHandler
	{
		#region Properties

		public bool Interactable
		{
			get { return Button.interactable; }
			set
			{
				Button.interactable = value;
			}
		}
		
		/// <summary> Reference to the Button component </summary>
		public Button Button
		{
			get
			{
				if (_button != null) return _button;
				_button = GetComponent<Button>();
				return _button;
			}
		}
		
		/// <summary> Reference to the CanvasGroup component </summary>
		public CanvasGroup CanvasGroup
		{
			get
			{
				if (_canvasGroup != null) return _canvasGroup;
				_canvasGroup = GetComponent<CanvasGroup>();
				if (_canvasGroup != null) return _canvasGroup;
				_canvasGroup = gameObject.AddComponent<CanvasGroup>();
				return _canvasGroup;
			}
		}

		#endregion
		
		
		#region Static Properties

		/// <summary> Action invoked whenever a UIButtonBehavior is triggered </summary>
		public static Action<UIButton, UIButtonBehaviorType> OnUIButtonAction = delegate { };
	
		#endregion
		
		#region Public Variables

		public bool IsBackButton;
		
		public bool AllowMultipleClicks = true;
		
		public float DisableButtonBetweenClicksInterval = 0.1f; //for disable multi click
		
		public float LongClickRegisterInterval;
		
		public float DoubleClickRegisterInterval;

		/// <summary> Behavior when the pointer enters (hovers in) over the button's area </summary>
		public UIButtonBehavior OnPointerEnter = new UIButtonBehavior(UIButtonBehaviorType.OnPointerEnter);

		/// <summary> Behavior when the pointer exits (hovers out) the button's area (happens only after OnPointerEnter) </summary>
		public UIButtonBehavior OnPointerExit = new UIButtonBehavior(UIButtonBehaviorType.OnPointerExit);

		/// <summary> Behavior when the pointer is down over the button </summary>
		public UIButtonBehavior OnPointerDown = new UIButtonBehavior(UIButtonBehaviorType.OnPointerDown);

		/// <summary> Behavior when the pointer is up over the button (happens only after OnPointerDown) </summary>
		public UIButtonBehavior OnPointerUp = new UIButtonBehavior(UIButtonBehaviorType.OnPointerUp);

		/// <summary> Behavior when the pointer performs a click over the button </summary>
		public UIButtonBehavior OnClick = new UIButtonBehavior(UIButtonBehaviorType.OnClick);

		/// <summary> Behavior when the pointer performs a double click over the button </summary>
		public UIButtonBehavior OnDoubleClick = new UIButtonBehavior(UIButtonBehaviorType.OnDoubleClick);

		
		/// <summary> Behavior when the pointer performs a long click over the button </summary>
		public UIButtonBehavior OnLongClick = new UIButtonBehavior(UIButtonBehaviorType.OnLongClick);
		
		
		#endregion
		
		#region Private Variables
		
		private bool _initialized;
		
		private Button _button;
		
		private CanvasGroup _canvasGroup;
		
		private bool _clickedOnce;
		
		/// <summary> (only for Behavior.OnDoubleClick) Internal variable used to calculate the time interval between two sequential clicks </summary>
		private float _doubleClickTimeoutCounter;

		/// <summary> (only for Behavior.OnLongClick) Internal variable that is marked as true after the system determined that a long click occured </summary>
		private bool _executedLongClick;

		/// <summary> (only for Behavior.OnLongClick) Internal variable used to store a reference to the Coroutine that determines if a long click occured or not </summary>
		private Coroutine _longClickRegisterCoroutine;

		/// <summary> (only for Behavior.OnLongClick) Internal variable used to calculate how long was the button pressed </summary>
		private float _longClickTimeoutCounter;

		/// <summary> Internal variable that holds a reference to the coroutine that disables the button after click </summary>
		private Coroutine _disableButtonCoroutine;
		
		/// <summary> Internal variable used to update the start values when the first interaction happens </summary>
		private bool _updateStartValuesRequired;
		
		#endregion

		#region UnityMethod
		
		protected virtual void Reset()
		{
			AllowMultipleClicks = true;
			//Disable Button
			_disableButtonCoroutine = null;

			//Double Click
			DoubleClickRegisterInterval = 0.2f;
			_clickedOnce = false;
			_doubleClickTimeoutCounter = 0;

			//Long Click
			LongClickRegisterInterval = 1f;
			_longClickTimeoutCounter = 0;
			_executedLongClick = false;
			_longClickRegisterCoroutine = null;
		}

		public override void Awake()
		{
			base.Awake();
			Init();
		}
		
		void OnDisable()
		{

			UIAnimator.StopAnimations(RectTransform, AnimationType.Punch);
			UIAnimator.StopAnimations(RectTransform, AnimationType.State);


			//ResetToStartValues();

			OnPointerEnter.Ready = true;
			OnPointerExit.Ready = true;
			OnPointerUp.Ready = true;
			OnPointerDown.Ready = true;
			OnClick.Ready = true;
			OnDoubleClick.Ready = true;
			OnLongClick.Ready = true;

			if (_disableButtonCoroutine == null) return;
			StopCoroutine(_disableButtonCoroutine);
			_disableButtonCoroutine = null;
			EnableButton();
		}

		
		#endregion

		#region PublicMethod

        /// <summary> Sets Interactable property to FALSE </summary>
        public void DisableButton() { Interactable = false; }

        /// <summary> Disable the button for a set time duration </summary>
        /// <param name="duration"> How long will the button get disabled for </param>
        public void DisableButton(float duration)
        {
            if (!Interactable) return;
            DisableButton();
            
            if(isActiveAndEnabled)
				_disableButtonCoroutine = StartCoroutine(DisableButtonEnumerator(duration));
        }

        /// <summary> Sets Interactable to TRUE </summary>
        public void EnableButton() { Interactable = true; }

        /// <summary> Execute OnPointerEnter actions, if enabled </summary>
        public void ExecutePointerEnter()
        {
            if (!OnPointerEnter.Enabled)
                return;
            
	        UIManager.DebugLog("ExecutePointerEnter", this);
            StartCoroutine(ExecuteButtonBehaviorEnumerator(OnPointerEnter));
            if (OnPointerEnter.DisableInterval > 0) StartCoroutine(DisableButtonBehaviorEnumerator(OnPointerEnter));
        }

        /// <summary> Execute OnPointerExit actions, if enabled </summary>
        public void ExecutePointerExit()
        {
            if (!OnPointerExit.Enabled) return;

	        UIManager.DebugLog("ExecutePointerExit", this);
            StartCoroutine(ExecuteButtonBehaviorEnumerator(OnPointerExit));
            if (OnPointerExit.DisableInterval > 0) StartCoroutine(DisableButtonBehaviorEnumerator(OnPointerExit));
        }

        /// <summary> Execute OnPointerDown actions, if enabled </summary>
        public void ExecutePointerDown()
        {
            if (OnLongClick.Enabled && Interactable) RegisterLongClick();
	        
            if (!OnPointerDown.Enabled) return;
//	        UIManager.DebugLog("ExecutePointerDown", this);
            StartCoroutine(ExecuteButtonBehaviorEnumerator(OnPointerDown));
        }

        /// <summary> Execute OnPointerUp actions, if enabled </summary>
        public void ExecutePointerUp()
        {
            UnregisterLongClick();
            if (!OnPointerUp.Enabled) return;
	        UIManager.DebugLog("ExecutePointerUp", this);
            StartCoroutine(ExecuteButtonBehaviorEnumerator(OnPointerUp));

        }

        /// <summary> Execute OnClick actions, if enabled </summary>
        public void ExecuteClick()
        {
            if (OnClick.Enabled)
            {
	           
                if (Interactable)
                {
	                //UIManager.DebugLog("ExecuteClick", this);
                    StartCoroutine(ExecuteButtonBehaviorEnumerator(OnClick));
                }

                if (!AllowMultipleClicks) DisableButton(DisableButtonBetweenClicksInterval);
            }

            if (Interactable || !OnPointerExit.Enabled || !OnPointerExit.Ready) 
	            return;
            StartCoroutine(ExecuteButtonBehaviorEnumerator(OnPointerExit));
        }

        /// <summary> Execute OnDoubleClick actions, if enabled </summary>
        /// <param name="debug"> Enables relevant debug messages to be printed to the console </param>
        public void ExecuteDoubleClick(bool debug = false)
        {
            if (OnDoubleClick.Enabled)
            {
                if (Interactable)
                {
                    StartCoroutine(ExecuteButtonBehaviorEnumerator(OnDoubleClick));
                }

                if (!AllowMultipleClicks) DisableButton(DisableButtonBetweenClicksInterval);
            }

            if (Interactable || !OnPointerExit.Enabled || !OnPointerExit.Ready) return;
            StartCoroutine(ExecuteButtonBehaviorEnumerator(OnPointerExit));
        }

        /// <summary> Execute OnLongClick actions, if enabled </summary>
        /// <param name="debug"> Enables relevant debug messages to be printed to the console </param>
        public void ExecuteLongClick(bool debug = false)
        {
            if (OnLongClick.Enabled)
            {
                if (Interactable)
                {
                    StartCoroutine(ExecuteButtonBehaviorEnumerator(OnLongClick));
                }

                if (!AllowMultipleClicks) DisableButton(DisableButtonBetweenClicksInterval);
            }

            if (Interactable || !OnPointerExit.Enabled || !OnPointerExit.Ready) return;
            StartCoroutine(ExecuteButtonBehaviorEnumerator(OnPointerExit));
           
        }


		#endregion


		#region PrivateMethod

		
		private void Init()
		{
			if (_initialized)
				return;
			
//			if(BackgroundImages == null)
//				BackgroundImages = GetComponentsInChildren<Image>();
//			if(ButtonTexts == null)
//				ButtonTexts = GetComponentsInChildren<TextMeshProUGUI>();
//			
//			_button = GetComponent<Button>();
//			
//			if (UpdateBackgroundColor)
//			{
//				var colorBlock = _button.colors;
//				colorBlock.disabledColor = DisableBackgroundColor;
//				colorBlock.normalColor = EnableBackgroundColor;
//				_button.colors = colorBlock;
//			}
			_initialized = true;
		}
		
		private void TriggerButtonBehavior(UIButtonBehavior behavior)
		{
			//UIManager.DebugLog("TriggerButtonBehavior " + behavior.BehaviorType, this);
            switch (behavior.BehaviorType)
            {
                case UIButtonBehaviorType.OnClick:
                    if (!Interactable) return;
                    if (!behavior.Ready) return;
       
                    InitiateClick();
                    break;
                case UIButtonBehaviorType.OnPointerEnter:
                    if (!Interactable) return;
                    if (!behavior.Ready) return;
                    ExecutePointerEnter();
                    break;
                case UIButtonBehaviorType.OnPointerExit:
                    if (!Interactable) return;
                    if (!behavior.Ready) return;
                    ExecutePointerExit();
                    break;
                case UIButtonBehaviorType.OnPointerDown:
                    if (!Interactable) return;
                    if (!behavior.Ready) return;
                    ExecutePointerDown();
                    break;
                case UIButtonBehaviorType.OnPointerUp:
                    if (!Interactable) return;
                    if (!behavior.Ready) return;
                    ExecutePointerUp();

                    break;
            }
        }
		
		private void InitiateClick()
        {
	        //UIManager.DebugLog("InitiateClick", this);
            if (_executedLongClick)
            {
                ResetLongClick();
                return;
            }

            StartCoroutine(RunOnClickEnumerator());
        }

        private void RegisterLongClick()
        {
          
            if (_executedLongClick) return;
            ResetLongClick();
            _longClickRegisterCoroutine = StartCoroutine(RunOnLongClickEnumerator());
        }

        private void UnregisterLongClick()
        {
            
            if (_executedLongClick) return;
            ResetLongClick();
        }

        private void ResetLongClick()
        {
            
            _executedLongClick = false;
            _longClickTimeoutCounter = 0;
            if (_longClickRegisterCoroutine == null) return;
            StopCoroutine(_longClickRegisterCoroutine);
            _longClickRegisterCoroutine = null;
        }

        // ReSharper disable once UnusedMember.Local
        private bool BehaviorEnabled(UIButtonBehaviorType behaviorType)
        {
            switch (behaviorType)
            {
                case UIButtonBehaviorType.OnClick:        return OnClick.Enabled;
                case UIButtonBehaviorType.OnDoubleClick:  return OnDoubleClick.Enabled;
                case UIButtonBehaviorType.OnLongClick:    return OnLongClick.Enabled;
                case UIButtonBehaviorType.OnPointerEnter: return OnPointerEnter.Enabled;
                case UIButtonBehaviorType.OnPointerExit:  return OnPointerExit.Enabled;
                case UIButtonBehaviorType.OnPointerDown:  return OnPointerDown.Enabled;
                case UIButtonBehaviorType.OnPointerUp:    return OnPointerUp.Enabled;
     
                default:                                  throw new ArgumentOutOfRangeException("behaviorType", behaviorType, null);
            }
        }

		
		void IPointerEnterHandler.OnPointerEnter(PointerEventData eventData) { TriggerButtonBehavior(OnPointerEnter); }

		void IPointerExitHandler.OnPointerExit(PointerEventData eventData) { TriggerButtonBehavior(OnPointerExit); }

		void IPointerDownHandler.OnPointerDown(PointerEventData eventData) { TriggerButtonBehavior(OnPointerDown); }

		void IPointerUpHandler.OnPointerUp(PointerEventData eventData) { TriggerButtonBehavior(OnPointerUp); }

		void IPointerClickHandler.OnPointerClick(PointerEventData eventData) { TriggerButtonBehavior(OnClick); }
		
		/// <summary> Sends an UIButtonMessage notifying the system that an UIButtonBehavior has been triggered </summary>
		/// <param name="behaviorType"> The UIButtonBehaviorType of the UIButtonBehavior that has been triggered </param>
		private void NotifySystemOfTriggeredBehavior(UIButtonBehaviorType behaviorType)
		{
			if (OnUIButtonAction != null) OnUIButtonAction.Invoke(this, behaviorType);
		}
		
		private IEnumerator ExecuteButtonBehaviorEnumerator(UIButtonBehavior behavior)
        {
	        //UIManager.DebugLog("ExecuteButtonBehaviorEnumerator " + behavior.BehaviorType, this);
            if (!behavior.Enabled) yield break;

            if (!_updateStartValuesRequired) //on the first interaction update the start values so that the reset method works as intended 
            {
                UpdateStartValues();
                _updateStartValuesRequired = true;
            }

            // ReSharper disable once SwitchStatementMissingSomeCases
            switch (behavior.BehaviorType)
            {
                case UIButtonBehaviorType.OnClick:
                case UIButtonBehaviorType.OnDoubleClick:
                case UIButtonBehaviorType.OnLongClick:
                case UIButtonBehaviorType.OnPointerEnter:
                case UIButtonBehaviorType.OnPointerExit:
                case UIButtonBehaviorType.OnPointerDown:
                case UIButtonBehaviorType.OnPointerUp:
                    if (!Interactable) yield break;
                    break;
            }

            behavior.PlayAnimation(this);
			behavior.OnTrigger.InvokeAction(gameObject);
			behavior.OnTrigger.InvokeUnityEvent();
			NotifySystemOfTriggeredBehavior(behavior.BehaviorType);
        }

        private IEnumerator DisableButtonEnumerator(float duration)
        {

            yield return new WaitForSecondsRealtime(duration); //wait for seconds realtime (ignore Unity's Time.Timescale)
           
            EnableButton();
            _disableButtonCoroutine = null;
        }

        private IEnumerator DisableButtonBehaviorEnumerator(UIButtonBehavior behavior)
        {
            behavior.Ready = false;
           
            yield return new WaitForSecondsRealtime(behavior.DisableInterval); //wait for seconds realtime (ignore Unity's Time.Timescale)
           
            behavior.Ready = true;
        }

        private IEnumerator RunOnClickEnumerator()
        {
	        //UIManager.DebugLog("RunOnClickEnumerator", this);
	        
            ExecuteClick();

            if (!_clickedOnce && _doubleClickTimeoutCounter < DoubleClickRegisterInterval)
            {
                _clickedOnce = true;
            }
            else
            {
                _clickedOnce = false;
                yield break; //button is pressed twice -> don't allow the second function call to fully execute
            }

            yield return new WaitForEndOfFrame();

            while (_doubleClickTimeoutCounter < DoubleClickRegisterInterval)
            {
                if (!_clickedOnce)
                {
                    ExecuteDoubleClick();
                    _doubleClickTimeoutCounter = 0f;
                    _clickedOnce = false;
                    yield break;
                }

                _doubleClickTimeoutCounter += Time.unscaledDeltaTime; //increment counter by change in time between frames (ignore Unity's Time.Timescale)
                
                yield return null; //wait for the next frame
            }

            _doubleClickTimeoutCounter = 0f;
            _clickedOnce = false;
        }

        private IEnumerator RunOnLongClickEnumerator(bool debug = false)
        {
            while (_longClickTimeoutCounter < LongClickRegisterInterval)
            {
               
                _longClickTimeoutCounter += Time.unscaledDeltaTime; //increment counter by change in time between frames (ignore Unity's Time.Timescale)
               
                yield return null;
            }

            ExecuteLongClick(debug);
            _executedLongClick = true;
        }
		
		#endregion
	}
}