using CiFarm.Scripts.UI.Popups;
using Imba.UI;
using UnityEngine;
using UnityEngine.EventSystems;

namespace CiFarm.Scripts.SceneController.Game.PlantCore
{
    public class Structural : MonoBehaviour
    {
        public string structuralId = "";
        public string referenceId  = "";

        private void OnMouseDown()
        {
            if (EventSystem.current.IsPointerOverGameObject())
            {
                return;
            }
            GameController.Instance.OnClickStructural(this);
      
        }
    }
}