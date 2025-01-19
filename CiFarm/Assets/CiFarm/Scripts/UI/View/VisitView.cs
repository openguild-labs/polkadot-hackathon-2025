using CiFarm.Scripts.SceneController.Game;
using CiFarm.Scripts.UI.View.GameViewComponent;
using Imba.Audio;
using Imba.UI;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace CiFarm.Scripts.UI.View
{
    public class VisitViewParam
    {
        public string userName;
        public int    userLevel;
        public float  userLevelProcess;
        public Sprite userAva;
    }

    public class VisitView : UIView
    {
        [SerializeField] private TextMeshProUGUI userName;
        [SerializeField] private TextMeshProUGUI userLevel;
        [SerializeField] private Image           userExperiencesProcessed;
        [SerializeField] private ToolManager     toolManager;
        [SerializeField] private Transform       fakeEx;

        public Transform ExperienceBar => fakeEx;

        public ToolManager ToolManager => toolManager;

        private int _currentCoin;

        protected override void OnInit()
        {
            base.OnInit();
        }

        protected override void OnShown()
        {
            base.OnShown();
            if (Parameter != null)
            {
                var pr = (VisitViewParam)Parameter;
                userName.text                       = pr.userName;
                userLevel.text                      = pr.userLevel.ToString();
                userExperiencesProcessed.fillAmount = pr.userLevelProcess;
            }
        }

        #region UI BUTTON

        public void OnClickReturn()
        {
            GameController.Instance.ReturnHome();
        }

        public void OnClickSetting()
        {
            GameController.Instance.CameraController.LockCamera();
            AudioManager.Instance.PlaySFX(AudioName.Click3);
            UIManager.Instance.PopupManager.ShowPopup(UIPopupName.SettingPopup, new GameViewParam
            {
                callBack = OnPopupClose
            });
        }

        public void OnPopupClose()
        {
            GameController.Instance.CameraController.UnLockCamera();
        }

        #endregion
    }
}