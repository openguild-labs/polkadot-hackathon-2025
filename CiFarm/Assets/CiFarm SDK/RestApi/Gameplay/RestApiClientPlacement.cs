using Cysharp.Threading.Tasks;

namespace CiFarm.RestApi
{
    public partial class RestApiClient
    {
        // Asynchronous method to move a placed item by sending a POST request to the "move" endpoint.
        // This method will send the MoveRequest and return the MoveResponse.
        public async UniTask<MoveResponse> Move(MoveRequest request)
        {
            var endpoint = GetEndpoint("move"); // Build the full URL for the "move" endpoint.
            return await PostAuthAsync<MoveRequest, MoveResponse>(
                endpoint, // Full URL of the endpoint
                request // Request data (MoveRequest)
            );
        }

        // Asynchronous method to place a tile by sending a POST request to the "placement" endpoint.
        // This method will send the PlaceTileRequest and return the PlaceTileResponse.
        public async UniTask<PlaceTileResponse> Placement(PlaceTileRequest request)
        {
            var endpoint = GetEndpoint("placement"); // Build the full URL for the "placement" endpoint.
            return await PostAuthAsync<PlaceTileRequest, PlaceTileResponse>(
                endpoint, // Full URL of the endpoint
                request // Request data (PlaceTileRequest)
            );
        }

        // Asynchronous method to recover a tile by sending a POST request to the "recover-tile" endpoint.
        // This method will send the RecoverTileRequest and return the RecoverTileResponse.
        public async UniTask<RecoverTileResponse> RecoverTile(RecoverTileRequest request)
        {
            var endpoint = GetEndpoint("recover-tile"); // Build the full URL for the "recover-tile" endpoint.
            return await PostAuthAsync<RecoverTileRequest, RecoverTileResponse>(
                endpoint, // Full URL of the endpoint
                request // Request data (RecoverTileRequest)
            );
        }
    }
}
