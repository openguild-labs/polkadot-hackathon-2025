using CiFarm.Scripts.Services;
using CiFarm.Scripts.Services.NakamaServices;
using CiFarm.Scripts.UI.Popups;
using CiFarm.Scripts.UI.View;
using CiFarm.Scripts.UI.View.GameViewComponent;
using Imba.UI;
using UnityEngine;
using UnityEngine.EventSystems;

namespace CiFarm.Scripts.SceneController.Game
{
    public class EditModeController : MonoBehaviour
    {
        [SerializeField] private TileMapController tileMapController;
        [SerializeField] private CameraController  cameraController;

        private EditView _editView;

        private GameObject    _controllingItem;
        private InvenItemData _invenItemData;

        private Vector2Int _currentPosition;
        private Vector2Int _currentItemSize;

        private string _structuralId;
        private bool   _isInit;
        private bool   _isPause;

        private void Awake()
        {
            _editView = UIManager.Instance.ViewManager.GetViewByName<EditView>(UIViewName.EditView);
        }

        public void Update()
        {
            if (!_isInit || _isPause)
            {
                return;
            }

            if (_editView.ToolManager.CurrentTool.toolType == ToolType.PlacingItem)
            {
                cameraController.LockCamera();
                _controllingItem.SetActive(true);
                _currentPosition =
                    tileMapController.SetFakeGround(Input.mousePosition, _controllingItem, _currentItemSize);

                if (Input.GetMouseButtonDown(0) && !EventSystem.current.IsPointerOverGameObject())
                {
                    ShowConfirmPopup();
                }

                return;
            }

            if (_editView.ToolManager.CurrentTool.toolType == ToolType.Moving)
            {
                _controllingItem.SetActive(false);
                cameraController.UnLockCamera();
            }
        }

        public void EnterEditMode(InvenItemData data, string structuralId = "")
        {
            _invenItemData = data;
            var configData     = ResourceService.Instance.ModelGameObjectConfig.GetTile(_invenItemData.referenceKey);
            var prefabDirtData = configData.PrefabModel;
            _structuralId    = structuralId;
            _currentItemSize = configData.TileSize;
            _controllingItem = SimplePool.Spawn(prefabDirtData, Vector3.zero, prefabDirtData.transform.rotation);
            _controllingItem.SetActive(false);
            tileMapController.DisplayAvailableToPlacingItem();
            _isInit  = true;
            _isPause = false;
        }

        public void ExitEditMode()
        {
            tileMapController.ClearAvailableToPlacingItem();
            _controllingItem.SetActive(false);
            cameraController.UnLockCamera();
            _isInit  = false;
            _isPause = false;
        }

        public void ShowConfirmPopup()
        {
            _isPause = true;
            UIManager.Instance.PopupManager.ShowMessageDialog("Confirm", "Are you sure to place crop to this position",
                UIMessageBox.MessageBoxType.Yes_No, (st) =>
                {
                    if (st == UIMessageBox.MessageBoxAction.Accept)
                    {
                        switch (_invenItemData.type)
                        {
                            case InventoryType.Seed:
                                break;
                            case InventoryType.Tile:
                                OnConfirmPlaceDirt();
                                break;
                            case InventoryType.Animal:
                                OnConfirmPlaceAnimal();
                                break;
                            case InventoryType.PlantHarvested:
                                break;
                            case InventoryType.Building:
                                OnConfirmPlaceBuilding();
                                break;
                            default:
                                return true;
                        }
                    }
                    else
                    {
                        _isPause = false;
                    }

                    return true;
                });
        }

        public async void OnConfirmPlaceBuilding()
        {
            _isPause = true;
            UIManager.Instance.ShowLoading();
            _controllingItem.SetActive(false);
            await NakamaEditFarmService.Instance.ConstructBuildingAsync(_invenItemData.key, new Position
            {
                x = _currentPosition.x,
                y = _currentPosition.y
            });
            _isPause = false;
            GameController.Instance.ExitEditMode();
            UIManager.Instance.HideLoading();
        }

        public async void OnConfirmPlaceDirt()
        {
            _isPause = true;
            UIManager.Instance.ShowLoading();
            _controllingItem.SetActive(false);
            await NakamaEditFarmService.Instance.PlaceTileAsync(_invenItemData.key, new Position
            {
                x = _currentPosition.x,
                y = _currentPosition.y
            });
            _isPause = false;
            GameController.Instance.ExitEditMode();
            UIManager.Instance.HideLoading();
        }

        public async void OnConfirmPlaceAnimal()
        {
            _isPause = true;
            UIManager.Instance.ShowLoading();
            _controllingItem.SetActive(false);
            await NakamaEditFarmService.Instance.PlaceAnimalAsync(_invenItemData.key, _structuralId, new Position()
            {
                x = _currentPosition.x,
                y = _currentPosition.y
            });
            _isPause = false;
            GameController.Instance.ExitEditMode();
            UIManager.Instance.HideLoading();
        }
    }
}