using System;
using System.Collections.Generic;
using CiFarm.Core.Databases;
using CiFarm.Utils;
using Cysharp.Threading.Tasks;

namespace CiFarm.GraphQL
{
    public partial class GraphQLClient
    {
        public async UniTask<SupplyEntity> QuerySupplyAsync(Guid id, string query = null)
        {
            var name = "supply";
            var variables = new GraphQLVariables<Guid>() { Args = id };
            query ??=
                $@"
query($args: ID!) {{
    {name}(id: $args) {{
        id
        type
        price
        availableInShop
        fertilizerEffectTimeReduce
        inventoryTypeId
        spinPrizeIds
    }}
}}";

            return await QueryAsync<GraphQLVariables<Guid>, SupplyEntity>(name, query, variables);
        }

        public async UniTask<List<SupplyEntity>> QuerySuppliesAsync(string query = null)
        {
            var name = "supplies";
            query ??=
                $@"
query {{
    {name} {{
        id
        type
        price
        availableInShop
        fertilizerEffectTimeReduce
        inventoryTypeId
        spinPrizeIds
    }}
}}";

            return await QueryAsync<Empty, List<SupplyEntity>>(name, query);
        }
    }
}
