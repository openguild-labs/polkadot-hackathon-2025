using System;
using System.Collections.Generic;
using CiFarm.Core.Databases;
using CiFarm.Utils;
using Cysharp.Threading.Tasks;

namespace CiFarm.GraphQL
{
    public partial class GraphQLClient
    {
        public async UniTask<CropEntity> QueryCropAsync(Guid id, string query = null)
        {
            var name = "crop";
            var variables = new GraphQLVariables<Guid>() { Args = id };
            query ??=
                $@"
query($args: ID!) {{
    {name}(id: $args) {{
        availableInShop
        basicHarvestExperiences
        createdAt
        growthStageDuration
        growthStages
        id
        maxHarvestQuantity
        maxStack
        minHarvestQuantity
        nextGrowthStageAfterHarvest
        perennialCount
        premium
        premiumHarvestExperiences
        price
        updatedAt
        productId
        inventoryTypeId
        spinPrizeIds
    }}
}}";

            return await QueryAsync<GraphQLVariables<Guid>, CropEntity>(name, query, variables);
        }

        public async UniTask<List<CropEntity>> QueryCropsAsync(string query = null)
        {
            var name = "crops";
            query ??=
                $@"
query {{
    {name} {{
        availableInShop
        basicHarvestExperiences
        createdAt
        growthStageDuration
        growthStages
        id
        maxHarvestQuantity
        maxStack
        minHarvestQuantity
        nextGrowthStageAfterHarvest
        perennialCount
        premium
        premiumHarvestExperiences
        price
        updatedAt
        productId
        inventoryTypeId
        spinPrizeIds
    }}
}}";

            return await QueryAsync<Empty, List<CropEntity>>(name, query);
        }
    }
}
