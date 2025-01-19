using System;
using System.Collections.Generic;
using System.Net;
using CiFarm.RestApi;
using CiFarm.Utils;
using Cysharp.Threading.Tasks;

namespace CiFarm.GraphQL
{
    public partial class GraphQLClient
    {
        // QueryAuthAsync method with retry mechanism
        public async UniTask<TResponse> QueryAuthAsync<TVariable, TResponse>(
            string name,
            string query,
            TVariable variables = null
        )
            where TVariable : class, new()
            where TResponse : class, new()
        {
            var accessToken = AuthToken.GetAccessToken(); // Get the access token from the AuthToken class.
            if (string.IsNullOrEmpty(accessToken)) // Check if the access token is empty or null.
            {
                throw new Exception("Access token not found."); // Throw an exception if the access token is not found.
            }

            try
            {
                return await QueryAsync<TVariable, TResponse>( // Make a POST request with the provided request body and return the response.
                    name, // The name of the query
                    query, // The endpoint URL
                    variables, // The request body
                    new Dictionary<string, string>() // Additional headers (in this case, the Authorization header with the access token)
                    {
                        { "Authorization", $"Bearer {accessToken}" },
                    }
                );
            }
            catch (UnityWebRequestException ex)
            {
                if (ex.ResponseCode == (long)HttpStatusCode.Unauthorized)
                {
                    var refreshRequest = new RefreshRequest
                    {
                        RefreshToken = AuthToken.GetRefreshToken(),
                    };
                    // Create a new RefreshRequest object with the refresh token.
                    var refreshResponse = await RestApiClient.RefreshAsync(refreshRequest); // Call the RefreshAsync method to get a new access token.
                    AuthToken.Save(refreshResponse.AccessToken, refreshRequest.RefreshToken); // Set the new access token in the AuthToken class.

                    return await QueryAsync<TVariable, TResponse>( // Make a POST request with the provided request body and return the response.
                        name, // The name of the query
                        query, // The endpoint URL
                        variables, // The request body
                        new Dictionary<string, string>() // Additional headers (in this case, the Authorization header with the access token)
                        {
                            { "Authorization", $"Bearer {accessToken}" },
                        }
                    );
                }
                throw; // Re-throw the exception if it's not an unauthorized error.
            }
        }
    }
}
