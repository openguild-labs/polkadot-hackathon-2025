using System.Collections;
using AYellowpaper.SerializedCollections;
using CiFarm.Core.Credentials;
using CiFarm.GraphQL;
using CiFarm.IO;
using CiFarm.RestApi;
using CiFarm.Utils;
using Cysharp.Threading.Tasks;
using Firesplash.GameDevAssets.SocketIOPlus;
using Imba.Utils;
using UnityEngine;
using UnityEngine.Events;

namespace CiFarm
{
    /// <summary>
    /// Main SDK component for initializing the CiFarm SDK and configuring the environment.
    /// This component handles configuration for REST API, GraphQL, and Socket.IO connections,
    /// as well as authentication and credentials management.
    /// </summary>
    [AddComponentMenu("CiFarm/CiFarm SDK")]
    public class CiFarmSDK : ManualSingletonMono<CiFarmSDK>
    {
        #region REST API Configuration
        /// <summary>
        /// Dictionary to store REST API URLs for different environments (Local, Development, Staging, Production).
        /// Used to set the correct endpoint for API requests based on the selected environment.
        /// </summary>
        [Header("REST API")]
        [Tooltip("Set the REST API URLs for each environment")]
        [SerializeField]
        private SerializedDictionary<Environment, string> _restApiUrls = new()
        {
            { Environment.Local, "http://localhost:3001" },
            { Environment.Development, "https://api.cifarm.dev.starci.net" },
            { Environment.Staging, "https://api.cifarm.staging.starci.net" },
            { Environment.Production, "https://api.cifarm.starci.net" },
        };

        /// <summary>
        /// The version of the REST API to be used for requests.
        /// </summary>
        [Tooltip("Set the REST API version")]
        [SerializeField]
        private RestApiVersion _restApiVersion = RestApiVersion.V1;
        #endregion

        #region GraphQL Configuration
        /// <summary>
        /// Dictionary to store GraphQL API URLs for different environments.
        /// Used to set the correct endpoint for GraphQL queries and mutations.
        /// </summary>
        [Header("GraphQL")]
        [Tooltip("Set the GraphQL API URLs for each environment")]
        [SerializeField]
        private SerializedDictionary<Environment, string> _graphQLUrls = new()
        {
            { Environment.Local, "http://localhost:3006/graphql" },
            { Environment.Development, "https://graphql.cifarm.dev.starci.net/graphql" },
            { Environment.Staging, "https://graphql.cifarm.staging.starci.net/graphql" },
            { Environment.Production, "https://graphql.cifarm.starci.net/graphql" },
        };
        #endregion

        #region Socket.IO Configuration
        /// <summary>
        /// Dictionary to store Socket.IO server URLs for different environments.
        /// Used for establishing Socket.IO connections to the server for real-time communication.
        /// </summary>
        [Header("Socket.IO")]
        [Tooltip("Set the Socket.IO server address for each environment")]
        [SerializeField]
        private SerializedDictionary<Environment, string> _socketIoUrls = new()
        {
            { Environment.Local, "http://localhost:3003" },
            { Environment.Development, "https://ws.cifarm.dev.starci.net" },
            { Environment.Staging, "https://ws.cifarm.staging.starci.net" },
            { Environment.Production, "https://ws.cifarm.starci.net" },
        };
        #endregion

        #region Common Configuration
        /// <summary>
        /// The environment setting for the SDK (Local, Development, Staging, Production).
        /// Determines which API and Socket.IO URLs to use based on the selected environment.
        /// </summary>
        [Header("Common")]
        [Tooltip("Set the environment for using CiFarm SDK")]
        [SerializeField]
        private Environment _environment = Environment.Local;

        /// <summary>
        /// Log scope setting that helps in debugging by controlling the verbosity of logs.
        /// </summary>
        [Tooltip("Set the log scope, useful for debugging")]
        [SerializeField]
        private LogScope _logScope = LogScope.All;

        /// <summary>
        /// The interval (in milliseconds) between retry attempts in case of a failed request.
        /// </summary>
        [Tooltip("Set the retry interval")]
        [SerializeField]
        private int _retryInterval = 2000;

        /// <summary>
        /// The maximum number of retry attempts in case of a failed request.
        /// </summary>
        [Tooltip("Set the retry count")]
        [SerializeField]
        private int _retryCount = 2;
        #endregion

        #region Editor Configuration
        /// <summary>
        /// Credentials for the editor that are used for authentication and signature generation.
        /// </summary>
        [Header("Editor")]
        [Tooltip("Credentials for the developer")]
        [SerializeField]
        private Credentials _credentials = null;

        public void SetCredentials(Credentials credentials)
        {
            _credentials = credentials;
        }

        /// <summary>
        /// Page size for pagination in the editor.
        /// </summary>
        [field: SerializeField]
        public int PageSize { get; set; } = 10;

        /// <summary>
        /// Flag to indicate whether the SDK is authenticated and ready to use.
        /// </summary>
        [field: SerializeField]
        public bool Authenticated { get; set; } = false;

        /// <summary>
        /// Chain key used for the editor's authentication process.
        /// </summary>
        [SerializeField]
        private SupportedChainKey _chainKey;

        /// <summary>
        /// The network setting for the editor's authentication process.
        /// </summary>
        [SerializeField]
        private Network _network;

        /// <summary>
        /// Account number for the editor's authentication process.
        /// </summary>
        [SerializeField]
        private int _accountNumber;
        #endregion

        /// <summary>
        /// API Client for performing REST API requests.
        /// </summary>
        public RestApiClient RestApiClient { get; set; }

        /// <summary>
        /// GraphQL Client for performing GraphQL queries and mutations.
        /// </summary>
        public GraphQLClient GraphQLClient { get; set; }

        /// <summary>
        /// IO Client for managing real-time communication with the server.
        /// </summary>
        public IOClient IOClient { get; set; }

        /// <summary>
        /// Socket.IO Client for managing real-time communication with the server.
        /// </summary>
        [Tooltip("Set the Socket.IO client instance, leave empty to create a new one")]
        [field: SerializeField]
        public SocketIOClient SocketIOClient { get; set; }

        /// <summary>
        /// Event to be invoked when the authentication process is successful.
        /// </summary>
        [field: SerializeField]
        public UnityAction OnAuthenticatedSuccess { get; set; }

        /// <summary>
        /// Event to be invoked when the authentication process fails.
        /// </summary>
        [field: SerializeField]
        public UnityAction OnAuthenticatedFailed { get; set; }

        /// <summary>
        /// Starts the authentication process for the SDK.
        /// In the editor, it will authenticate using the provided credentials.
        /// </summary>
        public void Authenticate()
        {
            StartCoroutine(AuthenticateCoroutine());
        }

        /// <summary>
        /// Coroutine that waits for credentials to be available and starts the authentication process.
        /// In the Unity editor, it proceeds asynchronously without waiting for credentials.
        /// </summary>
        private IEnumerator AuthenticateCoroutine()
        {
            var task = TryRefreshAuthTokenAsync();
            yield return new WaitUntil(() => task.Status.IsCompletedSuccessfully());

            if (task.GetAwaiter().GetResult())
            {
                yield return null;
            }
#if UNITY_EDITOR
            AuthenticateAsync();
#else
            yield return new WaitUntil(() => !string.IsNullOrEmpty(_credentials.AccountAddress));
            AuthenticateAsync(false);
#endif
            yield return null;
        }

        /// <summary>
        /// Handles the actual authentication process asynchronously.
        /// This involves generating a signature and verifying it to obtain access tokens.
        /// </summary>


        private async UniTask<bool> TryRefreshAuthTokenAsync()
        {
            var refreshToken = AuthToken.GetRefreshToken();
            if (!string.IsNullOrEmpty(refreshToken))
            {
                try
                {
                    var refreshTokenResponse = await RestApiClient.RefreshAsync(
                        new() { RefreshToken = refreshToken }
                    );
                    AuthToken.Save(
                        refreshTokenResponse.AccessToken,
                        refreshTokenResponse.RefreshToken
                    );
                    Authenticated = true;
                    return true;
                }
                catch (UnityWebRequestException error)
                {
                    ConsoleLogger.LogError(
                        $"Error refreshing token: {error.Message}, try using signature..."
                    );
                    return false;
                }
            }
            return false;
        }

        private async void AuthenticateAsync(bool editor = true)
        {
            try
            {
                if (editor)
                {
                    // Generate signature for the editor using account and network details
                    var generateSignatureResponse = await RestApiClient.GenerateSignatureAsync(
                        new()
                        {
                            ChainKey = _chainKey,
                            Network = _network,
                            AccountNumber = _accountNumber,
                        }
                    );

                    // Set the credentials with the generated signature and other details
                    _credentials.ChainKey = generateSignatureResponse.ChainKey;
                    _credentials.Message = generateSignatureResponse.Message;
                    _credentials.PublicKey = generateSignatureResponse.PublicKey;
                    _credentials.Signature = generateSignatureResponse.Signature;
                    _credentials.Network = generateSignatureResponse.Network;
                    _credentials.TelegramInitDataRaw =
                        generateSignatureResponse.TelegramInitDataRaw;
                    _credentials.AccountAddress = generateSignatureResponse.AccountAddress;
                }

                // Verify the generated signature and obtain the authentication token
                var verifyMessageResponse = await RestApiClient.VerifyMessageAsync(
                    new()
                    {
                        Message = _credentials.Message,
                        PublicKey = _credentials.PublicKey,
                        Signature = _credentials.Signature,
                        ChainKey = _credentials.ChainKey,
                        Network = _credentials.Network,
                        AccountAddress = _credentials.AccountAddress,
                    }
                );
                // Save the authentication tokens (access and refresh tokens)
                AuthToken.Save(
                    verifyMessageResponse.AccessToken,
                    verifyMessageResponse.RefreshToken
                );
                Authenticated = true;
                OnAuthenticatedSuccess?.Invoke();
            }
            catch (UnityWebRequestException error)
            {
                ConsoleLogger.LogError($"Error authenticating: {error.Message}");
                OnAuthenticatedFailed?.Invoke();
                Authenticated = false;
            }
        }

        /// <summary>
        /// Initialize the SDK by setting up REST API, GraphQL, and Socket.IO clients.
        /// </summary>

        private string _restApiUrl;
        private string _graphQLUrl;
        private string _socketIoUrl;

        public void Start()
        {
            // Set the log scope for debugging
            ConsoleLogger.LogScope = _logScope;

            // Initialize the REST API client with the correct base URL and version
            _restApiUrl = _restApiUrls[_environment];
            RestApiClient = new RestApiClient()
            {
                BaseUrl = _restApiUrl,
                ApiVersion = _restApiVersion,
                RetryInterval = _retryInterval,
                RetryCount = _retryCount,
            };

            // Initialize the GraphQL client with the correct base URL and associated REST API client
            _graphQLUrl = _graphQLUrls[_environment];
            GraphQLClient = new GraphQLClient()
            {
                BaseUrl = _graphQLUrl,
                RestApiClient = RestApiClient,
                RetryCount = _retryCount,
                RetryInterval = _retryInterval,
            };

            // Initialize the Socket.IO client with the correct server address
            _socketIoUrl = _socketIoUrls[_environment];
            if (SocketIOClient == null)
            {
                SocketIOClient = gameObject.AddComponent<SocketIOClient>();
                SocketIOClient.serverAddress = _socketIoUrl;
            }

            if (IOClient == null)
            {
                IOClient = gameObject.AddComponent<IOClient>();
            }

            ConsoleLogger.LogSuccess("CiFarm SDK initialized successfully");
        }

        /// <summary>
        /// On Authentication Success
        /// </summary>
    }

    /// <summary>
    /// Enum to represent different environments (Local, Development, Staging, Production)
    /// Used for switching between different environments and configurations.
    /// </summary>
    public enum Environment
    {
        Local,
        Development,
        Staging,
        Production,
    }
}
