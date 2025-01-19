using Newtonsoft.Json.Linq;
using System;

namespace Firesplash.GameDevAssets.SocketIOPlus
{
    /// <summary>
    /// Contains simple DataTypes used for Socket.IO communication and states
    /// </summary>
    public static class DataTypes
    {
        public enum ConnectionState
        {
            NONE,
            CONNECTING,
            CONNECTED,
            DISCONNECTED
        }

        public enum PacketType
        {
            CONNECT = 0,
            DISCONNECT = 1,
            EVENT = 2,
            ACK = 3,
            CONNECT_ERROR = 4,
            BINARY_EVENT = 5,
            BINARY_ACK = 6
        }

        /// <summary>
        /// This is the base class all Socket.IO-Exceptions derive from
        /// </summary>
        public class SocketIOException : Exception {
            public SocketIOException(string message) : base(message) { }
        }

        /// <summary>
        /// This exception is thrown, when the application is trying to violate a protocol constraint.
        /// There are only rare possibilities to do so, though.
        /// This exception is NOT thrown for incoming packages!
        /// </summary>
        public class SocketIOProtocolViolationException : SocketIOException {
            public SocketIOProtocolViolationException(string message) : base(message) { }
        }

        /// <summary>
        /// This delegate gets called when a Socket.IO namespace is being connected.
        /// Your function must return null if not auht payload is required for the namespace,
        /// or an object that can be serialized by Json.Net if a payload must be provided
        /// </summary>
        /// <param name="namespacePath">The Socket.IO namespace path (e.g. "/") for which authentication data is requested</param>
        public delegate object SocketIOAuthPayloadCallback(string namespacePath);

        /// <summary>
        /// This delegate gets called when a Socket.IO packet comes in on the transport. It is not invoked for internally generated events!
        /// A Packet is not the same as an Event! It could for example be a CONNECT-Packet.
        /// </summary>
        /// <param name="packet"></param>
        internal delegate void SocketIOPacketReceivedEvent(SocketIOPacket packet);

        /// <summary>
        /// This delegate gets called on a namespace for any Socket.IO event (received or internally generated).
        /// The delegate is invoked from a Thread so it is not safe to access Unity functions from it.
        /// </summary>
        /// <param name="sioEvent"></param>
        public delegate void ThreadedSocketIOEvent(SocketIOEvent sioEvent);

        /// <summary>
        /// A Payload template to mimic JS "Error" events. Error messages are contained in the "message" property
        /// </summary>
        [Serializable]
        public class SocketIOErrorPayload
        {
            public string message;

            /// <summary>
            /// Creates a payload template to mimic JS "Error" events
            /// </summary>
            /// <param name = "message" > The message contained in the object</param>
            public SocketIOErrorPayload(string message)
            {
                this.message = message;
            }
        }
    }
}
