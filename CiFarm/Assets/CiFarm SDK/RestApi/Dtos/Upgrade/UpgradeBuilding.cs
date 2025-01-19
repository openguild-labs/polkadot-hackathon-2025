using System;
using Newtonsoft.Json;

namespace CiFarm.RestApi
{
    [Serializable]
    public class UpgradeBuildingRequest
    {
        [JsonProperty("placedItemBuildingId")]
        public string PlacedItemId { get; set; }
    }

    [Serializable]
    public class UpgradeBuildingResponse { }
}
