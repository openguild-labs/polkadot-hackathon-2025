using System;
using Newtonsoft.Json;
using UnityEngine;

namespace CiFarm.RestApi
{
    [Serializable]
    public class RequestMessageRequest { }

    [Serializable]
    public class RequestMessageResponse
    {
        // Convert the private field to a public property with automatic getter and setter
        [JsonProperty("message")]
        public string Message { get; set; }
    }
}
