using Cysharp.Threading.Tasks;

namespace CiFarm.RestApi
{
    public partial class RestApiClient
    {
        // Asynchronous method to update the tutorial progress by sending a POST request to the "update-tutorial" endpoint.
        // This method will send the UpdateTutorialRequest and return the UpdateTutorialResponse.
        public async UniTask<UpdateTutorialResponse> UpdateTutorial(UpdateTutorialRequest request)
        {
            var endpoint = GetEndpoint("update-tutorial"); // Build the full URL for the "update-tutorial" endpoint.
            return await PostAuthAsync<UpdateTutorialRequest, UpdateTutorialResponse>(
                endpoint, // Full URL of the endpoint
                request // Request data (UpdateTutorialRequest)
            );
        }
    }
}
