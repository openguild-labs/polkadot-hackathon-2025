// Copyright (c) 2015 - 2019 Imba
// Author: Kaka
// Created: 2019/08
using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace Imba.UI
{
    /// <summary>
    /// Manage all popups
    /// </summary>
	public class UIPopupManager : MonoBehaviour
	{
     
        #region Constants
        public const string POPUP_PREFAB_LOCATION = "Prefabs/UI/Popups/";
        #endregion

        #region Static Fields
        #endregion

        #region Events
        #endregion

        #region Public Vars
        public RectTransform PopupsContainer;
	    
        #endregion

        #region Private Vars
        private Dictionary<UIPopupName, UIPopup> _dictPopup = new Dictionary<UIPopupName, UIPopup>();
        private Dictionary<UIPopupName, UIPopupController> _dictPopupControllers = new Dictionary<UIPopupName, UIPopupController>();
	    private List<UIPopup> _visiblePopups = new List<UIPopup>();
        #endregion

        #region Properties
        public Dictionary<UIPopupName, UIPopup> PopupPrefabs
        {
            get
            {
                return _dictPopup;
            }
        }



        public Dictionary<UIPopupName, UIPopupController> PopupControllers
        {
            get
            {
                return _dictPopupControllers;
            }
        }

	    public List<UIPopup> VisiblePopups
	    {
	        get { return _visiblePopups; }
	    }

	    #endregion

        #region Constructors
        #endregion

        #region Unity Methods

        void Awake()
        {
            Initialize();
        }

        void Start()
        {
            //Initialize();

        }
        #endregion


        #region Public Methods


        public int GetLowestAlwaysOnTopPopupOrder()
        {
            int order = 0;
            foreach (Transform c in PopupsContainer)
            {
                if (!c.gameObject.activeSelf)
                    continue;
                UIPopup popup = c.GetComponent<UIPopup>();
                if (!popup || !popup.Controller.AlwaysOnTop || order > popup.OrderInParent)
                    continue;
                order = popup.OrderInParent;
            }
            return order;

        }

        public int GetHighestAlwaysOnTopPopupOrder()
        {

            int order = GetLowestAlwaysOnTopPopupOrder();
            foreach (Transform c in PopupsContainer)
            {
                if (!c.gameObject.activeSelf)
                    continue;
                UIPopup popup = c.GetComponent<UIPopup>();
                if (!popup || !popup.Controller.AlwaysOnTop || order < popup.OrderInParent)
                    continue;
                order = popup.OrderInParent;
            }
            return order;

        }

        public int GetActiveTopPopupOrder()
        {

            int order = 0;
            foreach (RectTransform ch in PopupsContainer)
            {
                if (!ch.gameObject.activeSelf)
                    continue;
                UIPopup popup = ch.GetComponent<UIPopup>();
                if (popup && popup.Controller.AlwaysOnTop)
                    continue;
                if (order > ch.GetSiblingIndex())
                    continue;
                order = ch.GetSiblingIndex();
            }
            return order;

        }


        public UIPopupController GetPopupController(UIPopupName name)
        {
            UIPopupController popupController;
            if(!_dictPopupControllers.TryGetValue(name, out popupController)){
                Debug.LogError("No PopupController with name " + name);
            }
            return popupController;
        }

        public UIPopup GetPopup(UIPopupName name)
        {
            UIPopup popup;
            if (!_dictPopup.TryGetValue(name, out popup))
            {
                UIManager.DebugLog("No Popup with name " + name, this);
            }
            return popup;
        }

        public void ShowPopup(UIPopupName name, object ps = null)
        {
            UIManager.DebugLog("ShowPopup " + name, this);
            UIPopupController controller = GetPopupController(name);
            if (controller == null)
            {
                return;
            }

            controller.Show(ps);          
        }

        public void HidePopup(UIPopupName name, bool instantHide = false)
        {
          //  Debug.Log("HidePopup " + name);
            UIPopupController controller = GetPopupController(name);
            if (controller == null)
            {
                return;
            }

            controller.Hide(instantHide);
        }

        //force hide all dialog
        public void HideAllDialog()
        {
            foreach (var dlg in PopupControllers)
            {
                UIPopupController controller = dlg.Value;
                if (controller != null)
                    controller.Hide(true);
            }
        }

        public void DestroyAllPopups()
        {
            Invoke("WaitDestroyAllDialog", 0.01f);
        }

        void WaitDestroyAllDialog()
        {
            foreach (var dlg in PopupControllers)
            {
                UIPopupController controller = dlg.Value;
                if (controller != null)
                {
                    if (controller.DestroyOnLoadScene)
                        controller.DoDestroy();
                    else
                        controller.Hide(true);
                }
            }
        }

	    public void AddVisiblePopup(UIPopup popup)
	    {
	        if (!_visiblePopups.Contains(popup)) _visiblePopups.Add(popup);
	    }
	    
	    public void RemoveVisiblePopup(UIPopup popup)
	    {
	        if (_visiblePopups.Contains(popup)) _visiblePopups.Remove(popup);
	    }
	    
	    public void RemoveHiddenFromVisiblePopups()
	    {
	        RemoveNullsFromVisiblePopups();
	        for (int i = VisiblePopups.Count - 1; i >= 0; i--)
	            if (VisiblePopups[i].VisibilityState == VisibilityState.Hidden)
	                VisiblePopups.RemoveAt(i);
	    }

	    /// <summary> Removes any null entries from the VisiblePopups list </summary>
	    public void RemoveNullsFromVisiblePopups()
	    {
	        for (int i = VisiblePopups.Count - 1; i >= 0; i--)
	            if (VisiblePopups[i] == null)
	                VisiblePopups.RemoveAt(i);
	    }


        public UIPopup GetTopVisiblePopup()
        {
            if (VisiblePopups.Count > 0) return VisiblePopups.Last();

            return null;
        }
	    
        public UIPopup GetPopupFromCacheOrCreate(UIPopupName name)
        {

            UIPopup popup = GetPopup(name);
            if (popup)
            {
                UIManager.DebugLog("Load dialog from cache " + name, this);
                return popup;
            }

            UIManager.DebugLog("Create new dialog " + name, this);
            popup = CreateDefaultPopup(name);

            if (popup)
            {
                if (_dictPopup.ContainsKey(name))
                    _dictPopup[name] = popup;
                else
                    _dictPopup.Add(name, popup);
            }
           
            return popup;
        }

        public UIPopup CreateDefaultPopup(UIPopupName name)
        {
            GameObject go = Resources.Load<GameObject>(POPUP_PREFAB_LOCATION + name.ToString());
            if (!go)
            {
                Debug.LogError("Cannot load resource " + name);
                throw new System.Exception(POPUP_PREFAB_LOCATION + name.ToString() + " not found!");
            }

            go = GameObject.Instantiate(go) as GameObject;
            UIPopup popup = go.GetComponent<UIPopup>();
            if (popup == null)
            {
                GameObject.Destroy(go);
                Debug.LogError("Cannot instance " + name);
                throw new System.Exception(POPUP_PREFAB_LOCATION + name.ToString() + " doesn't have component UIDialog!");
            }
            else
            {
                // Set UI Transform parent
                //UIManager.DebugLog("Create dialog -> Set parent " + PopupsContainer.name, this); //need check why is null
                popup.transform.SetParent(PopupsContainer, false);
            }
            return popup;
        }
	    
	    public void ShowMessageDialog(string title,
	        string message,
	        UIMessageBox.MessageBoxType style = UIMessageBox.MessageBoxType.OK,
	        UIMessageBox.OnMessageBoxAction callback = null)
	    {
	        //HideLoading ();//hide loading anytime call show message box
	        
	        UIMessageBox.MessageBoxParam ps = new UIMessageBox.MessageBoxParam();
	        ps.MessageTitle = title;
	        ps.MessageBody = message;
	        ps.MessageBoxType = style;
	        ps.OnMessageBoxActionCallback = callback;
	        ShowPopup(UIPopupName.MessageBox, ps);       
	    }

        public void ShowMessageDialogUnClose(string title,
            string message,
            UIMessageBoxUnclose.MessageBoxType style = UIMessageBoxUnclose.MessageBoxType.OK,
            UIMessageBoxUnclose.OnMessageBoxAction callback = null)
        {
            //HideLoading ();//hide loading anytime call show message box

            UIMessageBoxUnclose.MessageBoxParam ps = new UIMessageBoxUnclose.MessageBoxParam();
            ps.MessageTitle = title;
            ps.MessageBody = message;
            ps.MessageBoxType = style;
            ps.OnMessageBoxActionCallback = callback;
            ShowPopup(UIPopupName.MessageBoxUnclosePopup, ps);
        }

        public void ShowMessageDialogWithAction(string title,
            string message,
            UIMessageBox.MessageBoxType style = UIMessageBox.MessageBoxType.OK,
            System.Action callback = null)
        {
            //HideLoading ();//hide loading anytime call show message box

            UIMessageBox.MessageBoxParam ps = new UIMessageBox.MessageBoxParam();
            ps.MessageTitle = title;
            ps.MessageBody = message;
            ps.MessageBoxType = style;
            ps.clickAction = callback;
            ShowPopup(UIPopupName.MessageBox, ps);
        }
        #endregion

        #region Private Methods



        private void Initialize()
        {
            _dictPopupControllers = new Dictionary<UIPopupName, UIPopupController>();
            UIPopupController[] dialogControllers = transform.GetComponentsInChildren<UIPopupController>(true);
            foreach (var dlg in dialogControllers)
            {
                dlg.Initialize(this);
                _dictPopupControllers.Add(dlg.PopupName, dlg);
            }
        }

        #endregion

        #region Virtual Methods
        #endregion

        #region Static Methods
        #endregion

	


	}
}