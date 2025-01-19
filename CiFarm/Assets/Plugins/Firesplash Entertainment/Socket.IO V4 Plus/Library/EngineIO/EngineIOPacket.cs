using static Firesplash.GameDevAssets.SocketIOPlus.EngineIO.DataTypes;
using System.Text;
using System;

namespace Firesplash.GameDevAssets.SocketIOPlus.EngineIO
{
    /// <summary>
    /// Class used to create a packet to be sent via WebSocket to a server using the Engine.IO protocol
    /// </summary>
    public class EngineIOPacket
    {
        private byte[] messagePayloadBytes = null;
        private string messagePayloadString = null;
        private EIOPacketType packetType;

        private EngineIOPacket(EIOPacketType type, byte[] payloadBytes)
        {
            packetType = type;
            messagePayloadBytes = payloadBytes;
        }

        private EngineIOPacket(EIOPacketType type, string payloadString)
        {
            packetType = type;
            messagePayloadString = payloadString;
        }

        internal EngineIOPacket(EIOPacketType type)
        {
            if (type == EIOPacketType.Message) throw new InvalidOperationException("Can not create an Engine.IO message packet using this constructor overload");
            messagePayloadString = "";
            packetType = type;
        }

        /// <summary>
        /// Creates a packet for a string-typed MESSAGE
        /// This can not be used to parse an incoming message!
        /// </summary>
        /// <param name="message">The message</param>
        public EngineIOPacket(string messagePayload)
        {
            packetType = EIOPacketType.Message;
            messagePayloadString = messagePayload;
        }

        /// <summary>
        /// Creates a packet for a binary-typed MESSAGE
        /// This can not be used to parse an incoming message!
        /// </summary>
        /// <param name="message">The message</param>
        public EngineIOPacket(byte[] messagePayload)
        {
            packetType = EIOPacketType.Message;
            messagePayloadBytes = messagePayload;
        }

        /// <summary>
        /// Used to parse a received byte array from the transport into an Engine.IO packet
        /// </summary>
        /// <param name="isBinaryMessage">Set this true, if the message was received as binary message. Otherwise false.</param>
        /// <param name="webSocketMessageBytes">The received byte array</param>
        /// <returns>The parsed package instance</returns>
        public static EngineIOPacket Parse(bool isBinaryMessage, byte[] webSocketMessageBytes)
        {
            if (isBinaryMessage)
            {
                return new EngineIOPacket(EIOPacketType.Message, webSocketMessageBytes);
            }
            else
            {
                string data = Encoding.UTF8.GetString(webSocketMessageBytes).TrimEnd('\0');
                string payload = (data.Length > 1 ? data.Substring(1) : "");
                EIOPacketType type = (EIOPacketType)int.Parse(data.Substring(0, 1));
                return new EngineIOPacket(type, payload);
            }
        }

        internal string GetPacketStringForTransmission()
        {
            if (IsBinaryMessage()) throw new InvalidOperationException("Can not implicitly create a string representation of a binary packet for security reasons.");
            return (int)packetType + messagePayloadString;
        }

        internal byte[] GetPacketBytesForTransmission()
        {
            if (messagePayloadBytes != null && packetType == EIOPacketType.Message) return messagePayloadBytes;
            else return Encoding.UTF8.GetBytes((int)packetType + messagePayloadString);
        }

        public bool IsBinaryMessage()
        {
            return messagePayloadBytes != null;
        }

        public EIOPacketType GetPacketType()
        {
            return packetType;
        }

        public byte[] GetPayloadBytes()
        {
            if (messagePayloadBytes == null) throw new InvalidOperationException("Can not implicitly receive payload bytes from a string typed Engine.IO packet.");
            return messagePayloadBytes;
        }

        public string GetPayloadString()
        {
            if (messagePayloadString == null) throw new InvalidOperationException("Can not implicitly receive string payload from a binary Engine.IO packet for security reasons. Read GetPayloadBytes() and decode it yourself if confident.");
            return messagePayloadString;
        }
    }
}
