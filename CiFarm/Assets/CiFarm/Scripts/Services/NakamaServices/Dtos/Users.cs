using Newtonsoft.Json;
using System;

namespace CiFarm.Scripts.Services.NakamaServices
{
    [Serializable]
    public class User
    {
        [JsonProperty("userId")]
        public string userId;

        [JsonProperty("username")]
        public string username;
    }
}