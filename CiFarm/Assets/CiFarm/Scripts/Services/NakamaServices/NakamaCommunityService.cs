using CiFarm.Scripts.Utilities;
using Imba.Utils;
using Nakama;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using CiFarm.Scripts.Services.NakamaServices.BaseServices;
using UnityEngine;
using UnityEngine.Events;

namespace CiFarm.Scripts.Services.NakamaServices
{
    public class NakamaCommunityService : ManualSingletonMono<NakamaCommunityService>
    {
        public UnityAction       OnSearchUsersUpdate;
        public UnityAction<bool> OnVisitUser;
        public UnityAction<bool> OnReturn;

        [ReadOnly]
        public List<User> searchUsers;

        [ReadOnly]
        public string visitUserId;

        [ReadOnly]
        public User randomUser;

        public IEnumerator Start()
        {
            yield return new WaitUntil(() => NakamaInitializerService.Instance.authenticated);
            SetRandomUserAsync();
        }

        public async void SearchAsync(string value)
        {
            var response = await NakamaRpcService.Instance.SearchUsersRpcAsync(new()
                {
                    value = value,
                }
            );
            searchUsers = response.users;
            OnSearchUsersUpdate?.Invoke();
        }

        public async void SetRandomUserAsync()
        {
            var response = await NakamaRpcService.Instance.GetRandomUserAsync();
            randomUser = response.user;
        }

        public async void VisitAsync(string userId)
        {
            try
            {
                await NakamaRpcService.Instance.VisitRpc(new()
                {
                    userId = userId,
                });
                visitUserId = userId;
                await NakamaRpcService.Instance.ForceCentralBroadcastInstantlyRpcAsync();
                OnVisitUser?.Invoke(true);
            }
            catch (Exception ex)
            {
                DLogger.LogError(ex.Message);
                OnVisitUser?.Invoke(false);
            }
        }

        public async void ReturnAsync()
        {
            try
            {
                await NakamaRpcService.Instance.ReturnAsyncRpc();
                visitUserId = null;
                await NakamaRpcService.Instance.ForceCentralBroadcastInstantlyRpcAsync();
                OnReturn?.Invoke(true);
            }
            catch (Exception ex)
            {
                DLogger.LogError(ex.Message);
                OnReturn?.Invoke(false);
            }
        }

        public async void AddFriendByUsernameAsync(string username)
        {
            var client  = NakamaInitializerService.Instance.client;
            var session = NakamaInitializerService.Instance.session;

            await client.AddFriendsAsync(session, null, new List<string> { username });
        }

        public async Task<IApiFriendList> ListFriendsAsync(string cursor)
        {
            var client  = NakamaInitializerService.Instance.client;
            var session = NakamaInitializerService.Instance.session;
            return await client.ListFriendsAsync(session, null, 10, cursor);
        }
    }
}