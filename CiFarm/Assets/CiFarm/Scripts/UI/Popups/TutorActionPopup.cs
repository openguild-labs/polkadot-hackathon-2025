using CiFarm.Scripts.Configs.DataClass;
using CiFarm.Scripts.UI.Popups.Tutorial;
using CiFarm.Scripts.Utilities;
using DG.Tweening;
using Imba.Audio;
using Imba.UI;
using TMPro;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.UI;

namespace CiFarm.Scripts.UI.Popups
{
    public class TutorActionPopup : UIPopup
    {
        [SerializeField] private TextMeshProUGUI detailStepText;
        [SerializeField] private Transform       fakeButtonContainer;
        [SerializeField] private RectTransform   holeRect;
        [SerializeField] private Image           holeImage;
        [SerializeField] private Image           bgImage;

        private GameObject             _fakeTargetButton;
        private TutorButtonActionParam _tutorParam;
        private UnityAction            _onClose;
        private Camera                 _camera;

        protected override void OnInit()
        {
            base.OnInit();
            _camera = Camera.main;
        }

        protected override void OnShown()
        {
            base.OnShown();
            if (Parameter == null)
            {
                DLogger.LogWarning("TutorButtonActionPopup open without param, close instead",
                    "TutorButtonActionPopup");
                Hide(true);
                return;
            }

            _tutorParam = (TutorButtonActionParam)Parameter;
            _onClose    = _tutorParam.OnClose;

            detailStepText.text = _tutorParam.Details;

            holeRect.SetActive(false);
            ClearButton();
            switch (_tutorParam.TargetClickType)
            {
                case TargetClickType.UIObject:
                    _fakeTargetButton = SetUpButton().gameObject;
                    break;
                case TargetClickType.GameObject:
                    _fakeTargetButton = SetUpGameObject();
                    break;
                default:
                    _fakeTargetButton = SetUpButton().gameObject;
                    break;
            }

            _fakeTargetButton.transform.DOScale(1.15f, 0.5f).SetLoops(-1,LoopType.Yoyo).SetEase(Ease.Linear);
        }

        private GameObject SetUpGameObject()
        {
            GameObject targetObj = GameObject.Find(_tutorParam.TargetClickId);
            if (targetObj == null)
            {
                DLogger.LogWarning($"Target with ID {_tutorParam.TargetClickId} not found.",
                    "TutorButtonActionPopup");
                Hide(true);
                return null;
            }

            var fakeTargetObj = Instantiate(targetObj, fakeButtonContainer);
            fakeTargetObj.transform.position = _camera.WorldToScreenPoint(targetObj.transform.position);

            // Set display 
            var spriteRenderer = targetObj.GetComponent<SpriteRenderer>();
            var fakeRender     = fakeTargetObj.AddComponent<Image>();
            fakeRender.sprite = spriteRenderer.sprite;
            fakeRender.SetNativeSize();

            // Adjust scale based on camera size
            float cameraSizeRatio = 10f / _camera.orthographicSize;
            fakeTargetObj.transform.localScale *= cameraSizeRatio;

            // Add the Button component to enable click interaction
            var button       = fakeTargetObj.AddComponent<Button>();
            var tutorHandler = targetObj.GetComponent<ITutorialItem>();
            button.onClick.AddListener(() => { tutorHandler.HandleClickInTutorial(targetObj); });
            button.onClick.AddListener(OnClickReqButton);


            return fakeTargetObj;
        }

        private UIButton SetUpButton()
        {
            GameObject targetButtonObj = GameObject.Find(_tutorParam.TargetClickId);
            if (targetButtonObj == null)
            {
                DLogger.LogWarning($"Target button with ID {_tutorParam.TargetClickId} not found.",
                    "TutorButtonActionPopup");
                Hide(true);
                return null;
            }

            var targetButton = targetButtonObj.GetComponent<UIButton>();

            if (targetButton == null)
            {
                DLogger.LogWarning($"Object with ID {_tutorParam.TargetClickId} does not have a Button component.",
                    "TutorButtonActionPopup");
                Hide(true);
                return null;
            }

            var fakeTargetButton = Instantiate(targetButton, fakeButtonContainer);
            fakeTargetButton.transform.position = targetButtonObj.transform.position;
            // Add the click listener to the fake button
            fakeTargetButton.OnClick.OnTrigger.Reset();
            fakeTargetButton.OnClick.OnTrigger.Event.AddListener(
                () =>
                {
                    DLogger.Log("Clicked");
                    targetButton.OnClick.OnTrigger.Event.Invoke();
                    OnClickReqButton();
                });

            return fakeTargetButton;
        }

        private void ClearButton()
        {
            if (_fakeTargetButton != null)
            {
                Destroy(_fakeTargetButton.gameObject);
            }
        }

        public void OnClickReqButton()
        {
            ClearButton();
            Hide(true);
            _onClose?.Invoke();
        }
    }

    public class TutorButtonActionParam
    {
        public TutorialsDetailType Type;
        public TargetClickType     TargetClickType;
        public string              Localization;
        public string              Details;
        public string              TargetClickId;
        public UnityAction         OnClose;
    }
}