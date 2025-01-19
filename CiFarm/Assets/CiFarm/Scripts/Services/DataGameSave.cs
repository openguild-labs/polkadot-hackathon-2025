using System;
using System.Collections.Generic;
using UnityEngine;

public static class PlayerPrefsKey
{
    public static string GEM_KEY = "gem_key";
    public static string LEVEL_KEY = "level_key";
    public static string LIST_PRICE_KEY = "list_price_key";
    public static string LIST_DUCK_RESERVE_KEY = "list_duck_reserve_key";
    public static string LIST_DUCK_MAIN_KEY = "list_duck_main_key";
    public static string LIST_MONSTER_BY_LEVEL = "list_monster_by_level";
    public static string HIGHEST_LEVEL_DUCK_TYPE_ = "highest_level_duck_type_";
}

public class DataGameSave : MonoBehaviour
{
    private static void SaveList<T>(string key, List<T> value)
    {
        if (value == null)
        {
            Debug.Log("Input list null");
            value = new List<T>();
        }
        if (value.Count == 0)
        {
            PlayerPrefs.SetString(key, string.Empty);
            return;
        }
        if (typeof(T) == typeof(string))
        {
            foreach (var item in value)
            {
                string tempCompare = item.ToString();
                if (tempCompare.Contains(" "))
                {
                    throw new Exception("Invalid input. Input contain '~'.");
                }
            }
        }
        PlayerPrefs.SetString(key, string.Join(" ", value));
    }
    private static List<T> GetList<T>(string key, List<T> defaultValue)
    {
        if (PlayerPrefs.HasKey(key) == false)
        {
            return defaultValue;
        }
        if (PlayerPrefs.GetString(key) == string.Empty)
        {
            return new List<T>();
        }
        string temp = PlayerPrefs.GetString(key);
        string[] listTemp = temp.Split(" ");
        List<T> list = new List<T>();

        foreach (string s in listTemp)
        {
            list.Add((T)Convert.ChangeType(s, typeof(T)));
        }
        return list;
    }

    public static int GetGem()
    {
        return PlayerPrefs.GetInt(PlayerPrefsKey.GEM_KEY, 0);
    }

    public static void SetGem(int stone)
    {
        PlayerPrefs.SetInt(PlayerPrefsKey.GEM_KEY, stone);
    }

    public static int GetLevel()
    {
        return PlayerPrefs.GetInt(PlayerPrefsKey.LEVEL_KEY, 1);
    }

    public static void SetLevel(int level)
    {
        PlayerPrefs.SetInt(PlayerPrefsKey.LEVEL_KEY, level);
    }

    #region PRICE DUCK LIST
    public static void SaveListPriceDuck(List<int> price)
    {
        SaveList<int>(PlayerPrefsKey.LIST_PRICE_KEY, price);
    }
    public static List<int> GetListPriceDuck(List<int> defaultValue = null)
    {
        defaultValue = defaultValue ?? new List<int>();
        for (int i = 0; i < 3; i++)
        {
            defaultValue.Add(100);
        }
        return GetList<int>(PlayerPrefsKey.LIST_PRICE_KEY, defaultValue);
    }

    public static void SavePriceIndexList(int price, int index)
    {
        List<int> list = GetListPriceDuck();
        list[index] = price;
        SaveListPriceDuck(list);
    }
    #endregion

    #region RESERVE SLOT LIST
    public static void SaveListID_ReserveSlot(List<int> idList)
    {
        SaveList<int>(PlayerPrefsKey.LIST_DUCK_RESERVE_KEY, idList);
    }

    public static List<int> GetListID_ReserveSlot(List<int> defaultValue = null)
    {
        defaultValue = defaultValue ?? new List<int>();
        for (int i = 0; i < 8; i++)
        {
            if (i == 0)
                defaultValue.Add(101);
            else
                defaultValue.Add(-1);
        }
        return GetList<int>(PlayerPrefsKey.LIST_DUCK_RESERVE_KEY, defaultValue);
    }

    public static void SaveIDIndexList_ReserveSlot(int idDuck, int indexSlot)
    {
        List<int> list = GetListID_ReserveSlot();
        list[indexSlot] = idDuck;
        SaveListID_ReserveSlot(list);
    }
    #endregion

    #region MAIN SLOT LIST
    public static void SaveListID_MainSlot(List<int> idList)
    {
        SaveList<int>(PlayerPrefsKey.LIST_DUCK_MAIN_KEY, idList);
    }

    public static List<int> GetListID_MainSlot(List<int> defaultValue = null)
    {
        defaultValue = defaultValue ?? new List<int>();
        for (int i = 0; i < 5; i++)
        {
            defaultValue.Add(-1);
        }
        return GetList<int>(PlayerPrefsKey.LIST_DUCK_MAIN_KEY, defaultValue);
    }

    public static void SaveIDIndexList_MainSlot(int idDuck, int indexSlot)
    {
        List<int> list = GetListID_MainSlot();
        list[indexSlot] = idDuck;
        SaveListID_MainSlot(list);
    }
    #endregion

    #region MAX_LEVEL_DUCK
    public static int GetHighestLevelDuckType(int idDuck)
    {
        string numberStr = idDuck.ToString();
        char firstChar = numberStr[0];
        return PlayerPrefs.GetInt(PlayerPrefsKey.HIGHEST_LEVEL_DUCK_TYPE_ + firstChar, -1);
    }

    public static void SetHighestLevelDuck(int idDuck)
    {
        string numberStr = idDuck.ToString();
        char firstChar = numberStr[0];
        PlayerPrefs.SetInt(PlayerPrefsKey.HIGHEST_LEVEL_DUCK_TYPE_ + firstChar, idDuck);
    }
    #endregion

    #region LIST MONSTER BY LEVEL
    public static void SaveListMonsterByLevel(List<int> idList)
    {
        SaveList<int>(PlayerPrefsKey.LIST_MONSTER_BY_LEVEL, idList);
    }

    //Phần tử đầu tiên là id của boss
    //Các phần tử sau là id của monster trong level đó
    public static List<int> GetListMonsterByLevel(List<int> defaultValue = null)
    {
        defaultValue = defaultValue ?? new List<int>();
        return GetList<int>(PlayerPrefsKey.LIST_MONSTER_BY_LEVEL, defaultValue);
    }

    public static void SaveIDBoss(int idBoss)
    {
        List<int> list = GetListMonsterByLevel();
        if (list.Count == 0)
            list.Add(idBoss);
        else
            list.Insert(0, idBoss);
        SaveListMonsterByLevel(list);
    }
    #endregion
}
