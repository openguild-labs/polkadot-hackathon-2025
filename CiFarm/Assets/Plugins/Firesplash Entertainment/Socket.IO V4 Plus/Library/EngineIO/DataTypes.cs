using System;

namespace Firesplash.GameDevAssets.SocketIOPlus.EngineIO
{
    public static class DataTypes
    {
        public enum EIOPacketType { Open = 0, Close = 1, Ping = 2, Pong = 3, Message = 4 }; //limited to our required types

        //We replicate the state enum of c#'s Websocket states to not require the reference in WebGL mode
        public enum ConnectionState { None = 0, Connecting = 1, Open = 2, CloseSent = 3, CloseReceived = 4, Closed = 5, Aborted = 6, Handshake = 255 }

        /// <summary>
        /// The event raised, when a message is received by the client
        /// This event is fired from a thread. You may not access Unity Engine functions directly from the callback.
        /// </summary>
        /// <param name="packet">The received packet</param>
        public delegate void EngineIOMessageReceivedEvent(EngineIOPacket packet);

        /// <summary>
        /// This event fires, when the connection is established and ready to be used
        /// This event is fired from a thread. You may not access Unity Engine functions directly from the callback.
        /// </summary>
        /// <param name="connectionParams"></param>
        public delegate void EngineIOConnectionReadyEvent(ConnectionParameters connectionParams);

        /// <summary>
        /// This event fires when the connection gets disconnected
        /// </summary>
        /// <param name="serverInitiated">true, if the server intentionally disconnected us</param>
        /// <param name="reason">A textual reason</param>
        public delegate void EngineIODisconnectEvent(bool serverInitiated, string reason);

        /// <summary>
        /// This event fires when the connection throws an error
        /// </summary>
        /// <param name="errorMessage">The exception causing this callback</param>
        public delegate void EngineIOConnectErrorEvent(Exception e);

        [Serializable]
        public struct ConnectionParameters
        {
            public string sid;
            public int pingInterval;
            public int pingTimeout;
            
            //We don't use this: public int maxPayload;
        }
    }
}
