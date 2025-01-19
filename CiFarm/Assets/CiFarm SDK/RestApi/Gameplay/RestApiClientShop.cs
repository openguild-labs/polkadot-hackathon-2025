using Cysharp.Threading.Tasks;

namespace CiFarm.RestApi
{
    public partial class RestApiClient
    {
        // Asynchronous method to buy an animal by sending a POST request to the "buy-animal" endpoint.
        // This method will send the BuyAnimalRequest and return the BuyAnimalResponse.
        public async UniTask<BuyAnimalResponse> BuyAnimal(BuyAnimalRequest request)
        {
            var endpoint = GetEndpoint("buy-animal"); // Build the full URL for the "buy-animal" endpoint.
            return await PostAuthAsync<BuyAnimalRequest, BuyAnimalResponse>(
                endpoint, // Full URL of the endpoint
                request // Request data (BuyAnimalRequest)
            );
        }

        // Asynchronous method to buy seeds by sending a POST request to the "buy-seeds" endpoint.
        // This method will send the BuySeedsRequest and return the BuySeedsResponse.
        public async UniTask<BuySeedsResponse> BuySeeds(BuySeedsRequest request)
        {
            var endpoint = GetEndpoint("buy-seeds"); // Build the full URL for the "buy-seeds" endpoint.
            return await PostAuthAsync<BuySeedsRequest, BuySeedsResponse>(
                endpoint, // Full URL of the endpoint
                request // Request data (BuySeedsRequest)
            );
        }

        // Asynchronous method to buy supplies by sending a POST request to the "buy-supplies" endpoint.
        // This method will send the BuySuppliesRequest and return the BuySuppliesResponse.
        public async UniTask<BuySuppliesResponse> BuySupplies(BuySuppliesRequest request)
        {
            var endpoint = GetEndpoint("buy-supplies"); // Build the full URL for the "buy-supplies" endpoint.
            return await PostAuthAsync<BuySuppliesRequest, BuySuppliesResponse>(
                endpoint, // Full URL of the endpoint
                request // Request data (BuySuppliesRequest)
            );
        }

        // Asynchronous method to buy a tile by sending a POST request to the "buy-tile" endpoint.
        // This method will send the BuyTileRequest and return the BuyTileResponse.
        public async UniTask<BuyTileResponse> BuyTile(BuyTileRequest request)
        {
            var endpoint = GetEndpoint("buy-tile"); // Build the full URL for the "buy-tile" endpoint.
            return await PostAuthAsync<BuyTileRequest, BuyTileResponse>(
                endpoint, // Full URL of the endpoint
                request // Request data (BuyTileRequest)
            );
        }

        // Asynchronous method to construct a building by sending a POST request to the "construct-building" endpoint.
        // This method will send the ConstructBuildingRequest and return the ConstructBuildingResponse.
        public async UniTask<ConstructBuildingResponse> ConstructBuilding(
            ConstructBuildingRequest request
        )
        {
            var endpoint = GetEndpoint("construct-building"); // Build the full URL for the "construct-building" endpoint.
            return await PostAuthAsync<ConstructBuildingRequest, ConstructBuildingResponse>(
                endpoint, // Full URL of the endpoint
                request // Request data (ConstructBuildingRequest)
            );
        }
    }
}
