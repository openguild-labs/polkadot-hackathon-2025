using System;
using Newtonsoft.Json;

namespace CiFarm.RestApi
{
    [Serializable]
    public class UpdateTutorialRequest
    {
        // Auto-property with JSON serialization
        [JsonProperty("tutorialIndex")]
        public int TutorialIndex { get; set; }

        // Auto-property with JSON serialization
        [JsonProperty("stepIndex")]
        public int StepIndex { get; set; }
    }

    [Serializable]
    public class UpdateTutorialResponse { }
}
