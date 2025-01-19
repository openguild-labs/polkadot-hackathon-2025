using System;
using System.Collections.Generic;
using CiFarm.Core.Databases;
using CiFarm.Utils;
using Cysharp.Threading.Tasks;

namespace CiFarm.GraphQL
{
    public partial class GraphQLClient
    {
        public async UniTask<AnimalEntity> QueryAnimalAsync(string id, string query = null)
        {
            var name = "animal";
            var variables = new GraphQLVariables<string>() { Args = id };
            query ??=
                $@"
query($args: ID!) {{
    {name}(id: $args) {{
        availableInShop
        basicHarvestExperiences
        growthTime
        hungerTime
        id
        isNFT
        maxHarvestQuantity
        minHarvestQuantity
        offspringPrice
        premiumHarvestExperiences
        price
        yieldTime  
        type
        placedItemTypeId
        inventoryTypeId
        inventoryTypeId
        productId
    }}
}}";

            return await QueryAsync<GraphQLVariables<string>, AnimalEntity>(name, query, variables);
        }

        public async UniTask<List<AnimalEntity>> QueryAnimalsAsync(string query = null)
        {
            var name = "animals";
            query ??=
                $@"
query {{
    {name} {{
        availableInShop
        basicHarvestExperiences
        growthTime
        hungerTime
        id
        isNFT
        maxHarvestQuantity
        minHarvestQuantity
        offspringPrice
        premiumHarvestExperiences
        price
        yieldTime  
        type
        placedItemTypeId
        inventoryTypeId
        inventoryTypeId
        productId
    }}
}}";

            return await QueryAsync<Empty, List<AnimalEntity>>(name, query);
        }
    }
}
