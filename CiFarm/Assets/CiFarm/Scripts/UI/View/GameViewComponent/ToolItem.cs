using Imba.UI;
using JetBrains.Annotations;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.UI;

namespace CiFarm.Scripts.UI.View.GameViewComponent
{
    public class ToolItem : MonoBehaviour
    {
        [SerializeField] private UIButton   button;
        [SerializeField] private Image      iconRender;
        [SerializeField] private GameObject unselectedMask;

        public UnityEvent onClickTool;
        public void InitAction(UnityAction onClickAction)
        {
            onClickTool.AddListener(onClickAction);
        }
        public void InitIcon([CanBeNull] Sprite spriteIcon)
        {
            if (spriteIcon == null)
            {
                button.Interactable = false;
            }
            else
            {
                button.Interactable = true;
                iconRender.sprite   = spriteIcon;
            }
        }

        public void SetSelect(bool isSelect = false)
        {
            unselectedMask.SetActive(!isSelect);
        }

        public void OnClick()
        {
            onClickTool?.Invoke();
        }
    }
}