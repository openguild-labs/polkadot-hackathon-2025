using System;
using System.Collections.Generic;
using CiFarm.Core.Databases;
using CiFarm.Utils;
using Cysharp.Threading.Tasks;

namespace CiFarm.GraphQL
{
    public partial class GraphQLClient
    {
        public async UniTask<BuildingEntity> QueryBuildingAsync(Guid id, string query = null)
        {
            var name = "building";
            var variables = new GraphQLVariables<Guid>() { Args = id };
            query ??=
                $@"
query($args: ID!) {{
    {name}(id: $args) {{
        availableInShop
        id
        maxUpgrade
        price
        type
        placedItemTypeId
        upgradeIds
    }}
}}";

            return await QueryAsync<GraphQLVariables<Guid>, BuildingEntity>(name, query, variables);
        }

        public async UniTask<List<BuildingEntity>> QueryBuildingsAsync(string query = null)
        {
            var name = "buildings";
            query ??=
                $@"
query {{
    {name} {{
        availableInShop
        id
        maxUpgrade
        price
        type
        placedItemTypeId
        upgradeIds
    }}
}}";

            return await QueryAsync<Empty, List<BuildingEntity>>(name, query);
        }
    }
}
