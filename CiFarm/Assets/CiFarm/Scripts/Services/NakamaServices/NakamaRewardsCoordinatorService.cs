using System.Collections;
using System.Collections.Generic;
using System.Linq;
using CiFarm.Scripts.Services.NakamaServices.BaseServices;
using CiFarm.Scripts.Utilities;
using Imba.Utils;
using Newtonsoft.Json;
using UnityEngine;

namespace CiFarm.Scripts.Services.NakamaServices
{
    public class NakamaRewardsCoordinatorService : ManualSingletonMono<NakamaRewardsCoordinatorService>
    {

        [ReadOnly]
        public List<DailyReward> dailyRewards;

        [ReadOnly]
        public List<Spin> spins;
        private IEnumerator Start()
        {
            yield return new WaitUntil(() => NakamaInitializerService.Instance.authenticated);

            //load
            LoadSpinAsync();
            LoadDailyRewardsAsync();
        }
        public async void LoadSpinAsync()
        {
            var client  = NakamaInitializerService.Instance.client;
            var session = NakamaInitializerService.Instance.session;

            var objects = await client.ListStorageObjectsAsync(session, CollectionType.Spin.GetStringValue(), limit: 10);
            spins = objects.Objects.Select(_object =>
            {
                var spin = JsonConvert.DeserializeObject<Spin>(_object.Value);
                spin.key = _object.Key;
                return spin;
            }).ToList();
        }

        public async void LoadDailyRewardsAsync()
        {
            var client  = NakamaInitializerService.Instance.client;
            var session = NakamaInitializerService.Instance.session;

            var objects = await client.ListStorageObjectsAsync(session, CollectionType.DailyRewards.GetStringValue(), limit: 10);
            dailyRewards = objects.Objects.Select(_object =>
            {
                var dailyReward = JsonConvert.DeserializeObject<DailyReward>(_object.Value);
                dailyReward.key = _object.Key;
                return dailyReward;
            }).ToList();
        }
    }
}