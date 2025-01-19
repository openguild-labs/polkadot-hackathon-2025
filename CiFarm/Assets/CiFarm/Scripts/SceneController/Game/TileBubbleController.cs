using System.Collections.Generic;
using System.Linq;
using CiFarm.Scripts.SceneController.Game.PlantCore;
using CiFarm.Scripts.Utilities;
using Imba.Utils;
using UnityEngine;

namespace CiFarm.Scripts.SceneController.Game
{
    public class TileBubbleController : ManualSingletonMono<TileBubbleController>
    {
        private Dictionary<string, DirtBubble> _showingBubble;

        [SerializeField] private GameObject dirtBubbleModel;

        public override void Awake()
        {
            base.Awake();
            _showingBubble = new Dictionary<string, DirtBubble>();
        }

        public bool CheckBubble(string id)
        {
            return _showingBubble.ContainsKey(id);
        }

        public void OnBubbleAppear(string id, DirtBubble bubble)
        {
            _showingBubble.TryAdd(id, bubble);
        }

        public void OnBubbleDisappear(string id)
        {
            if (_showingBubble.ContainsKey(id))
            {
                _showingBubble.Remove(id);
            }
        }

        public void HideBubble(string id)
        {
            if (_showingBubble.TryGetValue(id, out DirtBubble bubble))
            {
                // this type is auto close
                if (bubble.typeBubble == InjectionType.Timer)
                {
                    return;
                }

                bubble.OffBubble();
                _showingBubble.Remove(id);
            }
        }

        public void ClearAllBubble()
        {
            DLogger.Log("bubble clearing");

            foreach (var bubble in _showingBubble.Values)
            {
                DLogger.Log("bubble clear");
                SimplePool.Despawn(bubble.gameObject);
            }

            _showingBubble.Clear();
        }

        public void ValidateBubble(List<string> currentDirtId)
        {
            var notValidBubble = _showingBubble.Keys.Where(o => !currentDirtId.Contains(o)).ToList();

            foreach (var bubbleNotValid in notValidBubble)
            {
                SimplePool.Despawn(_showingBubble[bubbleNotValid].gameObject);
                _showingBubble.Remove(bubbleNotValid);
            }
        }

        public DirtBubble SpawnBubble(Vector3 position)
        {
            var dirtBubbleObj = SimplePool.Spawn(dirtBubbleModel, position, Quaternion.identity);
            return dirtBubbleObj.GetComponent<DirtBubble>();
        }
    }
}