using System;
using System.Collections.Generic;
using CiFarm.Core.Databases;
using CiFarm.Utils;
using Cysharp.Threading.Tasks;

namespace CiFarm.GraphQL
{
    public partial class GraphQLClient
    {
        public async UniTask<DailyRewardEntity> QueryDailyRewardAsync(Guid id, string query = null)
        {
            var name = "dailyReward";
            var variables = new GraphQLVariables<Guid>() { Args = id };
            query ??=
                $@"
query($args: ID!) {{
    {name}(id: $args) {{
        id
        golds
        tokens
        day
        lastDay
    }}
}}";

            return await QueryAsync<GraphQLVariables<Guid>, DailyRewardEntity>(
                name,
                query,
                variables
            );
        }

        public async UniTask<List<DailyRewardEntity>> QueryDailyRewardsAsync(string query = null)
        {
            var name = "dailyRewards";
            query ??=
                $@"
query {{
    {name} {{
        id
        golds
        tokens
        day
        lastDay
    }}
}}";

            return await QueryAsync<Empty, List<DailyRewardEntity>>(name, query);
        }
    }
}
