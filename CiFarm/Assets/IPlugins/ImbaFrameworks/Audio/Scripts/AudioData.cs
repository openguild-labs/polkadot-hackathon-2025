using UnityEditor;
using UnityEngine;

namespace Imba.Audio
{
    
    [System.Serializable]
    public class AudioData
    {
        public AudioName AudioName;

        public AudioType Type;

        public AudioClip AudioClip;

        [Range(0f, 1f)] public float Volume = 1f;

        [Range(0, 256)] public int Priority = 128;

        [Range(0, 1)] public float SpatialBlend;

        [HideInInspector] public AudioSource Source;

        public bool IsLooping;

        public bool PlayOnAwake;

    }
}