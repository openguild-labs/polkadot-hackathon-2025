using TMPro;
using Unity.Collections;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.UI;

namespace CiFarm.Scripts.UI.Popups.Friend
{
    public class FriendItem : MonoBehaviour
    {
        [SerializeField] private GameObject      randomIc;
        [SerializeField] private GameObject      friendIc;
        [SerializeField] private Image           userAva;
        [SerializeField] private TextMeshProUGUI textUserName;

        [ReadOnly] private FriendItemData _friendItemData;

        private UnityAction<FriendItemData> _onClickVisit;

        public void InitItem(FriendItemData friendItemData, UnityAction<FriendItemData> onClickVisit)
        {
            _friendItemData = friendItemData;

            if (friendItemData.userAva != null)
            {
                userAva.sprite = friendItemData.userAva;
            }

            textUserName.text = friendItemData.userName;
            randomIc.SetActive(false);
            friendIc.SetActive(false);
            switch (friendItemData.type)
            {
                case FriendType.Random:
                case FriendType.Search:
                    randomIc.SetActive(true);
                    break;
                case FriendType.Friend:
                    friendIc.SetActive(true);
                    break;
            }

            _onClickVisit = onClickVisit;
        }

        public void OnClickButtonVisit()
        {
            _onClickVisit?.Invoke(_friendItemData);
        }
    }
}