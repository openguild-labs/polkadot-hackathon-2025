using System;
using System.Collections.Generic;
using CiFarm.Core.Databases;
using CiFarm.Utils;
using Cysharp.Threading.Tasks;

namespace CiFarm.GraphQL
{
    public partial class GraphQLClient
    {
        public async UniTask<InventoryTypeEntity> QueryInventoryTypeAsync(
            string id,
            string query = null
        )
        {
            var name = "inventoryType";
            var variables = new GraphQLVariables<string>() { Args = id };
            query ??=
                $@"
query($args: ID!) {{
    {name}(id: $args) {{
        id
        type
        placeable
        deliverable
        asTool
        maxStack
        cropId
        animalId
        supplyId
        productId
        tileId
        }}
    }}";

            return await QueryAsync<GraphQLVariables<string>, InventoryTypeEntity>(
                name,
                query,
                variables
            );
        }

        public async UniTask<List<InventoryTypeEntity>> QueryInventoryTypesAsync(
            string query = null
        )
        {
            var name = "inventoryTypes";
            query ??=
                $@"
query {{
    {name} {{
        id
        type
        placeable
        deliverable
        asTool
        maxStack
        cropId
        animalId
        supplyId
        productId
        tileId
        }}
    }}";

            return await QueryAsync<Empty, List<InventoryTypeEntity>>(name, query);
        }
    }
}
