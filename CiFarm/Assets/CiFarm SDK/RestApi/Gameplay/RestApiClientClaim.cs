using Cysharp.Threading.Tasks;

namespace CiFarm.RestApi
{
    public partial class RestApiClient
    {
        // Asynchronous method to claim the daily reward by sending a POST request to the "claim-daily-reward" endpoint.
        // This method will send the ClaimDailyRewardRequest and return the ClaimDailyRewardResponse.
        public async UniTask<ClaimDailyRewardResponse> ClaimDailyReward(
            ClaimDailyRewardRequest request // The request data to claim the daily reward
        )
        {
            var endpoint = GetEndpoint("claim-daily-reward"); // Build the full URL for the "claim-daily-reward" endpoint.

            // Make the POST request to the "claim-daily-reward" endpoint, passing the request object and expecting a response of type ClaimDailyRewardResponse.
            return await PostAuthAsync<ClaimDailyRewardRequest, ClaimDailyRewardResponse>(
                endpoint, // Full URL of the endpoint
                request // Request data (ClaimDailyRewardRequest)
            );
        }

        // Asynchronous method to perform a spin action by sending a POST request to the "spin" endpoint.
        // This method will send the SpinRequest and return the SpinResponse.
        public async UniTask<SpinResponse> Spin(SpinRequest request)
        {
            var endpoint = GetEndpoint("spin"); // Build the full URL for the "spin" endpoint.

            // Make the POST request to the "spin" endpoint, passing the request object and expecting a response of type SpinResponse.
            return await PostAuthAsync<SpinRequest, SpinResponse>(
                endpoint, // Full URL of the endpoint
                request // Request data (SpinRequest)
            );
        }
    }
}
