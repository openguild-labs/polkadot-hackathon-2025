using System.Collections.Generic; // For using dictionaries for headers and variables.
using System.Text; // For encoding request bodies to UTF8.
using CiFarm.RestApi; // Using RestApiClient for potential additional requests or functionality.
using CiFarm.Utils; // Utility functions like logging, etc.
using Cysharp.Threading.Tasks; // For using UniTask, an optimized Task alternative in Unity.
using Newtonsoft.Json; // For JSON serialization and deserialization.
using UnityEngine; // For Unity-specific classes and logging.
using UnityEngine.Networking; // For UnityWebRequest to handle HTTP requests.

namespace CiFarm.GraphQL
{
    public partial class GraphQLClient
    {
        // Base URL for the GraphQL endpoint (e.g., "https://api.example.com")
        public string BaseUrl { get; set; }

        // Retry count (default set to 2). Specifies the number of retries allowed in case of failure.
        public int RetryCount { get; set; } = 2;

        // Retry interval (default set to 2000 ms or 2 seconds). Time to wait before retrying after a failure.
        public int RetryInterval { get; set; } = 2000;

        // RestApiClient instance for making general REST API requests, if needed.
        public RestApiClient RestApiClient { get; set; }

        /// <summary>
        /// Executes a GraphQL query asynchronously with retries in case of failure.
        /// </summary>
        /// <typeparam name="TVariable">The type of the variables used in the GraphQL query.</typeparam>
        /// <typeparam name="TResponse">The type of the response expected from the GraphQL query.</typeparam>
        /// <param name="name">The name of the query or operation (e.g., "getUserData").</param>
        /// <param name="query">The actual GraphQL query string (e.g., "{ getUserData { id name } }").</param>
        /// <param name="variables">Optional variables to include in the query (null by default).</param>
        /// <param name="additionalHeaders">Any additional headers for the request (null by default).</param>
        /// <param name="currentRetryCount">The current retry attempt count (default is 0).</param>
        /// <returns>A task that represents the asynchronous operation, with the response of type TResponse.</returns>
        public async UniTask<TResponse> QueryAsync<TVariable, TResponse>(
            string name, // The name of the query or mutation
            string query, // The GraphQL query string
            TVariable variables = null, // The optional variables for the query
            Dictionary<string, string> additionalHeaders = null, // Additional headers for the request
            int currentRetryCount = 0 // The current retry attempt count
        )
            where TVariable : class, new() // TVariable must be a class and have a parameterless constructor
            where TResponse : class, new() // TResponse must be a class and have a parameterless constructor
        {
            // Log the GraphQL query request URL for debugging purposes
            ConsoleLogger.LogDebug($"GraphQL Query request to '{BaseUrl}'");

            // Construct the request body as an anonymous object containing the query and variables.
            var requestBody = new { query, variables };

            // Serialize the request body to a JSON string using Newtonsoft.Json.
            var jsonBody = JsonConvert.SerializeObject(requestBody, Formatting.Indented);

            // Create a UnityWebRequest for the POST method to send the GraphQL query.
            using var webRequest = new UnityWebRequest()
            {
                url = $"{BaseUrl}/graphql", // Build the full URL to the /graphql endpoint
                method = UnityWebRequest.kHttpVerbPOST, // Set the request method to POST
                uploadHandler = new UploadHandlerRaw(Encoding.UTF8.GetBytes(jsonBody)), // Attach the serialized JSON body
                downloadHandler = new DownloadHandlerBuffer(), // Use a buffer to download the response
            };

            // Set the content type header to "application/json" to indicate that the request body is JSON.
            webRequest.SetRequestHeader("Content-Type", "application/json");

            // If there are any additional headers, set them on the request.
            if (additionalHeaders != null)
            {
                foreach (var header in additionalHeaders)
                {
                    webRequest.SetRequestHeader(header.Key, header.Value);
                }
            }

            try
            {
                // Send the request asynchronously and wait for its response
                await webRequest.SendWebRequest().ToUniTask();

                // Parse the response body as a GraphQL response
                var responseBody = webRequest.downloadHandler.text;
                ConsoleLogger.LogWarning($"GraphQL Response: {responseBody}");
                // Deserialize the response body into a GraphQLResponse object.
                var response = JsonConvert.DeserializeObject<GraphQLResponse<TResponse>>(
                    responseBody,
                    new DefaultJsonConverter<TResponse>() // Use a custom JSON converter if necessary.
                );
                ConsoleLogger.LogWarning(response);

                // Return the data corresponding to the specified query name from the GraphQL response.
                return response.GetData(name);
            }
            catch (UnityWebRequestException ex)
            {
                // Handle any exceptions that occur during the request (e.g., network errors, timeouts)
                Debug.LogError(
                    $"Error during request (Attempt {currentRetryCount + 1}/{RetryCount}): {ex.Message}"
                );

                // If the current retry count is less than the maximum retry count, retry the request
                if (currentRetryCount < RetryCount)
                {
                    // Wait for the specified retry interval before retrying the request
                    await UniTask.Delay(RetryInterval);

                    // Retry the request by recursively calling QueryAsync
                    return await QueryAsync<TVariable, TResponse>(
                        name, // The same query name
                        query, // The same query string
                        variables, // The same variables
                        additionalHeaders, // The same additional headers
                        currentRetryCount + 1 // Increment the retry attempt count
                    );
                }

                // If maximum retry attempts are reached, rethrow the exception
                throw;
            }
        }
    }
}
