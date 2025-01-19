using Newtonsoft.Json;

namespace CiFarm.Scripts.Services.NakamaServices
{
    public class GoHealthcheckResponse
    {
        [JsonProperty("status")]
        public string status;
    }
}