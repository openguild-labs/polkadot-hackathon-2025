using CiFarm.Scripts.SceneController.Game;
using CiFarm.Scripts.Services.NakamaServices;
using CiFarm.Scripts.UI.Popups;
using CiFarm.Scripts.UI.View.GameViewComponent;
using CiFarm.Scripts.Utilities;
using DG.Tweening;
using Imba.Audio;
using Imba.UI;
using TMPro;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.UI;

namespace CiFarm.Scripts.UI.View
{
    public class GameViewParam
    {
        public UnityAction callBack;
    }

    public class GameView : UIView
    {
        [SerializeField] private TextMeshProUGUI userName;
        [SerializeField] private TextMeshProUGUI userLevel;
        [SerializeField] private Transform       experiencesBar;
        [SerializeField] private Image           userExperiencesProcessed;
        [SerializeField] private TextMeshProUGUI userCoin;
        [SerializeField] private TextMeshProUGUI userNtfCoinA;
        [SerializeField] private TextMeshProUGUI userNtfCoinB;
        [SerializeField] private ToolManager     toolManager;

        public Transform   ExperienceBar => userExperiencesProcessed.transform;
        public ToolManager ToolManager   => toolManager;

        private int _currentCoin;

        protected override void OnInit()
        {
            base.OnInit();
            NakamaUserService.Instance.OnGoldChange = (FetchUserCoin);
        }

        protected override void OnShown()
        {
            base.OnShown();
            FetchUserCoin();

            userName.text = string.IsNullOrEmpty(NakamaUserService.Instance.displayName)
                ? NakamaUserService.Instance.username
                : NakamaUserService.Instance.displayName;
            userLevel.text = NakamaUserService.Instance.playerStats.levelInfo.level.ToString();
            var process = (float)NakamaUserService.Instance.playerStats.levelInfo.experiences /
                          NakamaUserService.Instance.playerStats.levelInfo.experienceQuota;
            userExperiencesProcessed.fillAmount = process;

            NakamaUserService.Instance.OnPlayerStatsUpdate = OnPlayerStatsUpdate;
        }

        protected override void OnHiding()
        {
            base.OnHiding();
            NakamaUserService.Instance.OnPlayerStatsUpdate = null;
        }

        #region UI BUTTON

        public void OnClickShop()
        {
            GameController.Instance.CameraController.LockCamera();
            AudioManager.Instance.PlaySFX(AudioName.Click3);
            UIManager.Instance.PopupManager.ShowPopup(UIPopupName.ShopPopup, new ShopPopupParam
            {
                TabToOpen = 0,
                CloseCallBack = () =>
                {
                    OnPopupClose();
                    FetchUserCoin();
                }
            });
        }

        public void OnClickShopNft()
        {
            //GameController.Instance.CameraController.LockCamera();
            AudioManager.Instance.PlaySFX(AudioName.Click3);
            DLogger.Log("In process OnClickShopNft", "MainUI");
        }

        public void OnClickDaily()
        {
            // GameController.Instance.CameraController.LockCamera();
            AudioManager.Instance.PlaySFX(AudioName.Click3);
            DLogger.Log("In process OnClickDaily", "MainUI");
        }

        public void OnClickInventory()
        {
            GameController.Instance.CameraController.LockCamera();
            AudioManager.Instance.PlaySFX(AudioName.Click3);
            UIManager.Instance.PopupManager.ShowPopup(UIPopupName.InventoryPopup, new GameViewParam
            {
                callBack = OnPopupClose
            });
        }

        public void OnClickFriend()
        {
            GameController.Instance.CameraController.LockCamera();
            AudioManager.Instance.PlaySFX(AudioName.Click3);
            UIManager.Instance.PopupManager.ShowPopup(UIPopupName.FriendsPopup, new GameViewParam
            {
                callBack = OnPopupClose
            });
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

        public void OnClickRoadsideShop()
        {
            GameController.Instance.CameraController.LockCamera();
            AudioManager.Instance.PlaySFX(AudioName.Click3);
            UIManager.Instance.PopupManager.ShowPopup(UIPopupName.RoadsideShopPopup, new GameViewParam
            {
                callBack = OnPopupClose
            });
        }
        public void OnClickBulletin()
        {
            GameController.Instance.CameraController.LockCamera();
            AudioManager.Instance.PlaySFX(AudioName.Click3);
            UIManager.Instance.PopupManager.ShowPopup(UIPopupName.BulletinPopup, new GameViewParam
            {
                callBack = OnPopupClose
            });
        }

        public void OnPopupClose()
        {
            DLogger.Log("CLOSED POPUP");
            GameController.Instance.CameraController.UnLockCamera();
        }

        private void OnPlayerStatsUpdate()
        {
            var process = (float)NakamaUserService.Instance.playerStats.levelInfo.experiences /
                          NakamaUserService.Instance.playerStats.levelInfo.experienceQuota;

            userExperiencesProcessed.DOFillAmount(process, 0.2f);
            experiencesBar.transform.DOShakePosition(0.2f, new Vector3(2.5f, 0, 2.5f));
        }

        #endregion

        #region NAKAMA

        public void FetchUserCoin()
        {
            var targetCoin = NakamaUserService.Instance.golds;
            DOTween.To(() => _currentCoin, x => _currentCoin = x, targetCoin, 0.3f)
                .OnUpdate(() => { userCoin.text = _currentCoin.ToString(); });
        }

        #endregion
    }
}