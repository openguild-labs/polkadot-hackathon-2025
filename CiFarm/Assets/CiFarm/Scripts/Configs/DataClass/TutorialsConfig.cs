using System;
using System.Collections.Generic;
using System.Linq;
using DuckSurvivor.Scripts.Configs;

namespace CiFarm.Scripts.Configs.DataClass
{
    [Serializable]
    public class TutorialsConfig : SgConfigDataTable<TutorialRecord>
    {
        protected override void RebuildIndex()
        {
            RebuildIndexByField<int>("Id");
        }

        public TutorialRecord GetConfigById(int id)
        {
            var record = Records.FirstOrDefault(x => x.Id == id);
            return record;
        }

        public List<int> GetTutorialDetailsId(int id)
        {
            var record = GetConfigById(id);
            if (record != null)
            {
                return record.TutorialStep
                    .Split(';')
                    .Select(step => int.TryParse(step, out var stepId) ? stepId : (int?)null)
                    .Where(stepId => stepId.HasValue)
                    .Select(stepId => stepId.Value)
                    .ToList();
            }

            return new List<int>();
        }
    }

    [Serializable]
    public class TutorialRecord
    {
        public int    Id;
        public string Name;
        public string Detail;
        public string TutorialStep;

        public List<int> GetTutorialDetailsId()
        {
            return TutorialStep
                .Split(';')
                .Select(step => int.TryParse(step, out var stepId) ? stepId : (int?)null)
                .Where(stepId => stepId.HasValue)
                .Select(stepId => stepId.Value)
                .ToList();
        }
    }
}