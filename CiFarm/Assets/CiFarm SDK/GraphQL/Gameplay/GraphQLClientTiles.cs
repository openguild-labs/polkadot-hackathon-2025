using System;
using System.Collections.Generic;
using CiFarm.Core.Databases;
using CiFarm.Utils;
using Cysharp.Threading.Tasks;

namespace CiFarm.GraphQL
{
    public partial class GraphQLClient
    {
        public async UniTask<TileEntity> QueryTileAsync(Guid id, string query = null)
        {
            var name = "tile";
            var variables = new GraphQLVariables<Guid>() { Args = id };
            query ??=
                $@"
query($args: ID!) {{
    {name}(id: $args) {{
        id
        price
        maxOwnership
        isNFT
        availableInShop
        inventoryTypeId
        placedItemTypeId
    }}
}}";

            return await QueryAsync<GraphQLVariables<Guid>, TileEntity>(name, query, variables);
        }

        public async UniTask<List<TileEntity>> QueryTilesAsync(string query = null)
        {
            var name = "tiles";
            query ??=
                $@"
query {{
    {name} {{
        id
        price
        maxOwnership
        isNFT
        availableInShop
        inventoryTypeId
        placedItemTypeId
    }}
}}";

            return await QueryAsync<Empty, List<TileEntity>>(name, query);
        }
    }
}
