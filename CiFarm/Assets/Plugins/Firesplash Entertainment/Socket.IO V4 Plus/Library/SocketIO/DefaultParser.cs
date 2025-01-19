using Firesplash.GameDevAssets.SocketIOPlus.EngineIO;
using Firesplash.GameDevAssets.SocketIOPlus.Internal;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Text;
using static Firesplash.GameDevAssets.SocketIOPlus.DataTypes;

namespace Firesplash.GameDevAssets.SocketIOPlus
{
    /// <summary>
    /// This implemented the default Socket.IO parser to parse string typed EngineIO messages into Socket.IO and encode packets vice versa.
    /// </summary>
    public class DefaultParser : Parser
    {
        /// <summary>
        /// This creates a Socket.IO packet from the string types Engine.IO message
        /// Binary payloads can then be added to the package.
        /// </summary>
        /// <param name="eioMessagePayload"></param>
        /// <returns></returns>
        public override SocketIOPacket Parse(EngineIOPacket eioPacket, SocketIOClient client)
        {
            //<packet type>[<# of binary attachments>-][<namespace>,][<acknowledgment id>][JSON-stringified payload without binary]

            int parseStart = 1;
            string payloadString = eioPacket.GetPayloadString();
            char[] chars = payloadString.ToCharArray();

            //Read the packet type
            PacketType type = (PacketType)int.Parse(chars[0].ToString()); //TODO optimize

            //Get binary attachment count
            int binPayloadCount = 0;
            if (type == PacketType.BINARY_EVENT || type == PacketType.BINARY_ACK)
            {
                int segmentLen = payloadString.IndexOf('-') - parseStart;
                if (segmentLen <= 0) return null; //invalid packet

                binPayloadCount = int.Parse(payloadString.Substring(parseStart, segmentLen));
                parseStart += segmentLen + 1;
            }

            //Lookup the namespace if present
            string ns = "/";
            if (payloadString.Length > parseStart && chars[parseStart] == '/')
            {
                int segmentLen = payloadString.IndexOf(',') - parseStart;

                ns = payloadString.Substring(parseStart, segmentLen);

                parseStart += segmentLen + 1;
            }

            //Only continue parsing if we have more data
            string eventName = null;
            int ackID = 0;
            List<object> dataPayload = null;
            List<int> binPayloadPositions = null;
            if (payloadString.Length > parseStart)
            {
                //Find out the first char of the payload
                char payloadStart = (type == PacketType.BINARY_EVENT || type == PacketType.BINARY_ACK || type == PacketType.EVENT || type == PacketType.ACK) ? '[' : '{';

                //Parse the Acknowledgement ID of the packet
                if (chars[parseStart] != payloadStart)
                {
                    int segmentLen = payloadString.IndexOf(payloadStart) - parseStart;

                    ackID = int.Parse(payloadString.Substring(parseStart, segmentLen));

                    parseStart += segmentLen;
                }

                //Parse the data payload
                if (payloadString.Length > parseStart && chars[parseStart] == payloadStart)
                {
                    dataPayload = new List<object>();
                    string json = payloadString.Substring(parseStart);

                    //Events and ACKs have a JSON array as payload,...
                    if (type == PacketType.BINARY_EVENT || type == PacketType.BINARY_ACK || type == PacketType.EVENT || type == PacketType.ACK)
                    {
                        JArray jsonPayloads = JArray.Parse(json);
                        binPayloadPositions = new List<int>();

                        JToken p;
                        int plPos = 0;
                        for (int i = 0; i < jsonPayloads.Count; i++)
                        {
                            p = jsonPayloads[i];

                            if (i == 0 && type != PacketType.ACK && type != PacketType.BINARY_ACK)
                            {
                                eventName = p.Value<string>();
                                continue;
                            }

                            try
                            {
                                if (p.Type == JTokenType.Object && ((JObject)p).Value<bool>("_placeholder") && ((JObject)p).Value<int>("num") <= binPayloadCount)
                                {
                                    dataPayload.Add(null);
                                    binPayloadPositions.Add(plPos);
                                }
                                else
                                {
                                    dataPayload.Add(p);
                                }
                            }
                            catch (JsonException)
                            {
                                //if anything goes wrong it might be strange data so we add it to the payload list as it is
                                dataPayload.Add(p);
                            }

                            plPos++;
                        }
                    }
                    //...while other messages got an object instead (or no payload at all)
                    else
                    {
                        JObject jsonPayload = JObject.Parse(json);
                        dataPayload.Add(jsonPayload);
                    }
                }
            }

            SocketIOPacket s = new SocketIOPacket(type, dataPayload, binPayloadPositions, ackID, eventName, null);
            s.SetNamespace(client.GetNamespace(ns, false));
            return s;
        }



        /// <summary>
        /// This will encode the SIOPacket into an array of EngineIO packets to be sent.
        /// </summary>
        /// <param name="packet"></param>
        /// <returns></returns>
        internal override EngineIOPacket[] Encode(SocketIOPacket packet, SocketIOClient client)
        {
            if (packet == null)
            {
                SIODispatcher.Instance?.LogError("[Socket.IO] Tried to encode a null packet using DefaultParser. This is not possible.");
            }

            //<packet type>[<# of binary attachments>-][<namespace>,][<acknowledgment id>][JSON-stringified payload without binary]

            List<EngineIOPacket> packetList = new List<EngineIOPacket>();
            StringBuilder stringPacket = new StringBuilder();

            //Start with packet type
            stringPacket.Append((int)packet.type);

            //Add number of binary payloads if applicable
            if (packet.GetBinaryPayloadPositions() != null)
            {
                stringPacket.Append(packet.GetBinaryPayloadPositions().Count);
                stringPacket.Append('-');
            }

            //Add namespace if not default
            //TODO check if this still works with new namspace assignment
            if (packet.namespacePath != "/")
            {
                stringPacket.Append(packet.namespacePath);
                stringPacket.Append(',');
            }

            //Add Acknowledgement ID if not default
            if (packet.acknowledgementID > -1)
            {
                stringPacket.Append(packet.acknowledgementID);
            }

            //Add json encoded payload
            List<byte[]> binaryPayloads = new List<byte[]>();

            if (packet.type == PacketType.CONNECT && packet.payloads != null && packet.payloads.Count >= 1)
            {
                stringPacket.Append(JsonConvert.SerializeObject(packet.payloads[0]));
            }
            else if (packet.type != PacketType.CONNECT)
            {
                JArray payload = new JArray();
                if (packet.eventName != null && packet.type != PacketType.ACK && packet.type != PacketType.BINARY_ACK) payload.AddFirst(packet.eventName);

                if (packet.payloads != null && packet.payloads.Count > 0)
                {
                    //compute the payload
                    for (int i = 0; i < packet.payloads.Count; i++)
                    {
                        if (packet.payloads[i].GetType() == typeof(byte[]))
                        {
                            //Binary
                            JObject placeholder = new JObject();
                            placeholder.Add("_placeholder", true);
                            placeholder.Add("num", binaryPayloads.Count);
                            payload.Add(placeholder);
                            binaryPayloads.Add((byte[])packet.payloads[i]);
                        }
                        else
                        {
                            //Json serializable (should be)
                            try
                            {
                                payload.Add(JToken.FromObject(packet.payloads[i]));
                            }
                            catch (Exception e)
                            {
                                SIODispatcher.Instance?.LogError("[Socket.IO] You tried to add an unserializable payload to " + packet.type.ToString() + " packet " + packet.eventName + " - It will be omitted and a dummy string will be inserted instead. (" + e.ToString() + ")");
                                payload.Add("_UNSERIALIZABLE_OBJECT_" + packet.payloads[i].GetType().Name + "_");
                            }
                        }
                    }
                }

                //Serialize the payloads into the packet string
                stringPacket.Append(JsonConvert.SerializeObject(payload));
            }

            EngineIOPacket sp = new EngineIOPacket(stringPacket.ToString());
            packetList.Add(sp);

            for (int i = 0; i < binaryPayloads.Count; i++)
            {
                packetList.Add(new EngineIOPacket(binaryPayloads[i]));
            }


            return packetList.ToArray();
        }

    }
}
