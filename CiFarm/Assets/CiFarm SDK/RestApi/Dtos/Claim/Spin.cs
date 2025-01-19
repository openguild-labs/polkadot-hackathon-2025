using System;
using Newtonsoft.Json;

namespace CiFarm.RestApi
{
    [Serializable]
    public class SpinRequest { }

    [Serializable]
    public class SpinResponse
    {
        [JsonProperty("spinSlotId")]
        public string SpinSlotId { get; set; }
    }
}
