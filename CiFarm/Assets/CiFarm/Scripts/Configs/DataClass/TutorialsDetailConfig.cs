using System;
using System.Collections.Generic;
using System.Linq;
using DuckSurvivor.Scripts.Configs;

namespace CiFarm.Scripts.Configs.DataClass
{
    public class TutorialsDetailConfig : SgConfigDataTable<TutorialDetailRecord>
    {
        protected override void RebuildIndex()
        {
            RebuildIndexByField<int>("Id");
        }

        public TutorialDetailRecord GetConfigById(int id)
        {
            var record = Records.FirstOrDefault(x => x.Id == id);
            return record;
        }

        public List<TutorialDetailRecord> GetAllConfigSkill()
        {
            return Records;
        }
    }

    public class TutorialDetailRecord
    {
        public int                 Id;
        public TutorialsDetailType TutorialsDetailType;
        public string              Localization;
        public string              Details;
        public string              CharacterId;
        public TargetClickType     TargetClickType;
        public string              TargetClickId;
        public string              TargetImageId;
        public bool                AllowSave;
    }

    public enum TutorialsDetailType
    {
        PopupMessage,
        ActionClick,
        PopupMessageImage
    }

    public enum TargetClickType
    {
        UIObject,
        GameObject
    }
}