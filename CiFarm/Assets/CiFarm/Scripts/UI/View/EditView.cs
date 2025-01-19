using CiFarm.Scripts.SceneController.Game;
using CiFarm.Scripts.Services;
using CiFarm.Scripts.UI.View.GameViewComponent;
using CiFarm.Scripts.Utilities;
using Imba.UI;
using UnityEngine;

namespace CiFarm.Scripts.UI.View
{
    public class EditViewParameter
    {
        public string InventoryId;
    }

    public class EditView : UIView
    {
        [SerializeField] private ToolManager toolManager;

        public ToolManager ToolManager => toolManager;

        protected override void OnShown()
        {
            base.OnShown();
            if (Parameter != null)
            {
                var pr = (EditViewParameter)Parameter;

                var gameConfig = ResourceService.Instance.ModelGameObjectConfig.GetTile(pr.InventoryId);
                toolManager.toolDatas.Add(new ToolData
                {
                    key      = pr.InventoryId,
                    toolType = ToolType.PlacingItem,
                    toolIc   = gameConfig.GameShopIcon
                });
                DLogger.Log(gameConfig.ToString());
                toolManager.LoadTool();
            }
        }

        public void OnClickReturn()
        {
            GameController.Instance.ExitEditMode();
        }
    }
}