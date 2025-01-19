using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using UnityEngine;

namespace CiFarm.GraphQL
{
    [Serializable]
    // Empty class, use for null inhenrit from generic class
    public class GraphQLResponse<TData>
        where TData : class, new()
    {
        [SerializeField]
        private JObject _data;

        [JsonProperty("data")]
        public JObject Data
        {
            get => _data;
            set => _data = value;
        }

        public TData GetData(string name)
        {
            return _data[name].ToObject<TData>();
        }
    }
}
