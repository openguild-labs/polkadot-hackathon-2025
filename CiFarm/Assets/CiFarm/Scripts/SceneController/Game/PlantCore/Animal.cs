using System.Collections.Generic;
using CiFarm.Scripts.Services.NakamaServices;
using CiFarm.Scripts.UI.Popups.Tutorial;
using CiFarm.Scripts.Utilities;
using UnityEngine;
using UnityEngine.EventSystems;

namespace CiFarm.Scripts.SceneController.Game.PlantCore
{
    public class Animal : MonoBehaviour, ITutorialItem
    {
        [SerializeField] private Transform        animalPosition;
        [SerializeField] private List<GameObject> animalStateSpine;

        [ReadOnly]
        public PlacedItem tileData;

        public void Init(PlacedItem placedItem)
        {
            tileData = placedItem;
            DirtBubble bubble;

            if (!placedItem.seedGrowthInfo.isPlanted)
            {
                gameObject.name = "UnUseAnimal";
            }
            else
            {
                gameObject.name = placedItem.referenceKey;
            }

            if (tileData.animalInfo.hasYielded)
            {
                bubble = TileBubbleController.Instance.SpawnBubble(transform.position);
                bubble.SetBubble(tileData.key, InjectionType.TextQuantity,
                    currentQuantity: tileData.animalInfo.harvestQuantityRemaining);
            }
            else
            {
                switch (placedItem.animalInfo.currentState)
                {
                    case AnimalCurrentState.Normal:
                        bubble = TileBubbleController.Instance.SpawnBubble(animalPosition.position);
                        bubble.SetBubble(tileData.key, InjectionType.Water);
                        break;
                    case AnimalCurrentState.Hungry:
                        bubble = TileBubbleController.Instance.SpawnBubble(animalPosition.position);
                        bubble.SetBubble(tileData.key, InjectionType.Water);
                        break;
                    case AnimalCurrentState.Sick:
                        bubble = TileBubbleController.Instance.SpawnBubble(animalPosition.position);
                        bubble.SetBubble(tileData.key, InjectionType.Water);
                        break;
                    default:
                        TileBubbleController.Instance.HideBubble(tileData.key);
                        break;
                }
            }
        }

        private void OnMouseDown()
        {
            if (EventSystem.current.IsPointerOverGameObject())
            {
                return;
            }

            GameController.Instance.OnClickAnimal(this);
        }

        public void HandleClickInTutorial(GameObject baseObj)
        {
        }
    }
}