using CiFarm.Scripts.Services.NakamaServices.BaseServices;
using CiFarm.Scripts.Utilities;
using Imba.Utils;
using Nakama;
using Newtonsoft.Json;
using System.Collections;
using System.Linq;
using UnityEngine;

namespace CiFarm.Scripts.Services.NakamaServices
{
    public class NakamaSystemService : ManualSingletonMono<NakamaSystemService>
    {
        [Header("Activities")]
        [ReadOnly]
        public Activities activities;

        [Header("Rewards")]
        [ReadOnly]
        public Rewards rewards;

        [Header("Crop Randomness")]
        [ReadOnly]
        public CropRandomness cropRandomness;

        [Header("Token Configure")]
        [ReadOnly]
        public TokenConfigure tokenConfigure;

        [Header("Starter Configure")]
        [ReadOnly]
        public StarterConfigure starterConfigure;

        [Header("SpinConfigure")]
        [ReadOnly]
        public SpinConfigure spinConfigure;

        private IEnumerator Start()
        {
            yield return new WaitUntil(() => NakamaInitializerService.Instance.authenticated);

            //load
            LoadActivitiesAsync();
            LoadRewardsAsync();
            LoadCropRandomnessAsync();
            LoadTokenConfigureAsync();
            LoadStarterConfigureAsync();
            LoadSpinConfigureAsync();
        }

        public async void LoadActivitiesAsync()
        {
            var client  = NakamaInitializerService.Instance.client;
            var session = NakamaInitializerService.Instance.session;

            var objects = await client.ReadStorageObjectsAsync(session, new StorageObjectId[]
            {
                new()
                {
                    Collection = CollectionType.System.GetStringValue(),
                    Key        = SystemKey.Activities.GetStringValue(),
                }
            });
            activities = JsonConvert.DeserializeObject<Activities>(objects.Objects.First().Value);
        }

        public async void LoadRewardsAsync()
        {
            var client  = NakamaInitializerService.Instance.client;
            var session = NakamaInitializerService.Instance.session;

            var objects = await client.ReadStorageObjectsAsync(session, new StorageObjectId[]
            {
                new()
                {
                    Collection = CollectionType.System.GetStringValue(),
                    Key        = SystemKey.Rewards.GetStringValue(),
                }
            });
            rewards = JsonConvert.DeserializeObject<Rewards>(objects.Objects.First().Value);
        }

        public async void LoadCropRandomnessAsync()
        {
            var client  = NakamaInitializerService.Instance.client;
            var session = NakamaInitializerService.Instance.session;

            var objects = await client.ReadStorageObjectsAsync(session, new StorageObjectId[]
            {
                new()
                {
                    Collection = CollectionType.System.GetStringValue(),
                    Key        = SystemKey.CropRandomness.GetStringValue(),
                }
            });
            cropRandomness = JsonConvert.DeserializeObject<CropRandomness>(objects.Objects.First().Value);
        }

        public async void LoadTokenConfigureAsync()
        {
            var client  = NakamaInitializerService.Instance.client;
            var session = NakamaInitializerService.Instance.session;

            var objects = await client.ReadStorageObjectsAsync(session, new StorageObjectId[]
            {
                new()
                {
                    Collection = CollectionType.System.GetStringValue(),
                    Key        = SystemKey.TokenConfigure.GetStringValue(),
                }
            });
            tokenConfigure = JsonConvert.DeserializeObject<TokenConfigure>(objects.Objects.First().Value);
        }

        public async void LoadStarterConfigureAsync()
        {
            var client  = NakamaInitializerService.Instance.client;
            var session = NakamaInitializerService.Instance.session;

            var objects = await client.ReadStorageObjectsAsync(session, new StorageObjectId[]
            {
                new()
                {
                    Collection = CollectionType.System.GetStringValue(),
                    Key        = SystemKey.StarterConfigure.GetStringValue(),
                }
            });
            starterConfigure = JsonConvert.DeserializeObject<StarterConfigure>(objects.Objects.First().Value);
        }

        public async void LoadSpinConfigureAsync()
        {
            var client  = NakamaInitializerService.Instance.client;
            var session = NakamaInitializerService.Instance.session;

            var objects = await client.ReadStorageObjectsAsync(session, new StorageObjectId[]
            {
                new()
                {
                    Collection = CollectionType.System.GetStringValue(),
                    Key        = SystemKey.SpinConfigure.GetStringValue(),
                }
            });
            spinConfigure = JsonConvert.DeserializeObject<SpinConfigure>(objects.Objects.First().Value);
        }
    }
}