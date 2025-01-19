using System;
using System.Collections.Generic;
using CiFarm.Core.Databases;
using CiFarm.Utils;
using Cysharp.Threading.Tasks;

namespace CiFarm.GraphQL
{
    public partial class GraphQLClient
    {
        public async UniTask<UpgradeEntity> QueryUpgradeAsync(string id, string query = null)
        {
            var name = "upgrade";
            var variables = new GraphQLVariables<string>() { Args = id };
            query ??=
                $@"
query($args: ID!) {{
    {name}(id: $args) {{
        id
        upgradePrice
        capacity
        upgradeLevel
        buildingId
    }}
}}";

            return await QueryAsync<GraphQLVariables<string>, UpgradeEntity>(
                name,
                query,
                variables
            );
        }

        public async UniTask<List<UpgradeEntity>> QueryUpgradesAsync(string query = null)
        {
            var name = "upgrades";
            query ??=
                $@"
query {{
    {name} {{
        id
        upgradePrice
        capacity
        upgradeLevel
        buildingId
    }}
}}";

            return await QueryAsync<Empty, List<UpgradeEntity>>(name, query);
        }
    }
}
