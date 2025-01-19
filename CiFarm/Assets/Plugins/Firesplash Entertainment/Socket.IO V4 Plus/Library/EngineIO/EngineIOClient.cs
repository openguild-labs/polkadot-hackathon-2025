using Firesplash.GameDevAssets.SocketIOPlus.Internal;
using System;
using UnityEngine;
using UnityEngine.Events;
using static Firesplash.GameDevAssets.SocketIOPlus.EngineIO.DataTypes;

namespace Firesplash.GameDevAssets.SocketIOPlus.EngineIO
{


    /// <summary>
    /// This component allows creating or accessing a "low level" EngineIO connection.
    /// It is created as a subset of our Socket.IO implementation but if required, you can directly access it for example to create your own protocol on top of Engine.IO
    /// It does not implement 100% of Engine.IO API but is enough for All-Day usage.
    /// The implementation of BINARY Engine.IO messages is untested and provided without warranty. Feel free to report bugs to us though.
    /// </summary>
    [DisallowMultipleComponent]
    [AddComponentMenu("Networking/Socket.IO/Low-Level Engine.IO Client")]
    public class EngineIOClient : MonoBehaviour
    {
        public string serverAddress;

        private protected string defaultPath = "/engine.io/";
        private protected Tranceiver tranceiver;

        private protected float timeSinceLastPing = 0;

        [Tooltip("If enabled, the library will drop all packets from the send queue that could not be transmitted when they were scheduled to be sent. Additionally the send queue is cleared on (re)connect.\nThis is very similar to the 'Volatile' Socket.IO mode and feels a bit like UDP - probably the best for realtime data.\n\nWhen disabled, queues are kept across reconnects and failed transmisions will be re-queued until they succeed, which is similar to the default Socket.IO mode. This has high reliability but can cause jams.")]
        public bool volatileOperationMode = true;



        /// <summary>
        /// Returns the connection state of the Engine.IO connection
        /// </summary>
        public ConnectionState State
        {
            get
            {
                if (tranceiver == null) return ConnectionState.None;
                return tranceiver.State;
            }
        }



        /// <summary>
        /// This UnityEvent is fired on the main thread after an Engine.IO message packet has been received on the websocket. Due to dispatching, it can be slightly delayed.
        /// </summary>
        [HideInInspector]
        public UnityEvent<EngineIOPacket> OnEngineIOMessageReceived;

        [HideInInspector]
        public UnityEvent<ConnectionParameters> OnEngineIOConnectionReady;

        [HideInInspector]
        public UnityEvent<bool, string> OnEngineIODisconnect;

        [HideInInspector]
        public UnityEvent<Exception> OnEngineIOError;



        /// <summary>
        /// This native C# callback is invoked immediately when an Engine.IO message packet is received on the websocket.
        /// Warning: If using Threaded and dispatched events, UnityEvents may be invoked out of order compared to only one kind of events. (You might receive Threaded Event 1, 2, 3 before actually receiving UnityEvent 2 for example)
        /// <b>This callback is invoked from a thread!</b>
        /// </summary>
        public EngineIOMessageReceivedEvent OnEngineIOMessageReceivedThreaded;

        /// <summary>
        /// This native C# callback is invoked immediately when an Engine.IO connection has been established and the handshake is done.
        /// Warning: If using Threaded and dispatched events, UnityEvents may be invoked out of order compared to only one kind of events. (You might receive Threaded Event 1, 2, 3 before actually receiving UnityEvent 2 for example)
        /// <b>This callback is invoked from a thread!</b>
        /// </summary>
        public EngineIOConnectionReadyEvent OnEngineIOConnectionReadyThreaded;

        public void Awake()
        {
#if UNITY_EDITOR
            if (!Application.runInBackground)
            {
                Debug.LogWarning("[Engine.IO] Your project is set to not run in background. This will cause connection issues with Engine.IO/Socket.IO - Consider enabling this option in the player settings.\nThis warning will only be shown when testing in the editor.");
            }
#endif
            SIODispatcher.Verify();

            OnEngineIOMessageReceived = new UnityEvent<EngineIOPacket>();
            OnEngineIOConnectionReady = new UnityEvent<ConnectionParameters>();
            OnEngineIODisconnect = new UnityEvent<bool, string>();
            OnEngineIOError = new UnityEvent<Exception>();

#if UNITY_WEBGL && !UNITY_EDITOR
            tranceiver = new WebGLImplementation(defaultPath);
#else
            tranceiver = new NativeImplementation(defaultPath);
#endif

            tranceiver.OnConnectionReady += (connectionParams) =>
            {
                SIODispatcher.Instance?.Enqueue(() => {
                    if (OnEngineIOMessageReceived != null) OnEngineIOConnectionReady.Invoke(connectionParams);
                });
                if (OnEngineIOConnectionReadyThreaded != null) OnEngineIOConnectionReadyThreaded.Invoke(connectionParams);
            };

            tranceiver.OnDataReceived += (packet) =>
            {
                timeSinceLastPing = 0; //We treat every incoming packet like a ping to avoid running into a local timeout when the connection is busy

                if (packet.GetPacketType() == EIOPacketType.Ping)
                {
                    return;
                } 
                else if (packet.GetPacketType() == EIOPacketType.Close)
                {
                    return;
                }

                SIODispatcher.Instance?.Enqueue(() => {
                    if (OnEngineIOMessageReceived != null) OnEngineIOMessageReceived.Invoke(packet);
                });
                if (OnEngineIOMessageReceivedThreaded != null) OnEngineIOMessageReceivedThreaded.Invoke(packet);
            };

            tranceiver.OnDisconnect += (serverInitiated, reason) =>
            {
                SIODispatcher.Instance?.Enqueue(() => {
                    if (OnEngineIODisconnect != null) OnEngineIODisconnect.Invoke(serverInitiated, reason);
                });
            };

            tranceiver.OnError += (exc) =>
            {
                SIODispatcher.Instance?.Enqueue(() => {
                    if (OnEngineIOError != null) OnEngineIOError.Invoke(exc);
                });
            };
        }

        protected void LateUpdate()
        {
            if (State == ConnectionState.Open)
            {
                timeSinceLastPing += Time.unscaledDeltaTime;
                if (timeSinceLastPing > (tranceiver.connectionParams.pingInterval + tranceiver.connectionParams.pingTimeout))
                {
                    //Whoops!
#if VERBOSE
                    Debug.Log("[Engine.IO] ping timeout");
#endif
                    tranceiver.Disconnect(false, "ping timeout");
                }
            } 
            else
            {
                timeSinceLastPing = 0;
            }
        }

        /// <summary>
        /// Connect the client to the server
        /// </summary>
        /// <param name="serverAddress">The server Uri to connect to, using the stored server if omitted</param>
        /// <param name="volatileMode">If true, failed transmissions are not retried and queue is cleared on connect. A little like UDP. - If false, failed transmissions are re-queued.</param>
        public virtual void Connect(string pServerAddress, bool volatileMode)
        {
            if (pServerAddress != null) serverAddress = pServerAddress;
            volatileOperationMode = volatileMode;
            Connect();
        }

        /// <summary>
        /// Connect the client to the server
        /// </summary>
        /// <param name="serverAddress">The server Uri to connect to, using the stored server if omitted</param>
        public virtual void Connect(string pServerAddress = null)
        {
            if (pServerAddress != null) serverAddress = pServerAddress;
            tranceiver.Connect(serverAddress, volatileOperationMode);
        }

        /// <summary>
        /// Disconnect the Engine.IO client
        /// </summary>
        public virtual void Disconnect()
        {
            tranceiver.Disconnect(false);
        }

        /// <summary>
        /// Sends a string message to the server using raw Engine.IO protocol
        /// </summary>
        /// <param name="message">The message</param>
        public void SendEngineIOMessage(string message)
        {
            tranceiver.SendDataPacket(new EngineIOPacket(message));
        }

        /// <summary>
        /// Sends a binary message to the server using raw Engine.IO protocol
        /// </summary>
        /// <param name="message">The message</param>
        public void SendEngineIOMessage(byte[] message)
        {
            tranceiver.SendDataPacket(new EngineIOPacket(message));
        }

        /// <summary>
        /// Sends a previously built Engine.IO packet without modification
        /// </summary>
        /// <param name="packet">The packet</param>
        public void SendEngineIOPacket(EngineIOPacket packet)
        {
            tranceiver.SendDataPacket(packet);
        }

        /// <summary>
        /// Sends multiple previously built Engine.IO packets without modification in row
        /// </summary>
        /// <param name="packets">The packet array</param>
        public void SendEngineIOPackets(EngineIOPacket[] packets)
        {
            tranceiver.SendDataPackets(packets);
        }

        /// <summary>
        /// Sends a previously built Engine.IO packet without modification in technical stream (immediately)
        /// </summary>
        /// <param name="packet">The packet</param>
        internal void SendEngineIOTechnicalPacket(EngineIOPacket packet)
        {
            tranceiver.SendTechnicalPacket(packet);
        }

        /// <summary>
        /// Returns the length of the current data send queue in transmissions/emits
        /// Warning: This is a blocking and quite slow call.
        /// </summary>
        public int SendQueueLength
        {
            get
            {
                return tranceiver.GetQueueLength();
            }
        }

        /// <summary>
        /// This clears the data send queue
        /// </summary>
        public void ClearSendQueue()
        {
            tranceiver.ClearQueue();
        }
    }
}
