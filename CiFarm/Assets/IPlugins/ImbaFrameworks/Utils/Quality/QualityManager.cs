using Imba.Utils;
using UnityEngine;
using System;


namespace Imba.Utils
{

    /// <summary>
    /// Need same as in Quality Setting
    /// </summary>
    public enum QualityLevel
    {
        Low = 0,
        Medium,
        High
    }

    public class QualityManager : Singleton<QualityManager>
    {
        //for example
        public bool EnableBeautify = true;
        public bool EnableReflection = true;

        public Action OnQualityChanged;

        private void SetLevel(QualityLevel level)
        {
            if ((QualitySettings.names.Length != Enum.GetNames(typeof(QualityLevel)).Length))
            {
                Debug.LogError("Please update eQualityLevel to the new quality levels.");
                return;
            }

            switch (level)
            {
                case QualityLevel.Low:
                    EnableBeautify = false;
                    EnableReflection = false;

                    break;
                case QualityLevel.Medium:

                    EnableBeautify = true;
                    EnableReflection = false;

                    break;
                case QualityLevel.High:
                    EnableBeautify = true;
                    EnableReflection = true;

                    break;
            }

            // if (level.GetHashCode() != QualitySettings.GetQualityLevel())
            // {
            //     // QualitySettings.SetQualityLevel((int) level, false);
            //     if (OnQualityChanged != null)
            //         OnQualityChanged();
            // }


        }

        public void IncreaseLevel()
        {
            int curLevel = QualitySettings.GetQualityLevel();
            const int max_quality = (int) QualityLevel.High;
            curLevel++;

            if (curLevel > max_quality || curLevel < 0) return;

            var quality = (QualityLevel) curLevel;

            SetLevel(quality);
        }

        public bool IsMinQuality()
        {
            return GetQualityLevel() == QualityLevel.Low;
        }

        public bool IsMaxQuality()
        {
            return GetQualityLevel() == QualityLevel.High;
        }

        public void DecreaseLevel()
        {
            int curLevel = QualitySettings.GetQualityLevel();
            curLevel--;

            const int max_quality = (int) QualityLevel.High;
            if (curLevel > max_quality || curLevel < 0) return;

            var quality = (QualityLevel) curLevel;

            SetLevel(quality);
        }

        public QualityLevel GetQualityLevel()
        {
            int curLevel = QualitySettings.GetQualityLevel();

            const int max_quality = (int) QualityLevel.High;
            if (curLevel > max_quality || curLevel < 0) return QualityLevel.Low;

            return (QualityLevel) curLevel;
        }

        public void AutoDetectQualityLevel()
        {
            if ((QualitySettings.names.Length != Enum.GetNames(typeof(QualityLevel)).Length))
            {
                Debug.LogError("Please update eQualityLevel to the new quality levels.");
                return;
            }

            var shaderLevel = SystemInfo.graphicsShaderLevel;
            var vram = SystemInfo.graphicsMemorySize;
            var cpus = SystemInfo.processorCount;

            Debug.Log(string.Format("System Info: shaderLevel={0} vram={1} cpus={2}", shaderLevel, vram, cpus));

            var fillrate = 0;
            if (shaderLevel < 10)
                fillrate = 1000;
            else if (shaderLevel < 20)
                fillrate = 1300;
            else if (shaderLevel < 30)
                fillrate = 2000;
            else
                fillrate = 3000;

            if (cpus >= 6)
                fillrate *= 3;
            else if (cpus >= 3)
                fillrate *= 2;

            if (vram >= 512)
                fillrate *= 2;
            else if (vram <= 128)
                fillrate /= 2;

            var resx = Screen.width;
            var resy = Screen.height;
            var target_fps = 30.0f;
            var fillneed = (resx * resy + 400f * 300f) * (target_fps / 300.0f);
            // Change the values in levelmult to match the relative fill rate
            // requirements for each quality level.
            var levelmult = new float[] {5.0f, 30.0f, 100.0f, 200.0f, 320.0f};

            const int max_quality = (int) QualityLevel.High;
            var level = 0;
            while (level < max_quality && fillrate > fillneed * levelmult[level + 1])
                ++level;

            var quality = (QualityLevel) level;
            Debug.Log(string.Format("Auto detect quality: {0}x{1} need {2} has {3} = {4} level", resx, resy, fillneed,
                fillrate, quality.ToString()));

            SetLevel(quality);

        }

    }
}