using System.Collections.Generic;
using CiFarm.Scripts.Utilities;
using UnityEngine;

namespace CiFarm.Scripts.SceneController.Game.PlantCore
{
    public class BasePlant : MonoBehaviour
    {
        [SerializeField] private SpriteRenderer plantRender;
        [SerializeField] private List<Sprite>   plantStatesRender;
        [SerializeField] private int            plantCurrentState = 0;

        public void SetPlantState(int plantState)
        {
            if (plantState > plantStatesRender.Count)
            {
                DLogger.LogError("Invalid plant state", "Plant", LogColors.OrangeRed);
                return;
            }

            plantCurrentState  = plantState - 1;
            plantRender.sprite = plantStatesRender[plantCurrentState];
        }

    }
}