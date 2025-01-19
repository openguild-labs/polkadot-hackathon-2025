using System.Collections.Generic;
using CiFarm.Scripts.Utilities;
using UnityEngine;
using UnityEngine.Tilemaps;

namespace CiFarm.Scripts.SceneController.Game
{
    public class TileMapController : MonoBehaviour
    {
        [Header("Game tile")]
        public Tilemap gameTileMap;

        public Tile   hiddenInteractableTile;
        public string interactableTileName        = "interactions";
        public string interactableTileVisibleName = "interactions_visible";

        [Header("Tile Interactions")]
        public Tilemap interactableMap;

        public Tile   validTile;
        public string validTileName = "datBorder";

        public HashSet<Vector2Int> PlacedPositionHashSet;

        private void Awake()
        {
            PlacedPositionHashSet = new HashSet<Vector2Int>();
            foreach (var position in gameTileMap.cellBounds.allPositionsWithin)
            {
                TileBase tile = gameTileMap.GetTile(position);
                if (tile != null && tile.name == interactableTileVisibleName)
                {
                    gameTileMap.SetTile(position, hiddenInteractableTile);
                }
            }
        }

        public void SetAnyWithWithTilePos(Vector2Int position2D, GameObject objectPlaced, Vector2Int objectSize)
        {
            var position           = new Vector3Int(position2D.x, position2D.y, 0);
            var tileCenterPosition = gameTileMap.CellToWorld(position);

            TileBase tile = gameTileMap.GetTile(position);

            if (tile != null && tile.name == interactableTileName)
            {
                // Adjust the position to the bottom-left corner of the tile
                tileCenterPosition -= new Vector3(gameTileMap.cellSize.x / 2.0f, gameTileMap.cellSize.y / 2.0f, 0);

                objectPlaced.transform.position = tileCenterPosition;
                PlacedPositionHashSet.Add(position2D);
                for (int x = 0; x < objectSize.x; x++)
                {
                    for (int y = 0; y < objectSize.y; y++)
                    {
                        PlacedPositionHashSet.Add(new Vector2Int(position2D.x + x, position2D.y + y));
                    }
                }
            }
            else
            {
                if (tile == null)
                {
                    DLogger.Log("No tile at this position (NULL)", "TileManager", LogColors.Lime);
                }
                else
                {
                    DLogger.Log($"Tile name: {tile.name}", "TileManager", LogColors.Lime);
                }
            }
        }

        public void ResetPosition()
        {
            PlacedPositionHashSet.Clear();
        }

        public Vector2Int SetFakeGround(Vector3 position, GameObject objectPlaced, Vector2Int itemSize)
        {
            var worldPosition = Camera.main.ScreenToWorldPoint(position);
            worldPosition.z = 0;

            var cellPosition = interactableMap.WorldToCell(worldPosition);

            cellPosition.x++; // OFFSET

            var tileCenterPosition = interactableMap.CellToWorld(cellPosition);

            var isValid = true;

            // VALIDATE
            if (PlacedPositionHashSet.Contains((Vector2Int)cellPosition))
            {
                return (Vector2Int)cellPosition;
            }

            // VALIDATE
            for (int x = 0; x < itemSize.x; x++)
            {
                for (int y = 0; y < itemSize.y; y++)
                {
                    if (PlacedPositionHashSet.Contains(new Vector2Int(cellPosition.x + x, cellPosition.y + y)))
                    {
                        return (Vector2Int)cellPosition;
                    }

                    var checkPosition = new Vector3Int(cellPosition.x + x, cellPosition.y + y, cellPosition.z);
                    var tile          = interactableMap.GetTile(checkPosition);
                    if (!tile || tile.name != validTileName)
                    {
                        return (Vector2Int)cellPosition;
                    }
                }
            }

            tileCenterPosition -= new Vector3(gameTileMap.cellSize.x / 2.0f, gameTileMap.cellSize.y / 2.0f, 0);
            objectPlaced.transform.position = tileCenterPosition;
            return (Vector2Int)cellPosition;
        }

        public void DisplayAvailableToPlacingItem()
        {
            foreach (var position in gameTileMap.cellBounds.allPositionsWithin)
            {
                TileBase tile = gameTileMap.GetTile(position);
                if (tile != null && tile.name == interactableTileName)
                {
                    interactableMap.SetTile(position, validTile);
                }
            }
        }

        public void ClearAvailableToPlacingItem()
        {
            foreach (var position in interactableMap.cellBounds.allPositionsWithin)
            {
                TileBase tile = interactableMap.GetTile(position);
                if (tile != null)
                {
                    interactableMap.SetTile(position, null);
                }
            }
        }
    }
}