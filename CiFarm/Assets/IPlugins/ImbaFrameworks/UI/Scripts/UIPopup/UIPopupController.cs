// Copyright (c) 2015 - 2019 Imba
// Author: Kaka
// Created: 2019/08

using UnityEngine;
using System.Collections;
using Imba.UI.Animation;

namespace Imba.UI
{
    public enum AfterHideBehaviour
    {
        Disable,
        Destroy
    }

    /// <summary>
    /// Control Popup behaviour include: Save, Load, Properties ...
    /// </summary>
	public class UIPopupController : MonoBehaviour
	{
        #region Constants
        public static readonly string DEFAULT_RESOURCES_LOCATION = "Assets/_Qworld/Resources/";
       
        #endregion

        #region Static Fields
        #endregion

        #region Events
        #endregion

        #region Public Vars

        public UIPopupName PopupName;

        public AfterHideBehaviour AfterHideBehaviour;

        public bool AlwaysOnTop;
	    
	    public bool DeactiveGameObjectWhenHide;//Use enable canvas or set active object?

        public bool ShowOverlay = true;

	    public bool CloseByClickOutside = true;
	    
	    public bool CloseByBackButton = true;
	    
	    public bool DestroyOnLoadScene = true;
	    
	    public bool FadeContent = true;
	    
	    public UIPopupBehavior ShowBehavior = new UIPopupBehavior(AnimationType.Show);
	    
	    public UIPopupBehavior HideBehavior = new UIPopupBehavior(AnimationType.Hide);

        public string CustomResourcesLocation = DEFAULT_RESOURCES_LOCATION;

        #endregion

        #region Private Vars
	    [SerializeField]
        private UIPopupManager _popupManager;//referrence to manager
        private UIPopup _popup;//referrence to view
        #endregion

        #region Properties

        public UIPopup Popup
        {
            get
            {
                return _popup;
            }
        }

        public UIPopupManager PopupManager { get => _popupManager;}
        #endregion

        #region Constructors
        #endregion

        #region Unity Methods
        #endregion

        #region Public Methods



        public void Initialize(UIPopupManager popupManager)
        {
            _popupManager = popupManager;
        }

        public void Show(object ps = null)
        {
            // Neu popup dang trong animation hiding
            if (_popup && _popup.VisibilityState == VisibilityState.Hiding)
            {
                Debug.Log("Popup is hiding, pls wait");
                StartCoroutine(WaitToShow(ps));
                // stack it
                return;
            }

            //neu da co popup -> show
            if (_popup )
            {
                _popup.Show(ps);
                return;
            }
            else 
            {
                _popup = PopupManager.GetPopupFromCacheOrCreate(PopupName);
                if (_popup)
                {
                    _popup.Initialize(this, ps);
                    _popup.Show();
                }
                else
                {
                    Debug.LogError("Cannot create " + PopupName);
                    return;
                }
            }
        }


        public void Hide(bool instantHide)
        {
            if (!_popup || _popup.VisibilityState != VisibilityState.Shown)
                return;

            _popup.Hide(instantHide);
        }

        public void DoDestroy()
        {
            if (_popup != null)
            {
                Debug.LogWarning("Destroy " + PopupName);
                Destroy(_popup.gameObject);
            }
        }

        #endregion

        #region Private Methods

        IEnumerator WaitToShow(object ps = null)
        {
            while (!_popup || _popup.VisibilityState == VisibilityState.Hiding)
            {
                yield return null;
            }
            Show(ps);
        }
        #endregion

        #region Virtual Methods
        #endregion

        #region Static Methods
        #endregion


	}
}