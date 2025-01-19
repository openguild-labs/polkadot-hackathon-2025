using System.Collections;
using CiFarm.Scripts.Configs.DataClass;
using CiFarm.Scripts.Utilities;
using Imba.UI;
using TMPro;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.UI;

namespace CiFarm.Scripts.UI.Popups
{
    public class CharacterMessagePopup : UIPopup
    {
        [SerializeField] private TextMeshProUGUI dialogMessage;
        [SerializeField] private Transform       dialogMessageContainer;
        [SerializeField] private Transform       characterModelContainer;
        [SerializeField] private float           textStreaming = 0.05f;

        private CharacterMessageParam _characterMessageParam;
        private UnityAction           _onClose;
        private GameObject            _characterObject;

        private bool _isDoneStream = false;
        private bool _skipStream   = false; // Flag to skip streaming

        protected override void OnShown()
        {
            base.OnShown();
            _isDoneStream = false;
            _skipStream   = false; // Reset the flag on shown
            dialogMessageContainer.SetActive(false);
            if (Parameter == null)
            {
                DLogger.LogWarning("CharacterMessagePopup open without param, close instead", "CharacterMessagePopup");
                Hide(true);
                return;
            }

            _characterMessageParam = (CharacterMessageParam)Parameter;
            _onClose               = _characterMessageParam.OnClose;

            dialogMessage.text = "";
            StartCoroutine(StreamText(_characterMessageParam.Details, textStreaming));

            dialogMessageContainer.SetActive(true);
            LoadCharacter();
        }

        private IEnumerator StreamText(string text, float delay)
        {
            dialogMessage.text = "";
            foreach (char letter in text)
            {
                if (_skipStream)
                {
                    dialogMessage.text = text;
                    LayoutRebuilder.ForceRebuildLayoutImmediate(dialogMessage.GetComponent<RectTransform>()); // Force layout rebuild

                    break;
                }

                dialogMessage.text += letter;
                yield return new WaitForSeconds(delay);
            }

            _isDoneStream = true;
        }

        public void NextStepHandler()
        {
            if (!_isDoneStream)
            {
                _skipStream = true;
                return;
            }

            if (_characterObject)
            {
                Destroy(_characterObject);
            }

            _onClose?.Invoke();
        }

        private void LoadCharacter()
        {
            var charModel =
                Resources.Load<GameObject>("Prefabs/UI/CharacterModel/" + _characterMessageParam.CharacterId);
            if (_characterObject)
            {
                Destroy(_characterObject);
            }

            if (charModel != null)
            {
                _characterObject = Instantiate(charModel, characterModelContainer);

            }
            else
            {
                DLogger.LogError("Get character failed for: "+ _characterMessageParam.CharacterId);
            }
        }
    }

    public class CharacterMessageParam
    {
        public TutorialsDetailType Type;
        public string              Localization;
        public string              Details;
        public string              CharacterId;
        public string              TargetImageId;
        public UnityAction         OnClose;
    }
}