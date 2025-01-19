using Firesplash.GameDevAssets.SocketIOPlus.EngineIO;
using System;

namespace Firesplash.GameDevAssets.SocketIOPlus
{
    /// <summary>
    /// This is a skeleton class for writing Socket.IO / Engine.IO transcoders
    /// </summary>
    public class Parser
    {
        /// <summary>
        /// This creates a Socket.IO packet from the string types Engine.IO message
        /// Binary payloads can then be added to the package.
        /// </summary>
        /// <param name="eioPacket">The Engine.IO packet to parse</param>
        /// /// <param name="client">A reference to the Scoket.IO client</param>
        /// <returns>A Socket.IO packet instance</returns>
        public virtual SocketIOPacket Parse(EngineIOPacket eioPacket, SocketIOClient client)
        {
            throw new NotImplementedException("The selected parser does not implement this method. (Hint: Do not call base.Parse(...) in overrides)");
        }

        /// <summary>
        /// This should encode the SIOPacket into an array of EngineIO packets to be sent.
        /// </summary>
        /// <param name="packet">The Scoket.IO Packet to encode</param>
        /// <param name="client">A reference to the Scoket.IO client</param>
        /// <returns>An array of Engine.IO packets to be sent in order</returns>
        internal virtual EngineIOPacket[] Encode(SocketIOPacket packet, SocketIOClient client)
        {
            throw new NotImplementedException("The selected parser does not implement this method. (Hint: Do not call base.Encode(...) in overrides)");
        }
    }
}
