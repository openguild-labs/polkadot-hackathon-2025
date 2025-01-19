using CiFarm.Core.Databases;
using Cysharp.Threading.Tasks;

namespace CiFarm.GraphQL
{
    public partial class GraphQLClient
    {
        public async UniTask<InventoryEntity> QueryInventoryAsync(string id, string query = null)
        {
            var name = "inventory";
            var variables = new GraphQLVariables<string>() { Args = id };
            query ??=
                $@"
query($args: ID!) {{
    {name}(id: $args) {{
        id
        quantity
        tokenId
        premium
        isPlaced
        userId
        inventoryTypeId
        }}
    }}";

            return await QueryAuthAsync<GraphQLVariables<string>, InventoryEntity>(
                name,
                query,
                variables
            );
        }

        public async UniTask<PaginatedResponse<InventoryEntity>> QueryInventoriesAsync(
            GetInventoriesArgs args,
            string query = null
        )
        {
            var name = "inventories";
            var variables = new GraphQLVariables<GetInventoriesArgs>() { Args = args };
            query ??=
                $@"
query($args: GetInventoriesArgs!) {{
    {name}(args: $args) {{
        data {{
            id
            quantity
            tokenId
            premium
            isPlaced
            userId
            inventoryTypeId
        }}
        count
    }}
}}";

            return await QueryAuthAsync<
                GraphQLVariables<GetInventoriesArgs>,
                PaginatedResponse<InventoryEntity>
            >(name, query, variables);
        }
    }
}
