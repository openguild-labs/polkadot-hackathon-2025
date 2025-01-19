using Cysharp.Threading.Tasks;

namespace CiFarm.RestApi
{
    public partial class RestApiClient
    {
        // Asynchronous method to follow a user by sending a POST request to the "follow" endpoint.
        // This method will send the FollowRequest and return the FollowResponse.
        public async UniTask<FollowResponse> Follow(FollowRequest request)
        {
            var endpoint = GetEndpoint("follow"); // Build the full URL for the "follow" endpoint.
            return await PostAuthAsync<FollowRequest, FollowResponse>(
                endpoint, // Full URL of the endpoint
                request // Request data (FollowRequest)
            );
        }

        // Asynchronous method to help cure an animal by sending a POST request to the "help-cure-animal" endpoint.
        // This method will send the HelpCureAnimalRequest and return the HelpCureAnimalResponse.
        public async UniTask<HelpCureAnimalResponse> HelpCureAnimal(HelpCureAnimalRequest request)
        {
            var endpoint = GetEndpoint("help-cure-animal"); // Build the full URL for the "help-cure-animal" endpoint.
            return await PostAuthAsync<HelpCureAnimalRequest, HelpCureAnimalResponse>(
                endpoint, // Full URL of the endpoint
                request // Request data (HelpCureAnimalRequest)
            );
        }

        // Asynchronous method to help use herbicide by sending a POST request to the "help-use-herbicide" endpoint.
        // This method will send the HelpUseHerbicideRequest and return the HelpUseHerbicideResponse.
        public async UniTask<HelpUseHerbicideResponse> HelpUseHerbicide(
            HelpUseHerbicideRequest request
        )
        {
            var endpoint = GetEndpoint("help-use-herbicide"); // Build the full URL for the "help-use-herbicide" endpoint.
            return await PostAuthAsync<HelpUseHerbicideRequest, HelpUseHerbicideResponse>(
                endpoint, // Full URL of the endpoint
                request // Request data (HelpUseHerbicideRequest)
            );
        }

        // Asynchronous method to help use pesticide by sending a POST request to the "help-use-pesticide" endpoint.
        // This method will send the HelpUsePesticideRequest and return the HelpUsePesticideResponse.
        public async UniTask<HelpUsePesticideResponse> HelpUsePesticide(
            HelpUsePesticideRequest request
        )
        {
            var endpoint = GetEndpoint("help-use-pesticide"); // Build the full URL for the "help-use-pesticide" endpoint.
            return await PostAuthAsync<HelpUsePesticideRequest, HelpUsePesticideResponse>(
                endpoint, // Full URL of the endpoint
                request // Request data (HelpUsePesticideRequest)
            );
        }

        // Asynchronous method to help water a crop by sending a POST request to the "help-water" endpoint.
        // This method will send the HelpWaterRequest and return the HelpWaterResponse.
        public async UniTask<HelpWaterResponse> HelpWater(HelpWaterRequest request)
        {
            var endpoint = GetEndpoint("help-water"); // Build the full URL for the "help-water" endpoint.
            return await PostAuthAsync<HelpWaterRequest, HelpWaterResponse>(
                endpoint, // Full URL of the endpoint
                request // Request data (HelpWaterRequest)
            );
        }

        // Asynchronous method to return to a previous state by sending a POST request to the "return" endpoint.
        // This method will send the ReturnRequest and return the ReturnResponse.
        public async UniTask<ReturnResponse> Return(ReturnRequest request)
        {
            var endpoint = GetEndpoint("return"); // Build the full URL for the "return" endpoint.
            return await PostAuthAsync<ReturnRequest, ReturnResponse>(
                endpoint, // Full URL of the endpoint
                request // Request data (ReturnRequest)
            );
        }

        // Asynchronous method to steal animal products by sending a POST request to the "thief-animal-product" endpoint.
        // This method will send the ThiefAnimalProductRequest and return the ThiefAnimalProductResponse.
        public async UniTask<ThiefAnimalProductResponse> ThiefAnimalProduct(
            ThiefAnimalProductRequest request
        )
        {
            var endpoint = GetEndpoint("thief-animal-product"); // Build the full URL for the "thief-animal-product" endpoint.
            return await PostAuthAsync<ThiefAnimalProductRequest, ThiefAnimalProductResponse>(
                endpoint, // Full URL of the endpoint
                request // Request data (ThiefAnimalProductRequest)
            );
        }

        // Asynchronous method to steal crops by sending a POST request to the "thief-crop" endpoint.
        // This method will send the ThiefCropRequest and return the ThiefCropResponse.
        public async UniTask<ThiefCropResponse> ThiefCrop(ThiefCropRequest request)
        {
            var endpoint = GetEndpoint("thief-crop"); // Build the full URL for the "thief-crop" endpoint.
            return await PostAuthAsync<ThiefCropRequest, ThiefCropResponse>(
                endpoint, // Full URL of the endpoint
                request // Request data (ThiefCropRequest)
            );
        }

        // Asynchronous method to unfollow a user by sending a POST request to the "unfollow" endpoint.
        // This method will send the UnfollowRequest and return the UnfollowResponse.
        public async UniTask<UnfollowResponse> Unfollow(UnfollowRequest request)
        {
            var endpoint = GetEndpoint("unfollow"); // Build the full URL for the "unfollow" endpoint.
            return await PostAuthAsync<UnfollowRequest, UnfollowResponse>(
                endpoint, // Full URL of the endpoint
                request // Request data (UnfollowRequest)
            );
        }
    }
}
