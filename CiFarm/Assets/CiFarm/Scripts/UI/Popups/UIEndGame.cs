using System.Collections.Generic;
using DG.Tweening;
using Imba.UI;
using TMPro;
using UnityEngine;
using UnityEngine.Events;

namespace CiFarm.Scripts.UI.Popups
{
    public class EndGameParam
    {
        public int  userScore;
        public bool newScore;

        public UnityAction reloadGameAction;
    }

    public class UIEndGame : UIPopup
    {
        [SerializeField] private TextMeshProUGUI scoreValue;
        [SerializeField] private List<Transform> fxGroup;

        public UnityAction reloadGameAction;

        protected override void OnShowing()
        {
            base.OnShowing();
            int startValue = 0;
            var pram       = (EndGameParam)Parameter;
            DOTween.To(() => startValue, x => startValue = x, pram.userScore, 0.5f)
                .OnUpdate(() => { scoreValue.text = startValue.ToString(); })
                .OnComplete(() =>
                {
                    if (pram.newScore)
                    {
                        foreach (var item in fxGroup)
                        {
                            item.SetActive(true);
                        }
                    }
                });

            reloadGameAction = pram.reloadGameAction;
        }

        public void Reload()
        {
            reloadGameAction?.Invoke();
            UIManager.Instance.PopupManager.HidePopup(UIPopupName.EndGamePopup);
        }

        public void Close()
        {
            UIManager.Instance.PopupManager.HidePopup(UIPopupName.EndGamePopup);
        }
    }
}