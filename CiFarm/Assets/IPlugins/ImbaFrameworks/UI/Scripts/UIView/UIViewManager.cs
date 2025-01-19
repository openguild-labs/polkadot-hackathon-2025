using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace Imba.UI
{
    public class UIViewManager : MonoBehaviour
    {
        private Dictionary<UIViewName, UIViewController> _dictUiView = new Dictionary<UIViewName, UIViewController>();
        public GameObject topBar;

        public Action<string, bool,bool> OnShownCallBack;
        public Action OnHideCallBack;
        
        public Action OnRefreshProps;
        public Action<bool> OnToggleTopbar;
        public Action<bool> OnToggleBackButton;

        // public Dictionary<UIViewName, UIViewController> DicUiView
        // {
        //     get { return _dictUiView; }
        // }
        private Stack<UIViewName> _lastShownView;
        private Stack<UIViewName> _lastHiddenView;
        
        public Stack<UIViewName> LastShownView
        {
            get
            {
                if (_lastShownView == null) _lastShownView = new Stack<UIViewName>();

                // Debug.Log("In stack ");
                // foreach (var a in _lastShownView)
                // {
                //     Debug.Log("" + a);
                // }
                // Debug.Log("==========");
                
                return _lastShownView;
            }
        }
        
        private void Awake() {
            Initialize();
        }

        #region Public Method
        private UIViewName PopPreviousView()
        {
            UIViewName tmpView = UIViewName.None;
            if (LastShownView.Count > 0)
            {
                tmpView = LastShownView.Pop();
            }

            return tmpView;
        }
        public void OnClickBack()
        {
            bool hasLastView = LastShownView.Count > 0;
            if (hasLastView)
            {
                UIViewName lastView = LastShownView.Peek();
                UIView view = GetViewByName<UIView>(lastView);
                bool isHide = view.OnBackClick();
                OnHideCallBack?.Invoke();
                if (isHide)
                {
                    //get next one from stack
                    LastShownView.Pop();
                    UIViewName preView = PopPreviousView();
                    if (preView != UIViewName.None)
                    {
                        ShowView(preView);
                    }
                    else
                    {
                       // ShowView(UIViewName.MainGarage);
                    }
                }
            }
        }
        public void InitAllViews()
        {
            foreach (var view in _dictUiView)
            {
                view.Value.View.Initialize();
            }
        }
        
        public UIViewController ShowView(UIViewName viewName, object ps = null, bool isBack = false, UIViewName viewNameNotHide = UIViewName.None)
        {
            UIViewController viewController = GetViewControllerByName(viewName);
            if(viewController == null)
            {
                return null;
            }

            HideOthersView(viewName, viewNameNotHide);
            viewController.Show(ps, isBack);
            if (viewController.View.ShowTopBar)
                OnShownCallBack?.Invoke(viewController.View.Title,viewController.View.ShowProps,viewController.View.ShowBackBtn);
            return viewController;
        }

        public void HideOthersView(UIViewName viewName, UIViewName viewNameNotHide)
        {
            foreach(var view in _dictUiView)
            {
                if (view.Key != viewName && view.Value.View.IsVisible() && view.Key != viewNameNotHide)
                {
                    if(view.Value.View.isActiveAndEnabled)
                        view.Value.Hide();
                }
            }
        }
        public void HideTopBar()
        {
            //Topba
            //foreach (var view in _dictUiView)
            //{
            //    if (view.Key != viewName && view.Value.View.IsVisible())
            //    {
            //        if (view.Value.View.isActiveAndEnabled)
            //            view.Value.Hide();
            //    }
            //}
        }

        public void HideView(UIViewName viewName, bool instantHide = false)
        {
            UIViewController viewController = GetViewControllerByName(viewName);
            if(viewController == null)
            {
                return;
            }
            viewController.Hide(instantHide);
            OnHideCallBack?.Invoke();
        }
        #endregion
        public UIViewController GetViewControllerByName(UIViewName viewName)
        {
            UIViewController viewController;
            if(!_dictUiView.TryGetValue(viewName,out viewController))
            {
                Debug.LogError("No ViewController with name " + viewName);
            }
            return viewController;
        }
        
        public T GetViewByName<T>(UIViewName viewName) where T:UIView
        {
            return GetViewControllerByName(viewName).View as T;
        }

        public void RefreshTopbarProps()
        {
            OnRefreshProps?.Invoke();
        }       
        
        public void ToggleTopBar(bool show)
        {
            OnToggleTopbar?.Invoke(show);
        }        
        public void ToggleBackButton(bool show)
        {
            OnToggleBackButton?.Invoke(show);
        }

        private void Initialize()
        {
            _dictUiView = new Dictionary<UIViewName, UIViewController>();
            UIViewController[] viewController = transform.GetComponentsInChildren<UIViewController>(true);
            foreach(var view in viewController)
            {
                view.Initialize(this);
                _dictUiView.Add(view.ViewName, view);
            }
        }

        public void DestroyAllView()
        {
            Invoke("HideAllViews", 0.01f);
        }

        void HideAllViews()
        {
            foreach (var view in _dictUiView)
            {
                if (view.Value.View.isActiveAndEnabled)
                    HideView(view.Key);
            }
        }
    }
}
