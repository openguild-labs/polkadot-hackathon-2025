using System;
using System.Collections.Generic;
using CiFarm.Core.Databases;
using CiFarm.Utils;
using Cysharp.Threading.Tasks;

namespace CiFarm.GraphQL
{
    public partial class GraphQLClient
    {
        public async UniTask<SpinSlotEntity> QuerySpinSlotAsync(string id, string query = null)
        {
            var name = "spinSlot";
            var variables = new GraphQLVariables<string>() { Args = id };
            query ??=
                $@"
query($args: ID!) {{
    {name}(id: $args) {{
        id
        spinPrizeId
    }}
}}";

            return await QueryAsync<GraphQLVariables<string>, SpinSlotEntity>(
                name,
                query,
                variables
            );
        }

        public async UniTask<List<SpinSlotEntity>> QuerySpinSlotsAsync(string query = null)
        {
            var name = "spinSlots";
            query ??=
                $@"
query {{
    {name} {{
        id
        spinPrizeId
    }}
}}";

            return await QueryAsync<Empty, List<SpinSlotEntity>>(name, query);
        }
    }
}
