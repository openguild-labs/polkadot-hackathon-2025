using System;
using System.Net;
using CiFarm.Utils; // Utility functions that might be used across the API (like HTTP request helpers).
using Cysharp.Threading.Tasks;

namespace CiFarm.RestApi
{
    // Define the RestApiClient class, responsible for interacting with the API.
    // This class contains methods for various API endpoints like verifying signatures, generating signatures, etc.
    public partial class RestApiClient
    {
        /// <summary>
        /// Verifies a given signature by sending a POST request to the "verify-signature" endpoint.
        /// </summary>
        /// <param name="request">The request data containing the signature to verify.</param>
        /// <returns>A task that represents the asynchronous operation, with the response of type VerifySignatureResponse.</returns>
        public async UniTask<VerifySignatureResponse> VerifyMessageAsync(
            VerifySignatureRequest request // The request data to verify the signature
        )
        {
            var endpoint = GetEndpoint("verify-signature"); // Build the full URL for the "verify-signature" endpoint.

            // Send a POST request to the "verify-signature" endpoint, passing the request object and expecting a VerifySignatureResponse.
            return await PostAsync<VerifySignatureRequest, VerifySignatureResponse>(
                endpoint, // Full URL of the endpoint
                request // Request data (VerifySignatureRequest)
            );
        }

        /// <summary>
        /// Requests a message by sending a POST request to the "request-message" endpoint.
        /// </summary>
        /// <param name="request">The request data to retrieve the message.</param>
        /// <returns>A task that represents the asynchronous operation, with the response of type RequestMessageResponse.</returns>
        public async UniTask<RequestMessageResponse> RequestMessageAsync(
            RequestMessageRequest request // The request data to get the message
        )
        {
            var endpoint = GetEndpoint("request-message"); // Build the full URL for the "request-message" endpoint.

            // Send a POST request to the "request-message" endpoint, passing the request object and expecting a RequestMessageResponse.
            return await PostAsync<RequestMessageRequest, RequestMessageResponse>(
                endpoint, // Full URL of the endpoint
                request // Request data (RequestMessageRequest)
            );
        }

        /// <summary>
        /// Generates a signature by sending a POST request to the "generate-signature" endpoint.
        /// </summary>
        /// <param name="request">The request data containing details to generate the signature.</param>
        /// <returns>A task that represents the asynchronous operation, with the response of type GenerateSignatureResponse.</returns>
        public async UniTask<GenerateSignatureResponse> GenerateSignatureAsync(
            GenerateSignatureRequest request // The request data to generate the signature
        )
        {
            var endpoint = GetEndpoint("generate-signature"); // Build the full URL for the "generate-signature" endpoint.

            // Send a POST request to the "generate-signature" endpoint, passing the request object and expecting a GenerateSignatureResponse.
            return await PostAsync<GenerateSignatureRequest, GenerateSignatureResponse>(
                endpoint, // Full URL of the endpoint
                request // Request data (GenerateSignatureRequest)
            );
        }

        /// <summary>
        /// Refreshes the authentication tokens by sending a POST request to the "refresh" endpoint.
        /// </summary>
        /// <param name="request">The request data to refresh authentication tokens.</param>
        /// <returns>A task that represents the asynchronous operation, with the response of type RefreshResponse.</returns>
        public async UniTask<RefreshResponse> RefreshAsync(RefreshRequest request)
        {
            var endpoint = GetEndpoint("refresh"); // Build the full URL for the "refresh" endpoint.

            // Send a POST request to the "refresh" endpoint, passing the request object and expecting a RefreshResponse.
            return await PostAsync<RefreshRequest, RefreshResponse>(endpoint, request);
        }

        /// <summary>
        /// Sends a POST request with authorization (using a stored access token).
        /// If the token is expired or invalid, it will refresh the token and retry the request.
        /// </summary>
        /// <typeparam name="TRequest">The type of the request body.</typeparam>
        /// <typeparam name="TResponse">The expected response type.</typeparam>
        /// <param name="endpoint">The API endpoint to send the request to.</param>
        /// <param name="requestBody">The request data to be sent in the POST request.</param>
        /// <returns>A task that represents the asynchronous operation, with the response of type TResponse.</returns>
        public async UniTask<TResponse> PostAuthAsync<TRequest, TResponse>(
            string endpoint, // The endpoint to send the POST request to
            TRequest requestBody // The request body to send with the POST request
        )
            where TRequest : class, new()
            where TResponse : class, new()
        {
            var accessToken = AuthToken.GetAccessToken(); // Retrieve the stored access token.

            // Check if the access token is empty or null (i.e., not available)
            if (string.IsNullOrEmpty(accessToken))
            {
                throw new Exception("Access token not found."); // Throw an exception if the access token is missing.
            }

            try
            {
                // Attempt to send the POST request with the existing access token in the Authorization header
                return await PostAsync<TRequest, TResponse>(
                    endpoint, // Full URL of the endpoint
                    requestBody, // Request data (requestBody)
                    new() // Additional headers (specifically, the Authorization header with the Bearer token)
                    {
                        { "Authorization", $"Bearer {accessToken}" }, // Add the Authorization header with the access token
                    }
                );
            }
            catch (UnityWebRequestException ex)
            {
                // Handle the case when the server responds with Unauthorized (HTTP 401), which indicates an expired or invalid token
                if (ex.ResponseCode == (long)HttpStatusCode.Unauthorized)
                {
                    var refreshRequest = new RefreshRequest
                    {
                        RefreshToken = AuthToken.GetRefreshToken(), // Retrieve the stored refresh token
                    };

                    // Call the RefreshAsync method to get a new access token
                    var refreshResponse = await RefreshAsync(refreshRequest);

                    // Save the new access token and refresh token for future use
                    AuthToken.Save(refreshResponse.AccessToken, refreshRequest.RefreshToken);

                    // Retry the POST request using the new access token
                    return await PostAsync<TRequest, TResponse>(
                        endpoint, // Full URL of the endpoint
                        requestBody, // Request data (requestBody)
                        new() // Additional headers (Authorization header with the new access token)
                        {
                            { "Authorization", $"Bearer {refreshResponse.AccessToken}" }, // Add the new Authorization header
                        }
                    );
                }

                // If the error is not due to unauthorized access (401), re-throw the original exception
                throw;
            }
        }
    }
}
