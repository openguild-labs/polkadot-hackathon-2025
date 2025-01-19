using UnityEngine;

namespace CiFarm.Scripts.Utilities
{
    public static class DLogger
    {
#if !RELEASE
#endif
        // ReSharper disable Unity.PerformanceAnalysis
        public static void Log(string message, string tag = "DLogger", string color = "#FFFFFF")
        {
#if !RELEASE
            Debug.LogFormat("<color={2}>[{0}]</color> {1}", tag, message, color);
#endif
        }

        // ReSharper disable Unity.PerformanceAnalysis
        public static void LogWarning(string message, string tag = "DLogger", string color = "#FFFFFF")
        {
#if !RELEASE
            Debug.LogWarningFormat("<color={2}>[{0}]</color> {1}", tag, message, color);
#endif
        }

        // ReSharper disable Unity.PerformanceAnalysis
        public static void LogError(string message, string tag = "DLogger", string color = "#FFFFFF")
        {
#if !RELEASE
            Debug.LogErrorFormat("<color={2}>[{0}]</color> {1}", tag, message, color);
#endif
        }
    }

    public static class LogColors
    {
        public static readonly string White       = "#FFFFFF";
        public static readonly string Aqua        = "#00FFFF";
        public static readonly string Aquamarine  = "#7FFFD4";
        public static readonly string Turquoise   = "#40E0D0";
        public static readonly string PaleGreen   = "#98FB98";
        public static readonly string YellowGreen = "#9ACD32";
        public static readonly string Lime        = "#00FF00";
        public static readonly string Chartreuse  = "#7FFF00";
        public static readonly string GreenYellow = "#ADFF2F";

        public static readonly string LimeGreen    = "#32CD32";
        public static readonly string Gold         = "#FFD700";
        public static readonly string Orange       = "#FFA500";
        public static readonly string OrangeRed    = "#FF4500";
        public static readonly string Tomato       = "#FF6347";
        public static readonly string Coral        = "#FF7F50";
        public static readonly string DarkOrange   = "#FF8C00";
        public static readonly string DeepPink     = "#FF1493";
        public static readonly string Magenta      = "#FF00FF";
        public static readonly string Violet       = "#EE82EE";
        public static readonly string BlueViolet   = "#8A2BE2";
        public static readonly string Orchid       = "#DA70D6";
        public static readonly string MediumOrchid = "#BA55D3";
    }
}