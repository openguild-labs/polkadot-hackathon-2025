using System;
using System.Collections.Generic;
using CiFarm.Core.Databases;
using CiFarm.Utils;
using Cysharp.Threading.Tasks;

namespace CiFarm.GraphQL
{
    public partial class GraphQLClient
    {
        public async UniTask<ToolEntity> QueryToolAsync(Guid id, string query = null)
        {
            var name = "tool";
            var variables = new GraphQLVariables<Guid>() { Args = id };
            query ??=
                $@"
query($args: ID!) {{
    {name}(id: $args) {{
        id
        availableIn
        index
    }}
}}";

            return await QueryAsync<GraphQLVariables<Guid>, ToolEntity>(name, query, variables);
        }

        public async UniTask<List<ToolEntity>> QueryToolsAsync(string query = null)
        {
            var name = "tools";
            query ??=
                $@"
query {{
    {name} {{
        id
        availableIn
        index
    }}
}}";

            return await QueryAsync<Empty, List<ToolEntity>>(name, query);
        }
    }
}
