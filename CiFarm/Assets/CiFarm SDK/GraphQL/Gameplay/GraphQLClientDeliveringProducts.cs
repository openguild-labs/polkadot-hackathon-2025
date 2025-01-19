using CiFarm.Core.Databases;
using Cysharp.Threading.Tasks;

namespace CiFarm.GraphQL
{
    public partial class GraphQLClient
    {
        public async UniTask<DeliveringProductEntity> QueryDeliveringProductAsync(
            string id,
            string query = null
        )
        {
            var name = "deliveringProduct";
            var variables = new GraphQLVariables<string>() { Args = id };
            query ??=
                $@"
query($args: ID!) {{
    {name}(id: $args) {{
            id
            quantity
            index
            premium
            userId
            productId
        }}
    }}";

            return await QueryAuthAsync<GraphQLVariables<string>, DeliveringProductEntity>(
                name,
                query,
                variables
            );
        }

        public async UniTask<
            PaginatedResponse<DeliveringProductEntity>
        > QueryDeliveringProductsAsync(GetDeliveringProductsArgs args, string query = null)
        {
            var name = "deliveringProducts";
            var variables = new GraphQLVariables<GetDeliveringProductsArgs>() { Args = args };
            query ??=
                $@"
query($args: GetDeliveringProductsArgs!) {{
    {name}(args: $args) {{
        data {{
            id
            quantity
            index
            premium
            userId
            productId
        }}
        count
    }}
}}";

            return await QueryAuthAsync<
                GraphQLVariables<GetDeliveringProductsArgs>,
                PaginatedResponse<DeliveringProductEntity>
            >(name, query, variables);
        }
    }
}
