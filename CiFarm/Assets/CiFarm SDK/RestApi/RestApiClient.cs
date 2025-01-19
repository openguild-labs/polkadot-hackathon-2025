using System.Collections.Generic;
using CiFarm.Utils;
using Cysharp.Threading.Tasks;
using Newtonsoft.Json;
using UnityEngine.Networking;

namespace CiFarm.RestApi
{
    // Enum representing the version of the API to be used
    public enum RestApiVersion
    {
        [EnumStringValue("v1")]
        V1,

        [EnumStringValue("v2")]
        V2,
    }

    public partial class RestApiClient
    {
        // Default constructor initializes a new instance of the RestApiClient
        public RestApiClient() { }

        // The base URL for the API (to be configured for the specific environment or API service)
        public string BaseUrl { get; set; }

        // Maximum number of retry attempts when a request fails due to network issues
        public int RetryCount { get; set; } = 2;

        // Interval in milliseconds to wait before retrying a failed request
        public int RetryInterval { get; set; } = 2000;

        // The API version to be used in the request (defaults to v1)
        public RestApiVersion ApiVersion { get; set; } = RestApiVersion.V1;

        /// <summary>
        /// Sends a GET request to the specified endpoint, with error handling and retry logic.
        /// Retries the request if it fails due to network or protocol errors, up to the specified retry count.
        /// </summary>
        /// <typeparam name="TResponse">The expected response type</typeparam>
        /// <param name="endpoint">The API endpoint to send the GET request to</param>
        /// <param name="currentRetryCount">The current retry attempt count (used for recursive retries)</param>
        /// <returns>A task representing the asynchronous operation, with a result of type TResponse</returns>
        private async UniTask<TResponse> GetAsync<TResponse>(
            string endpoint,
            int currentRetryCount = 0
        )
        {
            ConsoleLogger.LogDebug($"GET request to '{BaseUrl}/{endpoint}'");

            // Create a UnityWebRequest for the GET request
            using var webRequest = new UnityWebRequest
            {
                // Construct the request URL by combining the base URL, API version, and endpoint
                url = $"{BaseUrl}/{ApiVersion.GetStringValue()}/{endpoint}",

                // Set the HTTP method to GET
                method = UnityWebRequest.kHttpVerbGET,
            };

            try
            {
                // Send the GET request asynchronously and await the response
                await webRequest.SendWebRequest().ToUniTask();

                // Deserialize the response body to the specified response type
                string responseBody = webRequest.downloadHandler.text;
                return JsonConvert.DeserializeObject<TResponse>(responseBody);
            }
            catch (UnityWebRequestException ex)
            {
                // If there was a connection error or protocol error, retry the request if needed
                if (
                    ex.Result == UnityWebRequest.Result.ConnectionError
                    || ex.Result == UnityWebRequest.Result.ProtocolError
                )
                {
                    // If the retry limit hasn't been reached, retry the request
                    if (currentRetryCount < RetryCount)
                    {
                        ConsoleLogger.LogDebug(
                            $"Retrying GET request to '{endpoint}' due to {ex.Result}."
                        );

                        // Wait for the specified retry interval before retrying
                        await UniTask.Delay(RetryInterval);

                        // Recursively retry the request
                        return await GetAsync<TResponse>(endpoint, currentRetryCount + 1);
                    }
                    else
                    {
                        // If the retry limit is exceeded, throw the exception to indicate failure
                        throw;
                    }
                }

                // If the exception is not related to network issues, rethrow the exception
                throw;
            }
        }

        /// <summary>
        /// Sends a POST request to the specified endpoint, including a request body.
        /// Includes error handling and retry logic to handle transient errors.
        /// </summary>
        /// <typeparam name="TRequest">The type of the request body</typeparam>
        /// <typeparam name="TResponse">The expected response type</typeparam>
        /// <param name="endpoint">The API endpoint to send the POST request to</param>
        /// <param name="requestBody">The request body to send with the POST request</param>
        /// <param name="additionalHeaders">Additional headers to be included in the request</param>
        /// <param name="currentRetryCount">The current retry attempt count (used for recursive retries)</param>
        /// <returns>A task representing the asynchronous operation, with a result of type TResponse</returns>
        public async UniTask<TResponse> PostAsync<TRequest, TResponse>(
            string endpoint,
            TRequest requestBody,
            Dictionary<string, string> additionalHeaders = null,
            int currentRetryCount = 0
        )
            where TRequest : class, new()
            where TResponse : class, new()
        {
            ConsoleLogger.LogDebug($"POST request to '{endpoint}'");

            // Create a new UnityWebRequest for the POST request
            using var webRequest = new UnityWebRequest();

            // Serialize the request body to JSON format
            var jsonBody = JsonConvert.SerializeObject(
                requestBody,
                Formatting.Indented, // Pretty-print the JSON for easier reading (optional)
                new DefaultJsonConverter<TRequest>() // Use custom converter to handle enums as strings
            );

            // Construct the request URL with base URL, API version, and endpoint
            webRequest.url = $"{BaseUrl}/{ApiVersion.GetStringValue()}/{endpoint}";

            // Set the HTTP method to POST
            webRequest.method = UnityWebRequest.kHttpVerbPOST;

            // Convert the JSON body to bytes and set it as the request payload
            var bodyRaw = System.Text.Encoding.UTF8.GetBytes(jsonBody);
            webRequest.uploadHandler = new UploadHandlerRaw(bodyRaw);
            webRequest.downloadHandler = new DownloadHandlerBuffer();

            // Set the content type to application/json
            webRequest.SetRequestHeader("Content-Type", "application/json");

            // If there are additional headers, set them in the request
            if (additionalHeaders != null)
            {
                foreach (var header in additionalHeaders)
                {
                    webRequest.SetRequestHeader(header.Key, header.Value);
                }
            }

            try
            {
                // Send the POST request asynchronously and await the response
                await webRequest.SendWebRequest().ToUniTask();

                // Deserialize the response body to the specified response type
                string responseBody = webRequest.downloadHandler.text;

                ConsoleLogger.LogSuccess($"POST request to '{endpoint}' succeeded.");
                return JsonConvert.DeserializeObject<TResponse>(
                    responseBody,
                    new DefaultJsonConverter<TResponse>() // Use custom converter for enums
                );
            }
            catch (UnityWebRequestException ex)
            {
                // If there was a connection error or protocol error, retry the request if needed
                if (
                    ex.Result == UnityWebRequest.Result.ConnectionError
                    || ex.Result == UnityWebRequest.Result.ProtocolError
                )
                {
                    // If the retry limit hasn't been reached, retry the request
                    if (currentRetryCount < RetryCount)
                    {
                        ConsoleLogger.LogDebug(
                            $"Retrying POST request to '{endpoint}' due to {ex.Result}."
                        );

                        // Wait for the specified retry interval before retrying
                        await UniTask.Delay(RetryInterval);

                        // Recursively retry the request
                        return await PostAsync<TRequest, TResponse>(
                            endpoint,
                            requestBody,
                            additionalHeaders,
                            currentRetryCount + 1
                        );
                    }
                    else
                    {
                        // If the retry limit is exceeded, throw the exception to indicate failure
                        throw;
                    }
                }

                // If the exception is not related to network issues, rethrow the exception
                throw;
            }
        }
    }
}
