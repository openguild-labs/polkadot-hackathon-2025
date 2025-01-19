using Cysharp.Threading.Tasks;

namespace CiFarm.RestApi
{
    public partial class RestApiClient
    {
        // Asynchronous method to upgrade a building by sending a POST request to the "upgrade-building" endpoint.
        // This method will send the UpgradeBuildingRequest and return the UpgradeBuildingResponse.
        public async UniTask<UpgradeBuildingResponse> UpgradeBuilding(
            UpgradeBuildingRequest request
        )
        {
            var endpoint = GetEndpoint("upgrade-building"); // Build the full URL for the "upgrade-building" endpoint.
            return await PostAuthAsync<UpgradeBuildingRequest, UpgradeBuildingResponse>(
                endpoint, // Full URL of the endpoint
                request // Request data (UpgradeBuildingRequest)
            );
        }
    }
}
