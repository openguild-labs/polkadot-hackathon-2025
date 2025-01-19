using Firesplash.GameDevAssets.SocketIOPlus.Internal;
using System.Collections.Generic;
using static Firesplash.GameDevAssets.SocketIOPlus.DataTypes;

namespace Firesplash.GameDevAssets.SocketIOPlus
{
    /// <summary>
    /// This class represents a lowlevel SocketIO packet in its parsed state.
    /// </summary>
    public class SocketIOPacket : SocketIOEvent
    {
        private List<int> missingBinPayloadPositions;
        private List<int> filledBinPayloadPositions;

        /// <summary>
        /// Returns a list of all binary payload positions.
        /// </summary>
        /// <returns>null if none</returns>
        internal List<int> GetBinaryPayloadPositions()
        {
            if (payloads == null || payloads.Count == 0) return null;

            if (filledBinPayloadPositions == null)
            {
                filledBinPayloadPositions = new List<int>();
                for (int i = 0; i < payloads.Count; i++)
                {
                    if (payloads[i].GetType() == typeof(byte[]))
                    {
                        filledBinPayloadPositions.Add(i);
                    }
                }
            }

            return filledBinPayloadPositions.Count > 0 ? filledBinPayloadPositions : null;
        }

        internal SocketIOPacket(PacketType pType, List<object> pPayloads, List<int> pBinPayloadPositions, int pAckID, string pEventName, SocketIONamespace pSIONamespace) : base(pEventName, pPayloads)
        {
            type = pType;
            payloads = pPayloads;
            missingBinPayloadPositions = pBinPayloadPositions;
            acknowledgementID = pAckID;
            eventName = pEventName;
            Namespace = pSIONamespace;
        }

        internal static SocketIOPacket CreateEventPacket(SocketIONamespace pSIONamespace, object[] pPayloads, string pEventName, int pAcknowledgementID = -1, bool isAcknowledgementResponse = false)
        {
            PacketType t = (isAcknowledgementResponse ? PacketType.ACK : PacketType.EVENT);

            if (pPayloads != null)
            {
                foreach (object p in pPayloads)
                {
                    if (p.GetType() == typeof(byte[]))
                    {
                        t = (isAcknowledgementResponse ? PacketType.BINARY_ACK : PacketType.BINARY_EVENT);
                        break;
                    }
                }
            }

            return new SocketIOPacket(t, (pPayloads == null ? null : new List<object>(pPayloads)), null, pAcknowledgementID, pEventName, pSIONamespace);
        }

        internal void SetNamespace(SocketIONamespace ns)
        {
            Namespace = ns;
        }

        /// <summary>
        /// Adds a payload to the SIO Packet's payload list
        /// </summary>
        /// <param name="eioPacket"></param>
        internal void AddReceivedBinaryPayload(byte[] payload)
        {
            if (missingBinPayloadPositions != null && missingBinPayloadPositions.Count > 0)
            {
                int pos = missingBinPayloadPositions[0];
                missingBinPayloadPositions.RemoveAt(0);
                payloads[pos] = payload;
            } 
            else
            {
                SIODispatcher.Instance?.LogWarning("You tried to assign a binary payload to a packet that has no binary payload slots.");
            }
        }

        internal bool IsComplete()
        {
            return missingBinPayloadPositions == null || missingBinPayloadPositions.Count == 0;
        }
    }
}
