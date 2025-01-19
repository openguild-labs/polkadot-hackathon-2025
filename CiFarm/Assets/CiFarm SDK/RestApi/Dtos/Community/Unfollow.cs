using System;
using Newtonsoft.Json;

namespace CiFarm.RestApi
{
    [Serializable]
    public class UnfollowRequest
    {
        // Public auto-property for UnfollowedUserId with JSON serialization
        [JsonProperty("unfollowedUserId")]
        public string UnfollowedUserId { get; set; }
    }

    [Serializable]
    public class UnfollowResponse { }
}
