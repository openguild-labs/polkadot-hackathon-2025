using System;
using Newtonsoft.Json;

namespace CiFarm.RestApi
{
    public class FollowRequest
    {
        // Public auto-property with getter and setter
        [JsonProperty("followedUserId")]
        public string FollowedUserId { get; set; }
    }

    [Serializable]
    public class FollowResponse { }
}
