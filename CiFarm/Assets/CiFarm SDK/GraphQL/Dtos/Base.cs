using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using UnityEngine;

namespace CiFarm.GraphQL
{
    [Serializable]
    public abstract class PaginatedArgs
    {
        [field: SerializeField]
        [JsonProperty("limit")]
        public int Limit { get; set; }

        [field: SerializeField]
        [JsonProperty("offset")]
        public int Offset { get; set; }
    }

    [Serializable]
    public class PaginatedResponse<TEntity>
    {
        [field: SerializeField]
        [JsonProperty("data")]
        public List<TEntity> Data { get; set; }

        [field: SerializeField]
        [JsonProperty("count")]
        public int Count { get; set; }
    }

    [Serializable]
    public class GraphQLVariables<TArgs>
    {
        [field: SerializeField]
        [JsonProperty("args")]
        public TArgs Args { get; set; }
    }
}
