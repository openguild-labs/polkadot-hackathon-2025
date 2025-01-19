using System;
using System.Collections.Generic;
using CiFarm.Scripts.SceneController.Game;
using CiFarm.Scripts.Services.NakamaServices;
using CiFarm.Scripts.UI.Popups.Friend;
using CiFarm.Scripts.UI.View;
using CiFarm.Scripts.Utilities;
using Imba.UI;
using SuperScrollView;
using TMPro;
using UnityEngine;
using UnityEngine.Events;

namespace CiFarm.Scripts.UI.Popups
{
    public class FriendsPopup : UIPopup
    {
        [SerializeField] private FriendItem     randomUser;
        [SerializeField] private TMP_InputField inputField;
        [SerializeField] private LoopListView2  friendListView;

        private UnityAction _onClose;

        private List<FriendItemData> _friendItemsData;

        protected override void OnInit()
        {
            base.OnInit();
            friendListView.InitListView(0, OnGetItemByIndex);
            _friendItemsData = new();
            inputField.onEndEdit.AddListener((value) => { SearchingFriend(); });
        }

        protected override void OnShowing()
        {
            base.OnShowing();
            if (Parameter != null)
            {
                var param = (GameViewParam)Parameter;
                _onClose = param.callBack;
            }

            NakamaCommunityService.Instance.OnSearchUsersUpdate = LoadSearchUser;

            LoadSearchUser();
            LoadRandomUser();
        }

        protected override void OnHiding()
        {
            base.OnHiding();
            NakamaCommunityService.Instance.OnSearchUsersUpdate = null;
            _onClose?.Invoke();
        }

        private LoopListViewItem2 OnGetItemByIndex(LoopListView2 listView, int index)
        {
            if (index < 0 || index >= _friendItemsData.Count)
            {
                return null;
            }

            var itemData = _friendItemsData[index];

            if (itemData == null)
            {
                return null;
            }

            var item       = listView.NewListViewItem("FriendItem");
            var itemScript = item.GetComponent<FriendItem>();
            itemScript.InitItem(itemData, OnClickVisitFriend);
            return item;
        }

        private void ResetListView()
        {
            friendListView.RecycleAllItem();
            friendListView.SetListItemCount(_friendItemsData.Count);
            friendListView.MovePanelToItemIndex(0, 0);
        }

        private void LoadSearchUser()
        {
            _friendItemsData.Clear();
            var rawData = NakamaCommunityService.Instance.searchUsers;
            if (rawData == null)
            {
                rawData = new List<User>();
            }


            foreach (var userData in rawData)
            {
                _friendItemsData.Add(new()
                {
                    userId   = userData.userId,
                    userName = userData.username,
                    userAva  = null,
                    type     = FriendType.Search
                });
            }

            ResetListView();
        }

        private void LoadRandomUser()
        {
            var rawData = NakamaCommunityService.Instance.randomUser;

            randomUser.InitItem(new()
            {
                userId   = rawData.userId,
                userName = rawData.username,
                userAva  = null,
                type     = FriendType.Search
            }, OnClickVisitFriend);
        }

        public void SearchingFriend()
        {
            if (string.IsNullOrEmpty(inputField.text))
            {
                return;
            }

            var inputData = inputField.text.Trim();
            NakamaCommunityService.Instance.SearchAsync(inputData);
        }

        private void OnClickVisitFriend(FriendItemData friendItemData)
        {
            DLogger.Log("Try to visit: " + friendItemData.userId);
            Hide(true);
            GameController.Instance.LoadFriendHouse(friendItemData);
        }
    }

    [Serializable]
    public class FriendItemData
    {
        public string     userId;
        public string     userName;
        public Sprite     userAva;
        public FriendType type;
    }

    public enum FriendType
    {
        Random,
        Friend,
        Search
    }
}