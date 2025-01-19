using Firesplash.GameDevAssets.SocketIOPlus.Internal;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using static Firesplash.GameDevAssets.SocketIOPlus.DataTypes;

namespace Firesplash.GameDevAssets.SocketIOPlus
{
    public class SocketIOEvent
    {
        public PacketType type { get; protected private set; }

        /// <summary>
        /// Contians a reference to the SocketIONamespace this packet was received on.
        /// It is null on Packets generated locally for sending.
        /// </summary>
        public SocketIONamespace Namespace;
        public string namespacePath
        {
            get
            {
                if (Namespace == null) return "";
                return Namespace.namespacePath;
            }
        }
        public int acknowledgementID { get; protected private set; } = -1;

        /// <summary>
        /// If this is an INCOMING acknowledgement, this action triggers sending the acknowledgement.
        /// Invoke it using callback.Invoke(payload) where the payload follows the same rules as for an emit.
        /// If this Packet is not an incoming acknowledgement, the callback is null.
        /// </summary>
        public Action<object[]> callback
        {
            get
            {
                if (acknowledgementID > -1)
                {
                    return new Action<object[]>((payloads) =>
                    {
                        Namespace.SendAcknowledgementResponse(acknowledgementID, payloads);
                    });
                }
                return null;
            }
        }

        /// <summary>
        /// The payloads of this event.
        /// Every payload is eighter a byte[] (for binary payloads) or a JToken - which can be a JValue, JObject or JArray
        /// IT is recommended to access the paloadsy using GetPayload(...)
        /// </summary>
        public List<object> payloads { get; protected private set; }

        /// <summary>
        /// Returns the payload at a specific position.
        /// The payload is checked and only returned, when it exists and the type is valid (castable).
        /// You can decide the behaviour, if the actual payload does not match the type.
        /// This method should work for most Object and Array types as well as binary (byte[]). It might not work for some enumerables. You can always directly access the payloads field.
        /// </summary>
        /// <typeparam name="T">The type of the payload</typeparam>
        /// <param name="position">The position of the payload (zero-based)</param>
        /// <param name="throwOnError">If true or unset, an exception will be thrown if the payload does not exist or does not match the type. If false, the method returns the type's default and a warning is logged instead.</param>
        /// <returns>The payload casted into the requested type</returns>
        /// <exception cref="IndexOutOfRangeException">Throws IndexOutOfRangeException if throwOnError is true and the event does not contain a payload at the specified position</exception>
        /// <exception cref="InvalidCastException">Throws InvalidCastException if throwOnError is true and the requested payload is of an incompatible type</exception>
        /// <exception cref="JsonException">Throws InvalidCastException if throwOnError is true and and the requested payload could not be deserialized by Json.Net</exception>
        public T GetPayload<T>(int position, bool throwOnError = true)
        {
            if (payloads.Count < position + 1)
            {
                if (throwOnError) throw new IndexOutOfRangeException("Tried to receive payload of " + eventName + "  at (zero-based) position " + position + " but the event had only " + payloads.Count + " payloads");
                else SIODispatcher.Instance?.LogWarning("Out Of Range: Tried to receive payload of " + eventName + "  at (zero-based) position " + position + " but the event had only " + payloads.Count + " payloads");
                return default;
            }

            //This can actually only happen for byte[] AND only when the packet is incomplete
            if (payloads[position] == null)
            {
                return default;
            }

            try
            {
                Type payloadType = payloads[position].GetType();
                if (typeof(T) == typeof(byte[]))
                {
                    if (payloads[position].GetType() == typeof(byte[])) return (T)payloads[position];
                    else
                    {
                        throw new InvalidCastException("The requested payload is of type " + payloads[position].GetType().Name + " but has been tried to handle as binary (byte[])");
                    }
                }
                else if (payloadType.Equals(typeof(JToken)) || payloadType.IsSubclassOf(typeof(JToken)))
                {
                    JToken value = (JToken)payloads[position];
                    return value.ToObject<T>();
                }
                else
                {
                    return (T)payloads[position];
                }
            }
            catch (Exception e)
            {
                if (throwOnError)
                {
                    if  (e.GetType() == typeof(InvalidCastException)) 
                    {
                        throw new InvalidCastException(e.GetType().Name + ": Could not convert payload of " + eventName + " at position " + position + " from " + (payloads.Count >= position + 1 ? payloads[position].GetType().FullName : "null") + " to " + typeof(T).FullName + ": " + e.Message, e);
                    } 
                    else if  (e.GetType() == typeof(JsonException)) 
                    {
                        throw new JsonException(e.GetType().Name + ": Could not deserialize payload of " + eventName + " at position " + position + " as " + typeof(T).Name + ": " + e.Message, e);
                    } 
                    else
                    {
                        //This is an unexpected exception
                        throw e;
                    }
                }
                else SIODispatcher.Instance?.LogWarning(e.GetType().Name + ": Could not convert payload of " + eventName + " at position " + position + " into " + typeof(T).Name + ": " + e.Message);
            }

            return default;
        }


        /// <summary>
        /// The event name, this event was received under
        /// </summary>
        public string eventName;

        /// <summary>
        /// Returns the number of payloads in this packet.
        /// Only valid for messages.
        /// </summary>
        public int Length
        {
            get
            {
                if (payloads == null) return 0;
                return payloads.Count;
            }
        }

        internal SocketIOEvent(string eventName, List<object> payloads)
        {
            this.eventName = eventName;
            this.payloads = payloads;
        }

        internal SocketIOEvent(string eventName, PacketType type, List<object> payloads)
        {
            this.eventName = eventName;
            this.payloads = payloads;
            this.type = type;
        }
    }
}
