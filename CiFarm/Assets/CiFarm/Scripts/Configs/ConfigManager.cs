using CiFarm.Scripts.Configs.DataClass;
using Imba.Utils;


namespace CiFarm.Scripts.Configs
{
    public class ConfigManager : ManualSingletonMono<ConfigManager>
    {
        private const string ConfigSharePath = "CsvConfigs/";

        private bool _isLoadedConfigLocal = false;

        #region GAME_CONFIG

        public TutorialsDetailConfig TutorialsDetailConfig;
        public TutorialsConfig       TutorialsConfig;

        #endregion

        private void Start()
        {
            LoadAllConfigLocal();
        }

        private void LoadAllConfigLocal()
        {
            if (_isLoadedConfigLocal)
                return;

            TutorialsDetailConfig = new();
            TutorialsDetailConfig.LoadFromAssetPath(ConfigSharePath + "TutorialsDetailConfig");

            TutorialsConfig = new();
            TutorialsConfig.LoadFromAssetPath(ConfigSharePath + "TutorialsConfig");

            _isLoadedConfigLocal = true;
        }
    }
}