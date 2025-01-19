using System.Collections.Generic;
using CiFarm.Scripts.Configs;
using CiFarm.Scripts.Configs.DataClass;
using CiFarm.Scripts.Services.NakamaServices;
using CiFarm.Scripts.UI.Popups;
using CiFarm.Scripts.Utilities;
using Imba.UI;
using Imba.Utils;
using UnityEngine.UI;

namespace CiFarm.Scripts.SceneController.Game
{
    public class TutorialController : ManualSingletonMono<TutorialController>
    {
        public TutorialRecord tutorialRecord;

        public List<TutorialDetailRecord> tutorialDetailRecord;

        private int _tutorId;
        private int _currentIndex;

        public override void Awake()
        {
            base.Awake();
            tutorialDetailRecord = new();
        }

        public void StartTutorial()
        {
            GameController.Instance.CameraController.LockCamera();
            _tutorId = NakamaUserService.Instance.playerStats.tutorialInfo.tutorialIndex;
            LoadTutorial(NakamaUserService.Instance.playerStats.tutorialInfo.tutorialIndex,
                NakamaUserService.Instance.playerStats.tutorialInfo.stepIndex);
            ProceedToNextStep();
        }

        public void LoadTutorial(int tutorId, int currenIndex = 0)
        {
            _currentIndex  = currenIndex;
            tutorialRecord = ConfigManager.Instance.TutorialsConfig.GetConfigById(tutorId);
            var step = tutorialRecord.GetTutorialDetailsId();
            foreach (var idDetail in step)
            {
                tutorialDetailRecord.Add(ConfigManager.Instance.TutorialsDetailConfig.GetConfigById(idDetail));
            }
        }

        private void ProceedToNextStep()
        {
            SyncTutorial(false);
            if (_currentIndex < tutorialDetailRecord.Count)
            {
                var nextStep = tutorialDetailRecord[_currentIndex];
                HandleTutorialStep(nextStep);
                _currentIndex++;
            }
            else
            {
                EndTutorial();
            }
        }

        public void HandleTutorialStep(TutorialDetailRecord tutorialDetail)
        {
            // CleanUp Old
            GameController.Instance.CameraController.LockCamera();
            var lastStep = tutorialDetailRecord[_currentIndex == 0 ? _currentIndex : _currentIndex - 1];
            switch (lastStep.TutorialsDetailType)
            {
                case TutorialsDetailType.PopupMessage:
                    if (_currentIndex < tutorialDetailRecord.Count)
                    {
                        if (tutorialDetail.TutorialsDetailType != TutorialsDetailType.PopupMessage)
                        {
                            UIManager.Instance.PopupManager.HidePopup(UIPopupName.CharacterMessagePopup, true);
                        }
                    }

                    break;
                case TutorialsDetailType.ActionClick:
                    break;
                case TutorialsDetailType.PopupMessageImage:
                    break;
            }

            // Handle new
            switch (tutorialDetail.TutorialsDetailType)
            {
                case TutorialsDetailType.PopupMessage:
                    ShowPopupMessage(tutorialDetail);
                    break;
                case TutorialsDetailType.ActionClick:
                    HandleActionClick(tutorialDetail);
                    break;
                case TutorialsDetailType.PopupMessageImage:
                    ShowPopupWithImage(tutorialDetail);
                    break;
            }
        }

        private void ShowPopupMessage(TutorialDetailRecord tutorialDetail)
        {
            // DLogger.Log("Message tutor: " + tutorialDetail.Details, nameof(TutorialController));

            UIManager.Instance.PopupManager.ShowPopup(UIPopupName.CharacterMessagePopup, new CharacterMessageParam
            {
                Type          = tutorialDetail.TutorialsDetailType,
                Localization  = tutorialDetail.Localization,
                Details       = tutorialDetail.Details,
                CharacterId   = tutorialDetail.CharacterId,
                TargetImageId = tutorialDetail.TargetImageId,
                OnClose       = ProceedToNextStep
            });
        }

        private void ShowPopupWithImage(TutorialDetailRecord tutorialDetail)
        {
        }

        private void HandleActionClick(TutorialDetailRecord tutorialDetail)
        {
            DLogger.Log("HandleActionClick tutor: " + tutorialDetail.Details, nameof(TutorialController));
            UIManager.Instance.PopupManager.ShowPopup(UIPopupName.TutorActionPopup, new TutorButtonActionParam()
            {
                Type            = tutorialDetail.TutorialsDetailType,
                TargetClickType = tutorialDetail.TargetClickType,
                Localization    = tutorialDetail.Localization,
                Details         = tutorialDetail.Details,
                TargetClickId   = tutorialDetail.TargetClickId,
                OnClose         = ProceedToNextStep
            });
        }

        private void OnActionClickCompleted(Button targetButton)
        {
            ProceedToNextStep();
        }

        public void EndTutorial()
        {
            // CLEAN
            var lastStep = tutorialDetailRecord[_currentIndex - 1];
            switch (lastStep.TutorialsDetailType)
            {
                case TutorialsDetailType.PopupMessage:
                    UIManager.Instance.PopupManager.HidePopup(UIPopupName.CharacterMessagePopup, true);
                    break;
                case TutorialsDetailType.ActionClick:
                    break;
                case TutorialsDetailType.PopupMessageImage:
                    break;
            }

            SyncTutorial(true);
            GameController.Instance.CameraController.UnLockCamera();
        }

        /// <summary>
        /// Todo: Update checking logic for tutorial
        /// </summary>
        /// <returns></returns>
        public bool AvailableTutorCheck()
        {
            if (NakamaUserService.Instance.playerStats.tutorialInfo.tutorialIndex <= 1)
            {
                NakamaUserService.Instance.playerStats.tutorialInfo.tutorialIndex = 1;
                return true;
            }

            return false;
        }

        public void SyncTutorial(bool isDone)
        {
            if (isDone)
            {
                _tutorId++;
                NakamaUserService.Instance.SyncTutorial(_tutorId, _currentIndex);
                return;
            }

            if (_currentIndex < tutorialDetailRecord.Count)
            {
                if (tutorialDetailRecord[_currentIndex].AllowSave)
                {
                    NakamaUserService.Instance.SyncTutorial(_tutorId, _currentIndex);
                }
                else
                {
                    NakamaUserService.Instance.SyncTutorial(_tutorId, _currentIndex);
                }
            }
            else
            {
                NakamaUserService.Instance.SyncTutorial(_tutorId, _currentIndex);
            }
        }
    }
}