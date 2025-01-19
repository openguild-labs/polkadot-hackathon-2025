using CiFarm.Core.Databases;
using Cysharp.Threading.Tasks;

namespace CiFarm.GraphQL
{
    public partial class GraphQLClient
    {
        public async UniTask<PlacedItemEntity> QueryPlacedItemAsync(string id, string query = null)
        {
            var name = "placedItem";
            var variables = new GraphQLVariables<string>() { Args = id };
            query ??=
                $@"
query($args: ID!) {{
    {name}(id: $args) {{
        data {{
            id
            x
            y
            userId
            inventoryId
            seedGrowthInfoId
            animalInfoId
            buildingInfoId
            placedItemIds
            parentId
            parent
            placedItemTypeId
            seedGrowthInfo {{
                createdAt
                cropId
                currentPerennialCount
                currentStage
                currentStageTimeElapsed
                currentState
                harvestQuantityRemaining
                id
                isFertilized
                placedItemId
                totalTimeElapsed
            }}
            animalInfo {{
                alreadySick
                animalId
                currentGrowthTime
                currentHungryTime
                currentState
                currentYieldTime
                harvestQuantityRemaining
                id
                isAdult
                placedItemId            
            }}
            buildingInfo {{
                buildingId
                currentUpgrade
                id
                occupancy
                placedItemId
            }}
        }}
        count
    }}";

            return await QueryAuthAsync<GraphQLVariables<string>, PlacedItemEntity>(
                name,
                query,
                variables
            );
        }

        public async UniTask<PaginatedResponse<PlacedItemEntity>> QueryPlacedItemsAsync(
            GetPlacedItemsArgs args,
            string query = null
        )
        {
            var name = "placedItems";
            var variables = new GraphQLVariables<GetPlacedItemsArgs>() { Args = args };
            query ??=
                $@"
query($args: GetPlacedItemsArgs!) {{
    {name}(args: $args) {{
        data {{
            id
            x
            y
            userId
            inventoryId
            seedGrowthInfoId
            animalInfoId
            buildingInfoId
            placedItemIds
            parentId
            parent
            placedItemTypeId
            seedGrowthInfo {{
                createdAt
                cropId
                currentPerennialCount
                currentStage
                currentStageTimeElapsed
                currentState
                harvestQuantityRemaining
                id
                isFertilized
                placedItemId
                totalTimeElapsed
            }}
            animalInfo {{
                alreadySick
                animalId
                currentGrowthTime
                currentHungryTime
                currentState
                currentYieldTime
                harvestQuantityRemaining
                id
                isAdult
                placedItemId            
            }}
            buildingInfo {{
                buildingId
                currentUpgrade
                id
                occupancy
                placedItemId
            }}
        }}
        count
    }}
}}";

            return await QueryAuthAsync<
                GraphQLVariables<GetPlacedItemsArgs>,
                PaginatedResponse<PlacedItemEntity>
            >(name, query, variables);
        }
    }
}
