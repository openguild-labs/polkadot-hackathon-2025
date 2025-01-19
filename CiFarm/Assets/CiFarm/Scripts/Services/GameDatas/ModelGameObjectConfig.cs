using System;
using System.Collections.Generic;
using System.Linq;
using CiFarm.Scripts.Utilities;
using UnityEngine;

namespace CiFarm.Scripts.Services.GameDatas
{
    [CreateAssetMenu(fileName = "ModelGameConfig", menuName = "GameDatas/ModelConfig", order = 1)]
    public class ModelGameObjectConfig : ScriptableObject
    {
        [SerializeField] private List<ModelConfigEntity> tileMapper;
        [SerializeField] private List<ModelConfigEntity> plantMapper;
        [SerializeField] private List<ModelAnimalEntity> animalMapper;

        public List<ModelConfigEntity> TileMapper   => tileMapper;
        public List<ModelConfigEntity> PlantMapper  => plantMapper;
        public List<ModelAnimalEntity> AnimalMapper => animalMapper;

        public ModelConfigEntity GetPlant(string keyToFind)
        {
            var result = PlantMapper.FirstOrDefault(o => o.Key == keyToFind);
            if (result == null)
            {
                DLogger.LogError("GetPlant not found for: " + keyToFind, "ModelGameObjectConfig");
                return null;
            }

            return result;
        }

        public ModelConfigEntity? GetTile(string keyToFind)
        {
            var result = tileMapper.FirstOrDefault(o => o.Key == keyToFind);
            if (result == null)
            {
                DLogger.LogError("GetTile not found for: " + keyToFind, "ModelGameObjectConfig");
                return null;
            }

            return result;
        }

        public ModelAnimalEntity GetAnimal(string keyToFind)
        {
            var result = animalMapper.FirstOrDefault(o => o.Key == keyToFind);
            if (result == null)
            {
                DLogger.LogError("GetAnimal not found for: " + keyToFind, "ModelGameObjectConfig");
                return null;
            }

            return result;
        }
    }

    [Serializable]
    public class ModelConfigEntity
    {
        [SerializeField] private string     key;
        [SerializeField] private string     itemName;
        [SerializeField] private Vector2Int tileSize = Vector2Int.one;
        [SerializeField] private GameObject prefabModel;
        [SerializeField] private Sprite     gameShopIcon;
        [SerializeField] private Sprite     gameHarvestIcon;

        public string     Key      => key;
        public string     ItemName => itemName;
        public Vector2Int TileSize => tileSize;

        public GameObject PrefabModel => prefabModel;

        public Sprite GameShopIcon => gameShopIcon;

        public Sprite GameHarvestIcon => gameHarvestIcon;
    }

    [Serializable]
    public class ModelAnimalEntity
    {
        [SerializeField] private string     key;
        [SerializeField] private Sprite     miniSpriteUI;
        [SerializeField] private Sprite     bigSpriteUI;
        [SerializeField] private GameObject animalMiniSpineUIModel;
        [SerializeField] private GameObject animalBigSpineUIModel;
        [SerializeField] private GameObject animalMiniSpineGameObjectModel;
        [SerializeField] private GameObject animalBigSpineGameObjectModel;

        public string Key => key;

        public Sprite MiniSpriteUI => miniSpriteUI;

        public Sprite BigSpriteUI => bigSpriteUI;

        public GameObject AnimalMiniSpineUIModel => animalMiniSpineUIModel;

        public GameObject AnimalBigSpineUIModel => animalBigSpineUIModel;

        public GameObject AnimalMiniSpineGameObjectModel => animalMiniSpineGameObjectModel;

        public GameObject AnimalBigSpineGameObjectModel => animalBigSpineGameObjectModel;
    }
}