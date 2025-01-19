namespace CiFarm.RestApi
{
    public partial class RestApiClient
    {
        private readonly string _baseEndpoint = "gameplay";

        // Helper method to build the full endpoint URL by appending the specific endpoint to the base URL.
        // Example: GetEndpoint("verify-signature") would return "auth/verify-signature".
        private string GetEndpoint(string endpoint)
        {
            return $"{_baseEndpoint}/{endpoint}";
        }
    }
}
