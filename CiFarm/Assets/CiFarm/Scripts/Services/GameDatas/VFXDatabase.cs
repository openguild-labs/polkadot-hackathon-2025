using System.Collections;
using System.Collections.Generic;
using UnityEngine;

/// <summary>
/// Allows you to define a list of VFX prefabs each with a name.
/// An editor script takes care of generating a C# file containing an enum with the given name to index the Entries
/// array. This allows you to call methods such as VFXManager.GetVFX(VFXType.MyEffectName). See the VFXManager class
/// for more details.
/// </summary>
[CreateAssetMenu(fileName = "VFXDatabase", menuName = "Game System/New VFX Database", order = -999)]
public class VFXDatabase : ScriptableObject
{
    /// <summary>
    /// An entry in the VFXDatabase, storing all the data needed to create the pools of instances of VFX.
    /// </summary>
    [System.Serializable]
    public class VfxDbEntry
    {
        public VFXType    Type;
        public GameObject Prefab;
    }

    public VfxDbEntry[] entries;
}

public enum VFXType
{
    Harvest    = 1,
    Experience = 2,
    WaterCan   = 3,
    Steal      = 4,
    Scythe     = 5,
    Pesticide  = 6,
    Herbicide  = 7,
    Fertilizer = 8,
}