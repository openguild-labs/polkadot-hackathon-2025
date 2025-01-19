using System;
using System.Collections;
using System.Collections.Generic;
using CiFarm.Scripts.Utilities;
using Imba.Utils;
using Nakama;
using Newtonsoft.Json;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.Networking;

namespace CiFarm.Scripts.Services.NakamaServices.BaseServices
{
    public class NakamaInitializerService : ManualSingletonMono<NakamaInitializerService>
    {
        public UnityAction OnLoginError;
        public UnityAction OnLoginSuccess;
        
        [Header("Nakama Config")]
        [SerializeField] private bool useLocal = true;

        [SerializeField] private bool   useHttps = true;
        [SerializeField] private string host     = "api.cifarm-server.starci.net";

        [SerializeField] private int    port      = 443;
        [SerializeField] private string serverKey = "defaultkey";

        [Header("Testing Config Editor")]
        [SerializeField] private SupportedChain testChainKey;

        [SerializeField] private int testAccountNumber;

        public bool IsLogin => (credentials != null) && authenticated;

        public Client   client  = null;
        public ISession session = null;
        public IApiUser user    = null;

        //credentials
        private Credentials credentials = null;

        //authenticate state
        [HideInInspector]
        public bool authenticated = false;

        public bool Uselocal => useLocal;

        public override void Awake()
        {
            base.Awake();
        }

        private IEnumerator Start()
        {
#if UNITY_EDITOR
            //set fake credentials for edtior only
            SetEditorCredentials();
#endif

            yield return new WaitUntil(() => credentials != null);
            //initialize
            InitializeClient();

            //authenticate
            AuthenticateAsync();
            yield return new WaitUntil(() => authenticated);
            
            //healthcheck
            HealthCheckAsync();
        }

        private void SetEditorCredentials()
        {
            StartCoroutine(FetchCredentialsFromApi(useLocal));
        }

        /// <summary>
        /// Called from React app to set credentials, then break the coroutine
        /// </summary>
        /// <param name="payload"></param>
        public void SetCredentials(string payload)
        {
            credentials = JsonConvert.DeserializeObject<Credentials>(payload);
        }

        public void InitializeClient()
        {
            try
            {
                if (useLocal)
                {
                    client = new Client("http", "localhost", 7350, "defaultkey", UnityWebRequestAdapter.Instance)
                    {
                        Timeout                  = 5, //5s
                        GlobalRetryConfiguration = new RetryConfiguration(1, 0)
                    };
                }
                else
                {
                    var scheme = useHttps ? "https" : "http";
                    client = new Client(scheme, host, port, serverKey, UnityWebRequestAdapter.Instance)
                    {
                        Timeout                  = 5, //5s
                        GlobalRetryConfiguration = new RetryConfiguration(1, 0)
                    };
                }
            }
            catch (Exception e)
            {
                DLogger.Log(e.Message, "Nakama", LogColors.Gold);
            }
        }

        public async void AuthenticateAsync()
        {
            try
            {
                DLogger.Log(JsonConvert.SerializeObject(credentials));
                DLogger.Log("Authenticating...", "Nakama", LogColors.Gold);
                session = await client.AuthenticateCustomAsync("starci", null, false, new Dictionary<string, string>
                {
                    { "message", credentials.message },
                    { "publicKey", credentials.publicKey },
                    { "signature", credentials.signature },
                    { "chainKey", credentials.chainKey },
                    { "network", credentials.network },
                    { "telegramInitDataRaw", credentials.telegramInitDataRaw },
                    { "botType", credentials.botType },
                    { "accountAddress", credentials.accountAddress }
                });
                authenticated = true;
            }
            catch (Exception e)
            {
                DLogger.Log(e.Message, "Nakama", LogColors.OrangeRed);
                OnLoginError?.Invoke();
            }
        }

        public async void HealthCheckAsync()
        {
            try
            {
                var result   = await client.RpcAsync(session, "go_healthcheck");
                var response = JsonConvert.DeserializeObject<GoHealthcheckResponse>(result.Payload);

                if (response.status == "ok")
                {
                    DLogger.Log("Healthcheck succeeded", "Nakama", LogColors.LimeGreen);
                }
            }
            catch (Exception e)
            {
                DLogger.Log(e.ToString(), "Nakama", LogColors.Gold);
            }
        }

        #region Testing

        private IEnumerator FetchCredentialsFromApi(bool useLocal = false)
        {
            var url = useLocal
                ? "http://localhost:9999/api/v1/authenticator/fake-signature"
                : "https://cifarm.periphery.starci.net/api/v1/authenticator/fake-signature";

            using UnityWebRequest webRequest = UnityWebRequest.Post(url, new Dictionary<string, string>()
            {
                { "chainKey", testChainKey.GetStringValue() },
                { "accountNumber", testAccountNumber.ToString() }
            });
            DLogger.Log("FetchCredentialsFromApi For: " + testChainKey + " with account: " + testAccountNumber);
            yield return webRequest.SendWebRequest();

            if (webRequest.result != UnityWebRequest.Result.Success)
            {
                DLogger.LogError($"Error fetching credentials: {webRequest.error}");
                yield break;
            }

            var json     = webRequest.downloadHandler.text;
            var response = JsonConvert.DeserializeObject<TestAccountResponse>(json);
            DLogger.Log("FetchCredentialsFromApi For: " + testChainKey + " with account: " + testAccountNumber);

            if (response != null && response.Data != null)
            {
                credentials = response.Data;
            }
            else
            {
                DLogger.LogError("Failed to parse API response.");
            }
        }

        [Serializable]
        public class TestAccountResponse
        {
            [JsonProperty("message")]
            public string Message { get; set; }

            [JsonProperty("data")]
            public Credentials Data { get; set; }
        }

        [Serializable]
        public enum SupportedChain
        {
            [EnumStringValue("avalanche")]
            Avalanche,
            [EnumStringValue("solana")]
            Solana,
            [EnumStringValue("aptos")]
            Aptos,
            [EnumStringValue("algorand")]
            Algorand,
            [EnumStringValue("polkadot")]
            Polkadot
        }

        #endregion
    }
}