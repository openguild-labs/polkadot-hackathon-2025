using CiFarm.Core.Databases;
using CiFarm.Utils;
using Cysharp.Threading.Tasks;

namespace CiFarm.GraphQL
{
    public partial class GraphQLClient
    {
        public async UniTask<Activities> QueryActivitiesAsync(string query = null)
        {
            var name = "activities";

            // If the query is null, use the default query with proper string interpolation
            query ??=
                $@"
query {{
    {name} {{
        water {{
            energyConsume
            experiencesGain
        }}
        feedAnimal {{
            energyConsume
            experiencesGain
        }}
        usePesticide {{
            energyConsume
            experiencesGain
        }}
        useFertilizer {{
            energyConsume
            experiencesGain
        }}
        harvestCrop {{
            energyConsume
            experiencesGain
        }}
        helpCureAnimal {{
            energyConsume
            experiencesGain
        }}
        helpUseHerbicide {{
            energyConsume
            experiencesGain
        }}
        helpUsePesticide {{
            energyConsume
            experiencesGain
        }}
        helpWater {{
            energyConsume
            experiencesGain
        }}
        thiefAnimalProduct {{
            energyConsume
            experiencesGain
        }}
        thiefCrop {{
            energyConsume
            experiencesGain
        }}
        useHerbicide {{
            energyConsume
            experiencesGain
        }}
    }}
}}";

            return await QueryAsync<Empty, Activities>(name, query);
        }

        public UniTask<AnimalRandomness> QueryAnimalRandomnessAsync(string query = null)
        {
            var name = "animalRandomness";

            query ??=
                $@"
query {{
    {name} {{
        sickChance
        thief2
        thief3
    }}
}}";

            return QueryAsync<Empty, AnimalRandomness>(name, query);
        }

        public UniTask<CropRandomness> QueryCropRandomnessAsync(string query = null)
        {
            var name = "cropRandomness";

            query ??=
                $@"
query {{
    {name} {{
        isWeedyOrInfested
        needWater
        thief2 
        thief3
    }}
}}";

            return QueryAsync<Empty, CropRandomness>(name, query);
        }

        public UniTask<EnergyRegen> QueryEnergyRegenAsync(string query = null)
        {
            var name = "energyRegen";

            query ??=
                $@"
query {{
    {name} {{
        time
    }}
}}";

            return QueryAsync<Empty, EnergyRegen>(name, query);
        }

        public UniTask<SpinInfo> QuerySpinInfoAsync(string query = null)
        {
            var name = "spinInfo";

            query ??=
                $@"
query {{
    {name} {{
        appearanceChanceSlots {{
            common {{
                count
                thresholdMax
                thresholdMin
            }}
            rare {{
                count
                thresholdMax
                thresholdMin
            }}
            uncommon {{
                count
                thresholdMax
                thresholdMin
            }}
            veryRare {{
                count
                thresholdMax
                thresholdMin
            }}
        }}
    }}
}}";

            return QueryAsync<Empty, SpinInfo>(name, query);
        }

        public UniTask<Starter> QueryStarterAsync(string query = null)
        {
            var name = "starter";

            query ??=
                $@"
query {{
    {name} {{
        golds
        positions {{
            home {{
                x
                y
            }}
            tiles {{
                x
                y
            }}
        }}
    }}
}}";

            return QueryAsync<Empty, Starter>(name, query);
        }
    }
}
