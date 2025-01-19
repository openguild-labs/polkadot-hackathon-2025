using CiFarm.Scripts.Services.NakamaServices;
using CiFarm.Scripts.UI.Popups.Tutorial;
using CiFarm.Scripts.Utilities;
using UnityEngine;
using UnityEngine.EventSystems;

namespace CiFarm.Scripts.SceneController.Game.PlantCore
{
    public class GroundTile : MonoBehaviour, ITutorialItem
    {
        [SerializeField] private Transform positionPlant;

        [ReadOnly]
        public BasePlant plant;

        [ReadOnly]
        public PlacedItem tileData;

        public void Init(PlacedItem placedItem)
        {
            tileData = placedItem;
            DirtBubble bubble;

            if (!placedItem.seedGrowthInfo.isPlanted)
            {
                gameObject.name = "EmptyTile";
            }
            else
            {
                gameObject.name = placedItem.referenceKey + "Tile";
            }

            // show the fully grow
            if (tileData.seedGrowthInfo.fullyMatured)
            {
                bubble = TileBubbleController.Instance.SpawnBubble(positionPlant.position);
                bubble.SetBubble(tileData.key, InjectionType.TextQuantity,
                    currentQuantity: tileData.seedGrowthInfo.harvestQuantityRemaining,
                    maxQuantity: tileData.seedGrowthInfo.crop.maxHarvestQuantity);
            }
            else
            {
                switch (placedItem.seedGrowthInfo.currentState)
                {
                    case PlantCurrentState.NeedWater:
                        bubble = TileBubbleController.Instance.SpawnBubble(positionPlant.position);
                        bubble.SetBubble(tileData.key, InjectionType.Water);
                        break;
                    case PlantCurrentState.IsWeedy:
                        bubble = TileBubbleController.Instance.SpawnBubble(positionPlant.position);
                        bubble.SetBubble(tileData.key, InjectionType.Grass);
                        break;
                    case PlantCurrentState.IsInfested:
                        bubble = TileBubbleController.Instance.SpawnBubble(positionPlant.position);
                        bubble.SetBubble(tileData.key, InjectionType.Worm);
                        break;
                    default:
                        TileBubbleController.Instance.HideBubble(tileData.key);
                        break;
                }
            }
        }

        public void SetPlant(BasePlant plantToSet)
        {
            plant = plantToSet;
            plant.transform.SetParent(transform);
            plant.transform.position = positionPlant.position;
        }

        public void RemovePlant()
        {
            SimplePool.Despawn(plant.gameObject);
            tileData = null;
        }

        private void OnMouseDown()
        {
            if (EventSystem.current.IsPointerOverGameObject())
            {
                return;
            }

            GameController.Instance.OnClickGround(this);
        }

        public void ClearGround()
        {
            SimplePool.Despawn(gameObject);
        }

        public void HandleClickInTutorial(GameObject baseObj)
        {
            GameController.Instance.OnClickGround(baseObj.GetComponent<GroundTile>());
        }

        private void OnDisable()
        {
            if (plant != null)
            {
                SimplePool.Despawn(plant.gameObject);
            }

            plant    = null;
            tileData = null;
        }
    }
}