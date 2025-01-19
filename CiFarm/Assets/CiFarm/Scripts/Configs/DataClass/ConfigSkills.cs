using System.Collections.Generic;
using System.Linq;

namespace DuckSurvivor.Scripts.Configs.DataClass
{
    /// <summary>
    /// Đây là class chính, class này trùng tên với file
    /// Class này kế thừa ConfigSkillsRecord(T) với T là cái record bên dưới 
    /// </summary>
    public class ConfigSkills : SgConfigDataTable<ConfigSkillsRecord>
    {
        /// <summary>
        /// viết theo y hệt là đc
        /// </summary>
        protected override void RebuildIndex()
        {
            RebuildIndexByField<int>("Id");
        }
        
        /// <summary>
        /// Hàm getter mẫu để truy xuất theo id,
        /// có thể tự viết thêm để lấy data ra kiểu gì cũng đc
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ConfigSkillsRecord GetConfigSkillById(int id)
        {
            ConfigSkillsRecord record = Records.FirstOrDefault(x => x.Id == id);
            return record;
        }
        
        public List<ConfigSkillsRecord> GetAllConfigSkill()
        {
            return Records;
        }
        
    }

    /// <summary>
    /// Đây là class data chưa các data tương ứng với file config .tsv
    /// .tsv đó có ấy nhiêu cột thì trong này có bấy nhiêu property (không tính note)
    /// </summary>
    public class ConfigSkillsRecord
    {
        public int    Id;
        public string Name;
        public string Description;
        public int    RequiredSkill;
    }
}