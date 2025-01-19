using System;
using Newtonsoft.Json;
using UnityEngine;

namespace CiFarm.RestApi
{
    [Serializable]
    public class RefreshRequest
    {
        // Public property with automatic getter and setter
        [JsonProperty("refreshToken")]
        public string RefreshToken { get; set; }
    }

    [Serializable]
    public class RefreshResponse
    {
        // Public property with automatic getter and setter
        [JsonProperty("accessToken")]
        public string AccessToken { get; set; }

        [JsonProperty("refreshToken")]
        public string RefreshToken { get; set; }
    }
}
