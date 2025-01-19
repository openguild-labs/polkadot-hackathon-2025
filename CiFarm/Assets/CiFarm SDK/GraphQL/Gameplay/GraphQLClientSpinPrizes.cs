using System;
using System.Collections.Generic;
using CiFarm.Core.Databases;
using CiFarm.Utils;
using Cysharp.Threading.Tasks;

namespace CiFarm.GraphQL
{
    public partial class GraphQLClient
    {
        public async UniTask<SpinPrizeEntity> QuerySpinPrizeAsync(string id, string query = null)
        {
            var name = "spinPrize";
            var variables = new GraphQLVariables<string>() { Args = id };
            query ??=
                $@"
query($args: ID!) {{
    {name}(id: $args) {{
        id
        type
        cropId
        supplyId
        golds
        tokens
        quantity
        appearanceChance
        spinSlotIds
    }}
}}";

            return await QueryAsync<GraphQLVariables<string>, SpinPrizeEntity>(
                name,
                query,
                variables
            );
        }

        public async UniTask<List<SpinPrizeEntity>> QuerySpinPrizesAsync(string query = null)
        {
            var name = "spinPrizes";
            query ??=
                $@"
query {{
    {name} {{
        id
        type
        cropId
        supplyId
        golds
        tokens
        quantity
        appearanceChance
        spinSlotIds
    }}
}}";

            return await QueryAsync<Empty, List<SpinPrizeEntity>>(name, query);
        }
    }
}
