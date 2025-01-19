using Cysharp.Threading.Tasks;

namespace CiFarm.RestApi
{
    public partial class RestApiClient
    {
        // Asynchronous method to collect animal products by sending a POST request to the "collect-animal-product" endpoint.
        // This method will send the CollectAnimalProductRequest and return the CollectAnimalProductResponse.
        public async UniTask<CollectAnimalProductResponse> CollectAnimalProduct(
            CollectAnimalProductRequest request
        )
        {
            var endpoint = GetEndpoint("collect-animal-product"); // Build the full URL for the "collect-animal-product" endpoint.
            return await PostAuthAsync<CollectAnimalProductRequest, CollectAnimalProductResponse>(
                endpoint, // Full URL of the endpoint
                request // Request data (CollectAnimalProductRequest)
            );
        }

        // Asynchronous method to cure an animal by sending a POST request to the "cure-animal" endpoint.
        // This method will send the CureAnimalRequest and return the CureAnimalResponse.
        public async UniTask<CureAnimalResponse> CureAnimal(CureAnimalRequest request)
        {
            var endpoint = GetEndpoint("cure-animal"); // Build the full URL for the "cure-animal" endpoint.
            return await PostAuthAsync<CureAnimalRequest, CureAnimalResponse>(
                endpoint, // Full URL of the endpoint
                request // Request data (CureAnimalRequest)
            );
        }

        // Asynchronous method to feed an animal by sending a POST request to the "feed-animal" endpoint.
        // This method will send the FeedAnimalRequest and return the FeedAnimalResponse.
        public async UniTask<FeedAnimalResponse> FeedAnimal(FeedAnimalRequest request)
        {
            var endpoint = GetEndpoint("feed-animal"); // Build the full URL for the "feed-animal" endpoint.
            return await PostAuthAsync<FeedAnimalRequest, FeedAnimalResponse>(
                endpoint, // Full URL of the endpoint
                request // Request data (FeedAnimalRequest)
            );
        }

        // Asynchronous method to harvest a crop by sending a POST request to the "harvest-crop" endpoint.
        // This method will send the HarvestCropRequest and return the HarvestCropResponse.
        public async UniTask<HarvestCropResponse> HarvestCrop(HarvestCropRequest request)
        {
            var endpoint = GetEndpoint("harvest-crop"); // Build the full URL for the "harvest-crop" endpoint.
            return await PostAuthAsync<HarvestCropRequest, HarvestCropResponse>(
                endpoint, // Full URL of the endpoint
                request // Request data (HarvestCropRequest)
            );
        }

        // Asynchronous method to plant a seed by sending a POST request to the "plant-seed" endpoint.
        // This method will send the PlantSeedRequest and return the PlantSeedResponse.
        public async UniTask<PlantSeedResponse> PlantSeed(PlantSeedRequest request)
        {
            var endpoint = GetEndpoint("plant-seed"); // Build the full URL for the "plant-seed" endpoint.
            return await PostAuthAsync<PlantSeedRequest, PlantSeedResponse>(
                endpoint, // Full URL of the endpoint
                request // Request data (PlantSeedRequest)
            );
        }

        // Asynchronous method to use fertilizer by sending a POST request to the "use-fertilizer" endpoint.
        // This method will send the UseFertilizerRequest and return the UseFertilizerResponse.
        public async UniTask<UseFertilizerResponse> UseFertilizer(UseFertilizerRequest request)
        {
            var endpoint = GetEndpoint("use-fertilizer"); // Build the full URL for the "use-fertilizer" endpoint.
            return await PostAuthAsync<UseFertilizerRequest, UseFertilizerResponse>(
                endpoint, // Full URL of the endpoint
                request // Request data (UseFertilizerRequest)
            );
        }

        // Asynchronous method to use herbicide by sending a POST request to the "use-herbicide" endpoint.
        // This method will send the UseHerbicideRequest and return the UseHerbicideResponse.
        public async UniTask<UseHerbicideResponse> UseHerbicide(UseHerbicideRequest request)
        {
            var endpoint = GetEndpoint("use-herbicide"); // Build the full URL for the "use-herbicide" endpoint.
            return await PostAuthAsync<UseHerbicideRequest, UseHerbicideResponse>(
                endpoint, // Full URL of the endpoint
                request // Request data (UseHerbicideRequest)
            );
        }

        // Asynchronous method to use pesticide by sending a POST request to the "use-pesticide" endpoint.
        // This method will send the UsePesticideRequest and return the UsePesticideResponse.
        public async UniTask<UsePesticideResponse> UsePesticide(UsePesticideRequest request)
        {
            var endpoint = GetEndpoint("use-pesticide"); // Build the full URL for the "use-pesticide" endpoint.
            return await PostAuthAsync<UsePesticideRequest, UsePesticideResponse>(
                endpoint, // Full URL of the endpoint
                request // Request data (UsePesticideRequest)
            );
        }

        // Asynchronous method to water a crop by sending a POST request to the "water" endpoint.
        // This method will send the WaterRequest and return the WaterResponse.
        public async UniTask<WaterResponse> Water(WaterRequest request)
        {
            var endpoint = GetEndpoint("water"); // Build the full URL for the "water" endpoint.
            return await PostAuthAsync<WaterRequest, WaterResponse>(
                endpoint, // Full URL of the endpoint
                request // Request data (WaterRequest)
            );
        }
    }
}
