using Firesplash.GameDevAssets.SocketIOPlus.Internal;
using Newtonsoft.Json;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Text;
using static Firesplash.GameDevAssets.SocketIOPlus.EngineIO.DataTypes;

namespace Firesplash.GameDevAssets.SocketIOPlus.EngineIO
{
    internal class Tranceiver
    {
        internal Uri connectionTarget { get; private set; }

        internal virtual ConnectionState State { get; private set; }

        private protected string defaultPath = "/engine.io/";

        private protected bool handshakeCompleted = false;

        internal object queueLock;

        /// <summary>
        /// This fires for any message packets AND PING
        /// </summary>
        internal EngineIOMessageReceivedEvent OnDataReceived;

        internal EngineIOConnectionReadyEvent OnConnectionReady;

        internal EngineIODisconnectEvent OnDisconnect;

        internal EngineIOConnectErrorEvent OnError;

        private protected LinkedList<EngineIOPacket[]> sendQueue;

        private protected ConcurrentQueue<EngineIOPacket> technicalQueue;

        internal ConnectionParameters connectionParams;

        protected bool isClosingCleanly = false; //this is only actually used by WebGL implementation but we need to set it when parsing EIO packets
        
        protected bool isOperatingInVolatileMode = true;


        public Tranceiver(string pDefaultPath) {
            connectionTarget = null;
            defaultPath = pDefaultPath;
            queueLock = new object();
            sendQueue = new LinkedList<EngineIOPacket[]>();
            technicalQueue = new ConcurrentQueue<EngineIOPacket>();
        }

        ~Tranceiver()
        {
            Disconnect(false, "client closed");
        }

        internal virtual void ClearQueue()
        {
            lock (queueLock)
            {
                sendQueue.Clear();
            }
        }

        internal virtual int GetQueueLength()
        {
            lock (queueLock)
            {
                return sendQueue.Count;
            }
        }

        internal virtual void ConnectX(string serverAddress)
        {
            Connect(serverAddress, isOperatingInVolatileMode);
        }

        internal virtual void Connect(string serverAddress, bool volatileMode) {
            isOperatingInVolatileMode = volatileMode;
            isClosingCleanly = false;

            //This code will called BEFORE the actual connect happens (base.Connect() is first line)
            UriBuilder uri = new UriBuilder(serverAddress);

            //switch to websocket protocols
            if (uri.Scheme.StartsWith("http"))
            {
                uri.Scheme = "ws" + uri.Scheme.Substring(4);
            }

            //Add engine.io path if none specified
            if (!serverAddress.Substring(serverAddress.IndexOf("//") + 2).Contains('/'))
            {
                uri.Path = defaultPath;
            }

            //Add required query parameters
            handshakeCompleted = false;

            NameValueCollection queryDictionary = new NameValueCollection();
            if (uri.Query != null && !uri.Query.Equals(""))
            {
                string[] strParts = uri.Query.Remove(0, 1).Split("&");
                string[] parNV;
                foreach (string par in strParts)
                {
                    parNV = par.Split("=");
                    queryDictionary[parNV[0]] = (parNV.Length > 1 ? parNV[1] : "");
                }
            }
            queryDictionary["EIO"] = "4";
            queryDictionary["transport"] = "websocket";
            queryDictionary.Remove("sid"); //just in case

            //Build the new query string
            StringBuilder queryStr = new StringBuilder();
            foreach (string parName in queryDictionary)
            {
                if (queryStr.Length > 0) queryStr.Append("&");
                queryStr.Append(Uri.EscapeDataString(parName) + "=" + Uri.EscapeDataString(queryDictionary[parName]));
            }

            uri.Query = queryStr.ToString();

            //Store new URI
            connectionTarget = uri.Uri;

            if (isOperatingInVolatileMode) ClearQueue();
        }

        /// <summary>
        /// disconnects the tranceiver.
        /// </summary>
        /// <param name="technicalReason"></param>
        internal virtual void Disconnect(bool serverInitiated, string technicalReason = null) {
            OnDisconnect?.Invoke(serverInitiated, (technicalReason != null ? technicalReason : "io client disconnect"));
        }

        internal void ReceiveMessage(EngineIOPacket packet)
        {
            try
            {
                switch (packet.GetPacketType())
                {
                    case EIOPacketType.Open:
                        isClosingCleanly = false; //this is a good point to reset the flag
                        connectionParams = JsonConvert.DeserializeObject<ConnectionParameters>(packet.GetPayloadString());
                        handshakeCompleted = true;
#if UNITY_WEBGL
                        State = ConnectionState.Open; //We set this here as in WebGL we might encounter unordered messages from the websocket JSLib layer which might cause a namespace connect error
#endif
                        if (OnConnectionReady != null) OnConnectionReady.Invoke(connectionParams);
                        break;

                    case EIOPacketType.Close:
                        Log("Received CLOSE from server");
                        isClosingCleanly = true;
                        OnDisconnect?.Invoke(true, "io server disconnect");
                        break;

                    case EIOPacketType.Ping:
                        SendTechnicalPacket(new EngineIOPacket(EIOPacketType.Pong));
                        if (OnDataReceived != null) OnDataReceived.Invoke(packet);
                        break;

                    case EIOPacketType.Message:
                        if (OnDataReceived != null) OnDataReceived.Invoke(packet);
                        break;
                }
            }
            catch (Exception e)
            {
                SIODispatcher.Instance?.LogException(e);
            }

        }

        internal virtual void SendDataPacket(EngineIOPacket packet)
        {
            SendDataPackets(new EngineIOPacket[]  { packet });
        }

        /// <summary>
        /// This sends a multi-packet message. This should NOT be used to send multiple messages at once!
        /// </summary>
        /// <param name="packets"></param>
        internal virtual void SendDataPackets(EngineIOPacket[] packets)
        {
            if (packets == null) return;
            lock(queueLock)
            {
                sendQueue.AddLast(packets);
            }
        }

        /// <summary>
        /// This sends a multi-packet message. This should NOT be used to send multiple messages at once!
        /// </summary>
        /// <param name="packets"></param>
        internal virtual void SendTechnicalPacket(EngineIOPacket packet)
        {
            if (packet == null) return;
            technicalQueue.Enqueue(packet);
        }

        internal void Log(string message)
        {
#if VERBOSE
            SIODispatcher.Instance?.Log("[EngineIO] " + message);
#endif
        }

        internal void LogException(Exception e)
        {
            SIODispatcher.Instance?.LogException(e);
        }

        internal void LogError(string message)
        {
            SIODispatcher.Instance?.LogError("[EngineIO] " + message);
        }
    }
}
