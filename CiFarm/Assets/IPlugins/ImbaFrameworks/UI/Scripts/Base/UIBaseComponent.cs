// Copyright (c) 2015 - 2019 Imba
// Author: Kaka
// Created: 2019/08

using UnityEngine;


namespace Imba.UI
{
	/// <summary>
	/// Base UI component, support sorting order for UI, Popup ...
	/// </summary>
	public class UIBaseComponent : MonoBehaviour
	{
		#region Properties

		/// <summary> Reference to the RectTransform component </summary>
		public RectTransform RectTransform
		{
			get
			{
				if (_rectTransform == null) _rectTransform = GetComponent<RectTransform>();

				return _rectTransform;
			}
		}
		
		public int OrderInParent
		{
			get { return transform.GetSiblingIndex(); }

			set { transform.SetSiblingIndex(value); }
		}
		
		#endregion

		#region Public Vars
		
		[HideInInspector]
		// <summary> Holds the start RectTransform.anchoredPosition3D </summary>
		public Vector3 StartPosition = Vector3.zero;

		[HideInInspector]
		// <summary> Holds the start RectTransform.localEulerAngles </summary>
		public Vector3 StartRotation = Vector3.zero;

		[HideInInspector]
		// <summary> Holds the start RectTransform.localScale </summary>
		public Vector3 StartScale = Vector3.one;

		[HideInInspector]
		// <summary> Holds the start alpha. It does that by checking if a CanvasGroup component is attached (holding the alpha value) or it just remembers 1 (as in 100% visibility) </summary>
		public float StartAlpha = 1f;
		
		// <summary> Resets the RectTransform values to the Start values (StartPosition, StartRotation, StartScale and StartAlpha) </summary>
        public virtual void ResetToStartValues()
        {
            ResetCanvasGroup();
            ResetPosition();
            ResetRotation();
            ResetScale();
            ResetAlpha();
        }

        /// <summary> Resets the RectTransform.anchoredPosition3D to the StartPosition value </summary>
        public virtual void ResetPosition() { RectTransform.anchoredPosition3D = StartPosition; }

        /// <summary> Resets the RectTransform.localEulerAngles to the StartRotation value </summary>
        public virtual void ResetRotation() { RectTransform.localEulerAngles = StartRotation; }

        /// <summary> Resets the RectTransform.localScale to the StartScale value </summary>
        public virtual void ResetScale() { RectTransform.localScale = StartScale; }

        /// <summary> Resets the CanvasGroup.alpha to the StartAlpha value (if a CanvasGroup is attached) </summary>
        public virtual void ResetAlpha()
        {
            if (RectTransform.GetComponent<CanvasGroup>() != null) RectTransform.GetComponent<CanvasGroup>().alpha = StartAlpha;
        }
		
		public void ResetCanvasGroup(bool interactable = true, bool blocksRaycasts = true)
		{
			var canvasGroup = RectTransform.GetComponent<CanvasGroup>();
			if (canvasGroup == null) return;
			canvasGroup.interactable = interactable;
			canvasGroup.blocksRaycasts = blocksRaycasts;
		}

        /// <summary> Updates the StartPosition, StartRotation, StartScale and StartAlpha for this RectTransform to the current values </summary>
        public virtual void UpdateStartValues()
        {
            UpdateStartPosition();
            UpdateStartRotation();
            UpdateStartScale();
            UpdateStartAlpha();
        }

        /// <summary> Updates the StartPosition to the RectTransform.anchoredPosition3D value </summary>
        public virtual void UpdateStartPosition() { StartPosition = RectTransform.anchoredPosition3D; }

        /// <summary> Updates the StartRotation to the RectTransform.localEulerAngles value </summary>
        public virtual void UpdateStartRotation() { StartRotation = RectTransform.localEulerAngles; }

        /// <summary> Updates the StartScale to the RectTransform.localScale value </summary>
        public virtual void UpdateStartScale() { StartScale = RectTransform.localScale; }

        /// <summary> Updates the StartAlpha to the CanvasGroup.alpha value (if a CanvasGroup is attached) </summary>
        public virtual void UpdateStartAlpha() { StartAlpha = RectTransform.GetComponent<CanvasGroup>() == null ? 1 : RectTransform.GetComponent<CanvasGroup>().alpha; }


		#endregion
		
		#region Private Variables
		/// <summary> Internal variable that holds a reference to the RectTransform component </summary>
		private RectTransform _rectTransform;
		#endregion

		#region Unity Methods

		public virtual void Awake()
		{
			UpdateStartValues();
		}
		#endregion

		#region Public Method

		public void BringForward()
		{
			transform.SetSiblingIndex(OrderInParent + 1);
		}

		public void BringBackward()
		{
			transform.SetSiblingIndex(OrderInParent - 1);
		}

		public void MoveToTop()
		{
			transform.SetAsLastSibling();
		}

		public void MoveToBack()
		{
			transform.SetAsFirstSibling();
		}

		/// <summary>
		/// Handle when click Back on this component
		/// </summary>
		/// <returns>True when hide this component</returns>
		public virtual bool OnBackClick()
		{
			Debug.Log("OnBackClick " + name);
			return true;
		}

		#endregion
		
	}
}