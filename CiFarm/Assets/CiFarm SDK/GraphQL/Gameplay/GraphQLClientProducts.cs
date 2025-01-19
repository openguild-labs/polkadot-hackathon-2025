using System;
using System.Collections.Generic;
using CiFarm.Core.Databases;
using CiFarm.Utils;
using Cysharp.Threading.Tasks;

namespace CiFarm.GraphQL
{
    public partial class GraphQLClient
    {
        public async UniTask<ProductEntity> QueryProductAsync(string id, string query = null)
        {
            var name = "product";
            var variables = new GraphQLVariables<string>() { Args = id };
            query ??=
                $@"
query($args: ID!) {{
    {name}(id: $args) {{
        id
        isPremium
        goldAmount
        tokenAmount
        type
        cropId
        animalId
        inventoryTypeId
    }}
}}";

            return await QueryAsync<GraphQLVariables<string>, ProductEntity>(
                name,
                query,
                variables
            );
        }

        public async UniTask<List<ProductEntity>> QueryProductsAsync(string query = null)
        {
            var name = "products";
            query ??=
                $@"
query {{
    {name} {{
        id
        isPremium
        goldAmount
        tokenAmount
        type
        cropId
        animalId
        inventoryTypeId
    }}
}}";

            return await QueryAsync<Empty, List<ProductEntity>>(name, query);
        }
    }
}
