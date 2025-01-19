using System;
using System.Collections.Generic;
using CiFarm.Core.Databases;
using CiFarm.Utils;
using Cysharp.Threading.Tasks;

namespace CiFarm.GraphQL
{
    public partial class GraphQLClient
    {
        public async UniTask<PlacedItemTypeEntity> QueryPlacedItemTypeAsync(
            string id,
            string query = null
        )
        {
            var name = "placedItemType";
            var variables = new GraphQLVariables<string>() { Args = id };
            query ??=
                $@"
query($args: ID!) {{
    {name}(id: $args) {{
        animalId
        buildingId
        id
        tileId
        type
        }}
    }}";

            return await QueryAsync<GraphQLVariables<string>, PlacedItemTypeEntity>(
                name,
                query,
                variables
            );
        }

        public async UniTask<List<PlacedItemTypeEntity>> QueryPlacedItemTypesAsync(
            string query = null
        )
        {
            var name = "placedItemTypes";
            query ??=
                $@"
query {{
    {name} {{
        animalId
        buildingId
        id
        tileId
        type
        }}
    }}";

            return await QueryAsync<Empty, List<PlacedItemTypeEntity>>(name, query);
        }
    }
}
