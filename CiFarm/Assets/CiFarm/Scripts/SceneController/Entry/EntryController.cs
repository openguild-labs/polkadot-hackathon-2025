using System.Collections;
using DG.Tweening;
using Imba.Audio;
using Imba.UI;
using TMPro;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

namespace CiFarm.Scripts.SceneController.Entry
{
    public class EntryController : MonoBehaviour
    {
        [SerializeField]
        private GameObject services;

        [SerializeField]
        private Image loaderBar;

        [SerializeField]
        private TextMeshProUGUI details;

        [SerializeField]
        private GameObject loadingGroup;

        [SerializeField]
        private GameObject playButton;

        private float fillAmount = 0;
        private string loadingDetais = "Loading";

        private void Awake()
        {
            Application.targetFrameRate = 60;

            CiFarmSDK.Instance.OnAuthenticatedFailed = OnAuthenticationFailed;
            CiFarmSDK.Instance.OnAuthenticatedSuccess = OnAuthenticationSuccess;

            DontDestroyOnLoad(services);
        }

        private IEnumerator Start()
        {
            fillAmount = 0.7f;
            UpdateFillAmount();
            StartCoroutine(PlayDetailAnimation());

            yield return null;
            //yield return new WaitUntil(() => NakamaInitializerService.Instance.IsLogin);
            fillAmount = 1f;
            UpdateFillAmount();
        }

        private void UpdateFillAmount()
        {
            if (fillAmount > 0.99f)
            {
                loaderBar
                    .DOFillAmount(fillAmount, Random.Range(0.5f, 1f))
                    .OnComplete(ShowPlayButton)
                    .SetEase(Ease.Linear);
            }
            else
            {
                loaderBar.DOFillAmount(fillAmount, Random.Range(0.5f, 1f)).SetEase(Ease.Linear);
            }
        }

        public IEnumerator PlayDetailAnimation()
        {
            var count = 1;
            while (details.gameObject.activeInHierarchy)
            {
                string dots = new string('.', count);
                details.text = loadingDetais + dots;
                count = (count % 3) + 1;
                yield return new WaitForSeconds(0.5f);
            }
        }

        public void ShowPlayButton()
        {
            AudioManager.Instance.PlaySFX(AudioName.Click3);

            loadingGroup.SetActive(false);
            playButton.SetActive(true);
        }

        public void LoadGameScene()
        {
            AudioManager.Instance.PlaySFX(AudioName.Click1);

            UIManager.Instance.ShowTransition(() =>
            {
                SceneManager.LoadScene(Constants.GameScene);
            });
        }

        public void OnAuthenticationSuccess()
        {
            fillAmount = 1;
            UpdateFillAmount();
        }

        public void OnAuthenticationFailed()
        {
            UIManager.Instance.PopupManager.ShowMessageDialog(
                "Error",
                "Login error"
            // no need to retry since the SDK handles it
            // UIMessageBox.MessageBoxType.Retry,
            // action =>
            // {
            //     //NakamaInitializerService.Instance.AuthenticateAsync();
            //     return true;
            // }
            );
        }
    }
}
