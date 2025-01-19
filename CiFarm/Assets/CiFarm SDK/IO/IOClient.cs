using System;
using System.Collections;
using CiFarm.Utils;
using Imba.Utils;
using Newtonsoft.Json;
using UnityEngine;

namespace CiFarm.IO
{
    public partial class IOClient : ManualSingletonMono<IOClient>
    {
        //connect to gameplay namespace
        private IEnumerator Start()
        {
            // wait until the CiFarm SDK is initialized and authenticated, the socket client is connected
            yield return new WaitUntil(
                () => CiFarmSDK.Instance.SocketIOClient != null && CiFarmSDK.Instance.Authenticated
            );

            CiFarmSDK.Instance.SocketIOClient.SetAuthPayloadCallback(GetAuthData);

            CiFarmSDK.Instance.SocketIOClient.OnEngineIODisconnect.AddListener(
                OnEngineIODisconnect
            );

            CiFarmSDK.Instance.SocketIOClient.D.On(
                "connect",
                () =>
                {
                    ConsoleLogger.LogSuccess("Connected to the engine.io server");
                    ConnectToGameplayNamespace();
                }
            );
            CiFarmSDK.Instance.SocketIOClient.Connect();
        }

        private object GetAuthData(string namespacePath)
        {
            if (!namespacePath.Equals("/"))
            {
                return new AuthData() { Token = AuthToken.GetAccessToken() };
            }
            return null;
        }

        private void OnEngineIODisconnect(bool unexpected, string reason)
        {
            ConsoleLogger.LogError(
                $"Disconnected from the engine.io server, unexpected: {unexpected}, reason: {reason}"
            );
        }
    }

    [System.Serializable]
    public class AuthData
    {
        [SerializeField]
        private string _token;

        [JsonProperty("token")]
        public string Token
        {
            get => _token;
            set => _token = value;
        }
    }
}
