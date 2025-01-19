using System;
using System.Collections.Generic;
using CiFarm.Core.Databases;
using CiFarm.Utils;
using Cysharp.Threading.Tasks;

namespace CiFarm.GraphQL
{
    public partial class GraphQLClient
    {
        public async UniTask<UserEntity> QueryUserAsync(string query = null)
        {
            var name = "user";
            query ??=
                $@"
query {{
    {name} {{
        id
        username
        chainKey
        network
        accountAddress
        golds
        tokens
        experiences
        energy
        energyRegenTime
        level
        tutorialIndex
        stepIndex
        dailyRewardStreak
        dailyRewardLastClaimTime
        dailyRewardNumberOfClaim
        spinLastTime
        spinCount
    }}
}}";

            return await QueryAuthAsync<Empty, UserEntity>(name, query);
        }
    }
}
