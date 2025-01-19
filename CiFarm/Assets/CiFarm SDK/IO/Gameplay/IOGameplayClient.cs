using System;
using System.Collections;
using CiFarm.Utils;
using Firesplash.GameDevAssets.SocketIOPlus;
using Imba.Utils;
using Newtonsoft.Json;
using UnityEngine;
using UnityEngine.Events;

namespace CiFarm.IO
{
    public partial class IOClient : ManualSingletonMono<IOClient>
    {
        private const string NAMESPACE_GAMEPLAY = "/gameplay";

        [SerializeField]
        private UnityAction<PlacedItemsSyncedMessage> _placedItemsSyncedAction;

        public UnityAction<PlacedItemsSyncedMessage> PlacedItemsSyncedAction
        {
            get => _placedItemsSyncedAction;
            set => _placedItemsSyncedAction = value;
        }

        private SocketIONamespace _gameplayNS;

        /// <summary>
        /// Connect to the gameplay namespace
        /// </summary>
        private void ConnectToGameplayNamespace()
        {
            _gameplayNS = CiFarmSDK.Instance.SocketIOClient.GetNamespace(NAMESPACE_GAMEPLAY);
            _gameplayNS.On(
                "connect",
                () =>
                {
                    ConsoleLogger.LogSuccess($"Connected to the namespace: {NAMESPACE_GAMEPLAY}");

                    ConsoleLogger.LogSuccess("Subscribing to placed_items_synced event");
                }
            );
            _gameplayNS.On<PlacedItemsSyncedMessage>(
                "placed_items_synced",
                (message) =>
                {
                    ConsoleLogger.LogSuccess("Placed items synced");
                    ConsoleLogger.LogDebug(message);

                    _placedItemsSyncedAction?.Invoke(message);
                }
            );
        }

        /// <summary>
        /// Sync placed items
        /// </summary>
        public void SyncPlacedItems()
        {
            _gameplayNS.Emit("sync_placed_items");
        }
    }
}
