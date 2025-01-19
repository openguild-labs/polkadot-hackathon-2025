using Firesplash.GameDevAssets.SocketIOPlus.EngineIO;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Text;
using UnityEngine;
using static Firesplash.GameDevAssets.SocketIOPlus.EngineIO.DataTypes;

//Note: EngineIO should create a new gameobject as a receiver using a prefix and a GUID as name to safely communicate with JSLib.

namespace Firesplash.GameDevAssets.SocketIOPlus
{
    internal class WebGLImplementation : Tranceiver
    {
        /// <summary>
        /// This is thrown when an error is received from the JSLib implementation. The browser console might contain additional information.
        /// </summary>
        public class EngineIOWebGLException : Exception
        {
            internal EngineIOWebGLException(string message) : base(message) { }
        }

#if UNITY_WEBGL
        SIOWebGLMessenger messenger;


        class SIOWebGLMessenger : MonoBehaviour
        {
            object queueLock;
            LinkedList<EngineIOPacket[]> sendQueue;
            ConcurrentQueue<EngineIOPacket> technicalQueue;

            [System.Runtime.InteropServices.DllImport("__Internal")]
            private static extern void EngineIOWSCreateInstance(string instanceName, string targetAddress, Action<byte[], int, string, int> binaryMsgCallback);

            [System.Runtime.InteropServices.DllImport("__Internal")]
            private static extern bool EngineIOWSSendString(string instanceName, string message);

            [System.Runtime.InteropServices.DllImport("__Internal")]
            private static extern bool EngineIOWSSendBinary(string instanceName, byte[] message, int msgLength);

            [System.Runtime.InteropServices.DllImport("__Internal")]
            private static extern void EngineIOWSClose(string instanceName);

            internal ConnectionState State = 0;
            bool volatileMode = true;

            internal delegate void WebsocketDataReceivedEvent(bool isBinary, object data);
            internal delegate void WebsocketStateReceivedEvent(int newState, bool uncleanChange);
            internal delegate void WebsocketErrorEvent(string errorMessage);
            internal WebsocketDataReceivedEvent OnDataReceived;
            internal WebsocketStateReceivedEvent OnStateReceived;
            internal WebsocketErrorEvent OnError;

            internal SIOWebGLMessenger()
            {
                Debug.Log("[Engine.IO] Created JSLib Messenger for Engine.IO using name " + this.name);
                queueLock = new object();
                sendQueue = new LinkedList<EngineIOPacket[]>();
                technicalQueue = new ConcurrentQueue<EngineIOPacket>();
            }

            private void Update()
            {
                Loop();
            }

            //This is called from Update() and if running in background, also from JS
            private void Loop() {
                int count = 0;

                //Send technical packets first
                if (technicalQueue.Count > 0)
                {
                    EngineIOPacket packet;
                    technicalQueue.TryDequeue(out packet);
                    if (packet != null)
                    {
                        EngineIOWSSendString(this.name, packet.GetPacketStringForTransmission());
                    }
                }

                //limit to 50 packets per frame to save framerate as this synchronous
                while (State == ConnectionState.Open && sendQueue.Count > 0 && count++ < 50)
                {
                    EngineIOPacket[] packets;
                    lock (queueLock)
                    {
                        packets = sendQueue.First.Value;
                        sendQueue.RemoveFirst();
                    }
                    foreach (EngineIOPacket packet in packets)
                    {
                        if (packet.IsBinaryMessage())
                        {
                            byte[] bytes = packet.GetPacketBytesForTransmission();
                            if (!EngineIOWSSendBinary(this.name, bytes, bytes.Length) && !volatileMode)
                            {
                                Debug.LogWarning("[Engine.IO] Error transmitting a parcel of " + packets.Length + " packets. Returning it to the queue.");
                                lock (queueLock)
                                {
                                    sendQueue.AddFirst(packets);
                                    return; //Return instead of break as we encountered an error sending anyways
                                }
                            }
                        }
                        else
                        {
                            if (!EngineIOWSSendString(this.name, packet.GetPacketStringForTransmission()) && !volatileMode)
                            {
                                Debug.LogWarning("[Engine.IO] Error transmitting a parcel of " + packets.Length + " packets. Returning it to the queue.");
                                lock (queueLock)
                                {
                                    sendQueue.AddFirst(packets);
                                    return; //Return instead of break as we encountered an error sending anyways
                                }
                            }
                        }
                    }
                }
            }

            internal void Connect(string serverAddress, bool volatileMode)
            {
                this.volatileMode = volatileMode;
                EngineIOWSCreateInstance(this.name, serverAddress, EngineIOWebSocketBinaryMessageProxy);
            }

            internal void Close()
            {
                EngineIOWSClose(this.name);
            }

            // internal method called from JSLib
            public void EngineIOWebSocketState(int state)
            {
                Debug.Log("EngineIOWebSocketState: " + state);
                State = (ConnectionState)state;
                OnStateReceived?.Invoke(state, false);
            }

            // internal method called from JSLib
            public void EngineIOWebSocketUncleanState(int state)
            {
                Debug.Log("EngineIOWebSocketUncleanState: " + state);
                State = (ConnectionState)state;
                OnStateReceived?.Invoke(state, true);
            }

            // internal method called from JSLib
            public void EngineIOWebSocketStringMessage(string data)
            {
                OnDataReceived?.Invoke(false, data);
            }

            // internal method called from JSLib
            public void EngineIOWebSocketBinaryMessageOld(byte[] data)
            {
                OnDataReceived?.Invoke(true, data);
            }

            // internal method called from JSLib as a callback
            [AOT.MonoPInvokeCallback(typeof(Action<byte[], int, string, int>))]
            private static void EngineIOWebSocketBinaryMessageProxy(
                [MarshalAs(UnmanagedType.LPArray, ArraySubType = UnmanagedType.U1, SizeParamIndex = 1)] byte[] data,
                int dataLength,
                [MarshalAs(UnmanagedType.LPUTF8Str, SizeParamIndex = 3)] string receiverObject,
                int receiverLength
            )
            {
                if (data != null)
                {
                    GameObject go = GameObject.Find(receiverObject);
                    if (go != null) {
                        go.GetComponent<SIOWebGLMessenger>()?.EngineIOWebSocketBinaryMessage(data);
                    } else {
                        Debug.LogWarning("[Engine.IO] Binary Message Target GameObject " + receiverObject + " has not been found.");
                    }
                }
            }

            private void EngineIOWebSocketBinaryMessage(byte[] data)
            {
                OnDataReceived?.Invoke(true, data);
            }

            // internal method called from JSLib
            public void EngineIOWebSocketError(string error)
            {
                Debug.Log("EngineIOWebSocketError: " + error);
                OnError?.Invoke(error);
            }

            // internal method called from JSLib
            public void EngineIOBackgroundHelper()
            {
                Loop();
            }

            public void SendData(EngineIOPacket[] packets)
            {
                lock (queueLock)
                {
                    sendQueue.AddLast(packets);
                }
            }

            public void SendData(EngineIOPacket packet)
            {
                SendData(new EngineIOPacket[] { packet });
            }

            public void SendTechnicalPacket(EngineIOPacket packet)
            {
                technicalQueue.Enqueue(packet);
            }

            public void ClearQueue()
            {
                lock (queueLock)
                {
                    sendQueue.Clear();
                }
            }

            public int GetQueueLength()
            {
                lock (queueLock)
                {
                    return sendQueue.Count;
                }
            }

            ~SIOWebGLMessenger()
            {
                EngineIOWSClose(this.name);
            }
        }

        internal override ConnectionState State
        {
            get
            {
                if (messenger == null) return ConnectionState.None;
                if (!handshakeCompleted && messenger.State == ConnectionState.Open) return ConnectionState.Handshake;
                return messenger.State;
            }
        }

        internal WebGLImplementation(string pDefaultPath) : base(pDefaultPath)
        {
            messenger = (SIOWebGLMessenger)new GameObject("SIOMessenger-" + Guid.NewGuid().ToString()).AddComponent(typeof(SIOWebGLMessenger));
            GameObject.DontDestroyOnLoad(messenger.gameObject);
            messenger.OnDataReceived += (isBinary, data) =>
            {
                EngineIOPacket eiop = EngineIOPacket.Parse(isBinary, (isBinary ? (byte[])data : Encoding.UTF8.GetBytes((string)data)));
#if EIO_DEBUG
                if (isBinary) Log(" < BINARY");
                else {
                    Log(" < TYPE=" + eiop.GetPacketType().ToString());
                }
#endif
                ReceiveMessage(eiop);
            };

            messenger.OnError += (errorMsg) =>
            {
                OnError?.Invoke(new EngineIOWebGLException(errorMsg));
            };

            messenger.OnStateReceived += (newState, uncleanChange) =>
            {
                switch ((ConnectionState)newState)
                {
                    case ConnectionState.Open:
                        isClosingCleanly = false;
                        break;
                    case ConnectionState.Closed:
                        technicalQueue.Clear();
                        if (uncleanChange)
                        {
                            Disconnect(!isClosingCleanly, "transport close");
                        }
                        else
                        {
#if EIO_DEBUG
                            Log("Closing cleanly");
#endif
                            isClosingCleanly = true;
                            Disconnect(!isClosingCleanly, "io server disconnect");
                        }
                        break;
                }
            };
        }

        ~WebGLImplementation()
        {
            if (messenger != null) GameObject.DestroyImmediate(messenger);
        }

        internal override void Connect(string serverAddress, bool volatileMode)
        {
            Log("Connecting to server using WebGL implementation");
            base.Connect(serverAddress, volatileMode);
            messenger.Connect(connectionTarget.ToString(), volatileMode);
        }

        internal override void Disconnect(bool serverInitiated, string technicalReason = null)
        {
            if (State == ConnectionState.Open)
            {
                lock (queueLock)
                {
                    sendQueue.AddFirst(new EngineIOPacket[] { new EngineIOPacket(EIOPacketType.Close) });
                }
            }

            base.Disconnect(serverInitiated, technicalReason);
            messenger.Close();
        }

        internal override void SendDataPacket(EngineIOPacket packet)
        {
            messenger.SendData(packet);
        }

        internal override void SendDataPackets(EngineIOPacket[] packets)
        {
            if (packets == null) return;
            messenger.SendData(packets);
        }

        internal override void SendTechnicalPacket(EngineIOPacket packet)
        {
            messenger.SendTechnicalPacket(packet);
        }

        internal override void ClearQueue()
        {
            base.ClearQueue();
            messenger.ClearQueue();
        }

        internal override int GetQueueLength()
        {
            return messenger.GetQueueLength();
        }

#else
        internal WebGLImplementation(string pDefaultPath) : base(pDefaultPath)
        {
            throw new NotImplementedException("The app has been compiled for Native targets so the WebGL implementation is not included.");
        }
#endif

    }
}
