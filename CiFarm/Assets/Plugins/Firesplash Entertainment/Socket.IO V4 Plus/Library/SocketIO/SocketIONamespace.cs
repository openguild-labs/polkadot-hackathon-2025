using Firesplash.GameDevAssets.SocketIOPlus.EngineIO;
using Firesplash.GameDevAssets.SocketIOPlus.Internal;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using UnityEngine.Events;
using static Firesplash.GameDevAssets.SocketIOPlus.DataTypes;

namespace Firesplash.GameDevAssets.SocketIOPlus
{
    /// <summary>
    /// This class represents a (usually connected) Socket.IO namespace and implements the EventEmitter and the EventReceiver.
    /// We try to keep our API as near to the official Socket.IO V4 API as possible within this class.
    /// <seealso cref="https://socket.io/docs/v4/emitting-events/"/>
    /// <seealso cref="https://socket.io/docs/v4/listening-to-events/#eventemitter-methods"/>
    /// </summary>
    public class SocketIONamespace
    {
        public string namespacePath { get; private set; }
        internal bool shallConnect = true;
        internal SocketIOClient client;

        public string socketID { get; private set; }
        public ConnectionState state { get; private set; } = ConnectionState.NONE;

        Dictionary<string, UnityEvent<SocketIOEvent>> registeredUnityEventHandlers;
        UnityEvent<SocketIOEvent> registeredCatchallUnityEventHandlers;
        Dictionary<string, List<UnityAction<SocketIOEvent>>> registeredOnceUnityActions;

        Dictionary<int, UnityAction<object[]>> pendingAcknowledgements;
        int nextAcknowledgementID = 0;

        /// <summary>
        /// This event allows you to receive any Socket IO event (received or internally generated) without additional delay.
        /// This callback is executed in a Thread so you may not directly access unity engine functions from it!
        /// When timing is not critical, you should use the "On" method instead to register a thread safe, dispatched callback.
        /// </summary>
        public ThreadedSocketIOEvent OnSocketIOEventThreaded;

        internal SocketIONamespace(string pNamespacePath, SocketIOClient pSocketIOClient)
        {
            client = pSocketIOClient;
            namespacePath = pNamespacePath;
            registeredUnityEventHandlers = new Dictionary<string, UnityEvent<SocketIOEvent>>();
            registeredCatchallUnityEventHandlers = new UnityEvent<SocketIOEvent>();
            registeredOnceUnityActions = new Dictionary<string, List<UnityAction<SocketIOEvent>>>();
            pendingAcknowledgements = new Dictionary<int, UnityAction<object[]>>();
        }

        /// <summary>
        /// This is a temporary workaround for a bug where namespaces are not reconnected correctly.
        /// Call this method before a reconnect to override the reconnect logic.
        /// </summary>
        public void BugWorkaroundForReconnect()
        {
            shallConnect = true;
        }

        /// <summary>
        /// A namesapce will automatically connect unless it has manually been disconnected by calling "Disconnect()" on it.
        /// A manually disconnected namespace can be reconnected by calling this method.
        /// </summary>
        public void Connect()
        {
            if (this.namespacePath == "/") throw new InvalidOperationException("You can not manually connect the Default Namespace as it must always be connected");
            shallConnect = true;
            state = ConnectionState.CONNECTING;
            client.ConnectNamespace(this.namespacePath);
        }

        internal void Connect(object authPayload)
        {
            if (client.State != EngineIO.DataTypes.ConnectionState.Open) throw new InvalidOperationException("You can not connect a namespace without being connected to the server. Call (and wait for) Connect on the SocketIOClient first.");
            shallConnect = true;
            state = ConnectionState.CONNECTING;
            List<object> authPayloadList = null;
            if (authPayload != null)
            {
                authPayloadList = new List<object>();
                authPayloadList.Add(authPayload);
            }
            client.SendTechnical(new SocketIOPacket(PacketType.CONNECT, authPayloadList, null, 0, null, this));
        }

        /// <summary>
        /// Calling this method will disconnect the namespace and disable reconnecting to it. To reconnect, you must manually call "Connect()" on it.
        /// </summary>
        public void Disconnect()
        {
            if (this.namespacePath == "/") throw new InvalidOperationException("You can not manually disconnect the Default Namespace as it must always be connected");
            state = ConnectionState.DISCONNECTED;
            FireEvent("disconnect", new object[] { "io client disconnect" });
            shallConnect = false;
            client.SendEngineIOTechnicalPacket(client.GetParser().Encode(new SocketIOPacket(PacketType.DISCONNECT, null, null, -1, null, this), client)[0]);
        }

        internal void Disconnect(bool serverInitiated, string message)
        {
            SIODispatcher.Instance?.Log("Namespace Disconnect serverInitiated=" + serverInitiated + ", message=" +  message);
            //if (!serverInitiated) shallConnect = false;
            if (state != ConnectionState.DISCONNECTED) FireEvent("disconnect", new object[] { message }); //disconnect could propagate twice under some circumstances in native mode because we're using multiple independent threads
            state = ConnectionState.DISCONNECTED;
        }

        /// <summary>
        /// Used to submit a received (and completed) packet to this namespace
        /// </summary>
        /// <param name="packet"></param>
        internal void Submit(SocketIOPacket packet)
        {
            if (!packet.IsComplete()) throw new InvalidOperationException("Can not submit an incomplete packet to the namespace");

            //https://stackoverflow.com/questions/24224287/list-of-socket-io-events

            packet.SetNamespace(this);

            switch (packet.type)
            {
                case PacketType.CONNECT_ERROR:
                    state = ConnectionState.DISCONNECTED;
                    FireEvent("connect_error", packet.payloads.ToArray());
                    break;

                case PacketType.CONNECT:
                    if (packet.payloads.Count < 1)
                    {
                        //TODO log Error
                        FireEvent("connect_error", new object[] { new SocketIOErrorPayload("Received connect packet without sid payload. This is a server-side protocol violation.") });
                        state = ConnectionState.DISCONNECTED;
                        return;
                    }

                    //Extract socket id
                    socketID = ((JObject)packet.payloads[0]).GetValue("sid").Value<string>();

                    state = ConnectionState.CONNECTED;
                    FireEvent("connect", PacketType.CONNECT, null);
                    break;

                case PacketType.DISCONNECT:
                    state = ConnectionState.DISCONNECTED;
                    FireEvent("disconnect", PacketType.DISCONNECT, new object[] { "io server disconnect" });
                    break;

                case PacketType.ACK:
                case PacketType.BINARY_ACK:
                    UnityAction<object[]> callback;
                    lock (pendingAcknowledgements)
                    {
                        if (pendingAcknowledgements.ContainsKey(packet.acknowledgementID))
                        {
                            callback = pendingAcknowledgements[packet.acknowledgementID];
                            SIODispatcher.Instance?.Enqueue(() => { callback.Invoke(packet.payloads == null ? null : packet.payloads.ToArray()); });
                            pendingAcknowledgements.Remove(packet.acknowledgementID);
                        }
                        else
                        {
                            //We are not awaiting this acknowledgement
                            return;
                        }
                    }
                    break;

                case PacketType.EVENT:
                case PacketType.BINARY_EVENT:
                    FireEvent(packet);
                    break;
            }
        }

        /// <summary>
        /// Fires an event locally
        /// </summary>
        internal void FireEvent(string eventName, object[] payloads)
        {
            SocketIOEvent e = new SocketIOEvent(eventName, (payloads == null ? null : new List<object>(payloads)));
            FireEvent(e);
        }

        /// <summary>
        /// Fires an event locally
        /// </summary>
        internal void FireEvent(string eventName, PacketType type, object[] payloads)
        {
            SocketIOEvent e = new SocketIOEvent(eventName, type, (payloads == null ? null : new List<object>(payloads)));
            FireEvent(e);
        }

        /// <summary>
        /// Fires an event locally
        /// </summary>
        void FireEvent(SocketIOEvent sioEvent)
        {
#if VERBOSE
            SIODispatcher.Instance?.Log("[Socket.IO] Firing Namespaced Event '" + sioEvent.eventName + "' on " + namespacePath);
#endif

            //Threaded dispatch
            if (OnSocketIOEventThreaded != null) OnSocketIOEventThreaded.Invoke(sioEvent);

            //Once-Events are dispatched first and out of band as we might else cause concurrency issues
            if (registeredOnceUnityActions.ContainsKey(sioEvent.eventName))
            {
                UnityAction<SocketIOEvent>[] onceActions = registeredOnceUnityActions[sioEvent.eventName].ToArray();
                registeredOnceUnityActions.Remove(sioEvent.eventName);

                SIODispatcher.Instance?.Enqueue(() =>
                {
                    foreach (UnityAction<SocketIOEvent> a in onceActions)
                    {
                        a.Invoke(sioEvent);
                    }
                });
            }

            //All registered events are emitted "together"
            SIODispatcher.Instance?.Enqueue(() =>
            {
                if (registeredUnityEventHandlers.ContainsKey(sioEvent.eventName))
                {
                    registeredUnityEventHandlers[sioEvent.eventName].Invoke(sioEvent);
                }
                registeredCatchallUnityEventHandlers.Invoke(sioEvent);
            });
        }

        /// <summary>
        /// Emits an event to the server
        /// </summary>
        /// <param name="eventName">The name of the emitted event</param>
        /// <param name="payloads">An optional array of payload objects (Any objects supported by Json.Net OR byte[]). Every array element is transmitted as an individual payload. An array of three strings is the equivalent to JS io.emit("someEvent", "string1", "string2", "string3")</param>
        /// <param name="acknowledgementCallback">An optional callback. If provided, the emit will be an acknowledgement. This requires a payload.</param>
        public void Emit(string eventName, object[] payloads = null, UnityAction<object[]> acknowledgementCallback = null)
        {
            int ackID = 0;
            lock (pendingAcknowledgements)
            {
                if (acknowledgementCallback != null)
                {
                    if (payloads == null)
                    {
                        throw new SocketIOProtocolViolationException("You can not emit an event containing an acknowledgement without providing a payload.");
                    }

                    //raise AckID
                    ackID = nextAcknowledgementID++;
                    if (nextAcknowledgementID > 2147483640) nextAcknowledgementID = 0; //prevents overflows

                    if (pendingAcknowledgements.ContainsKey(ackID)) pendingAcknowledgements.Remove(ackID); //This means the acknowledgement was never received
                    pendingAcknowledgements.Add(ackID, acknowledgementCallback);
                }
            }

            client.SendEngineIOPackets(client.GetParser().Encode(SocketIOPacket.CreateEventPacket(this, payloads, eventName, ackID, false), client));
        }

        /// <summary>
        /// Emits an event to the server that has only one payload (for example a string, byte[] <b>or a - through Json.Net - serializable object</b>)
        /// </summary>
        /// <typeparam name="T">The type of the primitive payload</typeparam>
        /// <param name="eventName">The name of the emitted event</param>
        /// <param name="payload">The payload</param>
        /// <param name="acknowledgementCallback">An optional callback. If provided, the emit will be an acknowledgement. This requires a payload. The callback received an object[] where every elemtn is eighter a byte[] or a JToken depending on what the server sent.</param>
        public void Emit<T>(string eventName, T payload, UnityAction<object[]> acknowledgementCallback = null)
        {
            Emit(eventName, (payload == null ? null : new object[] { payload }), acknowledgementCallback);
        }


        internal void SendAcknowledgementResponse(int ackID, object[] payloads)
        {
            client.SendEngineIOPackets(client.GetParser().Encode(SocketIOPacket.CreateEventPacket(this, payloads, null, ackID, true), client));
        }


        /// <summary>
        /// Registers a callback for a specific event which is only called once and then destroyed.
        /// The callback is dispatched, so it will always call from the main thread and you can safely access Unity functions from it!
        /// Once-Callbacks are called before registered permanent handlers
        /// </summary>
        /// <param name="eventName">The EventName to subscribe to</param>
        /// <param name="callback">The Callback to invoke ONCE on receiption</param>
        public void Once(string eventName, UnityAction<SocketIOEvent> callback)
        {
            if (!registeredOnceUnityActions.ContainsKey(eventName))
            {
                registeredOnceUnityActions.Add(eventName, new List<UnityAction<SocketIOEvent>>());
            }

            registeredOnceUnityActions[eventName].Add(callback);
        }

        /// <summary>
        /// This is a wrapper included for convenience in simple projects. It has some limitations.
        /// Registers a callback for a specific event which only has ONE payload of a GIVEN TYPE.
        /// This callback will only fire the first time, this event is received after registering the ccallback.
        /// If the received event has more than one payload, the additional payloads will be ignored.
        /// If the first payload is not of the correct type, the callback will not fire.
        /// If the event is received and the payloads are not compatible, <b>the callback is still removed from the list.</b>
        /// For any more advanced payload handling, use the "Once" method without type assignment.
        /// The callback is dispatched, so it will always call from the main thread and you can safely access Unity functions from it!
        /// </summary>
        /// <typeparam name="T">The expected type of the first payload (JObject, JArray or a primitive type supported by JValue)</typeparam>
        /// <param name="eventName">The EventName to subscribe to</param>
        /// <param name="callback">The Callback to invoke on receiption</param>
        /// <see cref="On(string, UnityAction{object[]})"/>
        /// <seealso cref="JValue"/>
        public void Once<T>(string eventName, UnityAction<T> callback)
        {
            if (!registeredOnceUnityActions.ContainsKey(eventName))
            {
                registeredOnceUnityActions.Add(eventName, new List<UnityAction<SocketIOEvent>>());
            }

            registeredOnceUnityActions[eventName].Add((e) => {
                if (e.payloads == null) return;
                if (e.payloads.Count < 1) return;

                try
                {
                    callback.Invoke(e.GetPayload<T>(0));
                }
                catch (Exception)
                {
                    //could not cast the payload into the given type, maybe it is not a value type
                    return;
                }
            });
        }

        /// <summary>
        /// Registers a callback for a specific event.
        /// The callback is dispatched, so it will always call from the main thread and you can safely access Unity functions from it!
        /// </summary>
        /// <param name="eventName">The EventName to subscribe to</param>
        /// <param name="callback">The Callback to invoke on receiption</param>
        public void On(string eventName, UnityAction<SocketIOEvent> callback)
        {
            if (!registeredUnityEventHandlers.ContainsKey(eventName))
            {
                registeredUnityEventHandlers.Add(eventName, new UnityEvent<SocketIOEvent>());
            }

            registeredUnityEventHandlers[eventName].AddListener(callback);
        }

        /// <summary>
        /// Registers a callback for a specific event that delivers NO payload. <b>It will NOT invoke if a payload is contained in the received message!</b>
        /// For any more advanced payload handling, use the "On" method without type assignment.
        /// <b>Warning:</b> You can not unregister this listener using "Off"!
        /// The callback is dispatched, so it will always call from the main thread and you can safely access Unity functions from it!
        /// </summary>
        /// <param name="eventName">The EventName to subscribe to</param>
        /// <param name="callback">The Callback to invoke on receiption</param>
        public void On(string eventName, UnityAction callback)
        {
            if (!registeredUnityEventHandlers.ContainsKey(eventName))
            {
                registeredUnityEventHandlers.Add(eventName, new UnityEvent<SocketIOEvent>());
            }

            registeredUnityEventHandlers[eventName].AddListener((e) => {
                if (e.payloads != null && e.payloads.Count > 0)
                {
                    UnityEngine.Debug.LogWarning("[Socket.IO@" + namespacePath + "] Not invoking event callback for " + eventName + " as it expects exactly NO payload but we have some payload. If you need a universal method, use the non-generic callback with one parameter.");
                    return;
                }
                callback.Invoke();
            });
        }

        /// <summary>
        /// This is a wrapper included for convenience in simple projects. It has some limitations.
        /// Registers a callback for a specific event which only has ONE payload of a GIVEN TYPE.
        /// If the received event has more than one payload, the additional payloads will be ignored.
        /// If the first payload is not of the correct type, the callback will not fire.
        /// For any more advanced payload handling, use the "On" method without type assignment.
        /// <b>Warning:</b> You can not unregister this listener using "Off"!
        /// The callback is dispatched, so it will always call from the main thread and you can safely access Unity functions from it!
        /// </summary>
        /// <typeparam name="T">The expected type of the first payload (JObject, JArray or a primitive type supported by JValue)</typeparam>
        /// <param name="eventName">The EventName to subscribe to</param>
        /// <param name="callback">The Callback to invoke on receiption</param>
        /// <see cref="On(string, UnityAction{SocketIOEvent})"/>
        /// <seealso cref="JValue"/>
        public void On<T>(string eventName, UnityAction<T> callback)
        {
            if (!registeredUnityEventHandlers.ContainsKey(eventName))
            {
                registeredUnityEventHandlers.Add(eventName, new UnityEvent<SocketIOEvent>());
            }

            registeredUnityEventHandlers[eventName].AddListener((e) => {
                if (e.payloads == null) return;
                if (e.payloads.Count < 1) return;

                try
                {
                    callback.Invoke(e.GetPayload<T>(0));
                } 
                catch (Exception ex)
                {
                    //could not cast the payload into the given type, maybe it is not a value type
                    UnityEngine.Debug.LogWarning("[Socket.IO@" + namespacePath + "] Not invoking event callback: " + ex.Message);
                    return;
                }
            });
        }

        /// <summary>
        /// Registers a callback for ANY event (catch-all)
        /// The callback is dispatched, so it will always call from the main thread and you can safely access Unity functions from it!
        /// </summary>
        /// <param name="callback">The Callback to invoke on receiption of any event</param>
        public void OnAny(UnityAction<SocketIOEvent> callback)
        {
            registeredCatchallUnityEventHandlers.AddListener(callback);
        }

        /// <summary>
        /// This is a wrapper included for convenience in simple projects. It has some limitations.
        /// Registers a callback for ANY event (catch-all) which only has ONE payload of a GIVEN TYPE.
        /// If the received event has more than one payload, the additional payloads will be ignored.
        /// If the first payload is not of the correct type, the callback will not fire.
        /// For any more advanced payload handling, use the "OnAny" method without type assignment.
        /// <b>Warning:</b> You can NOT unregister this listener using "OffAny(UnityAction<string, object[]> callback)"!
        /// The callback is dispatched, so it will always call from the main thread and you can safely access Unity functions from it!
        /// </summary>
        /// <typeparam name="T">The expected type of the first payload (JObject, JArray or a primitive type supported by JValue)</typeparam>
        /// <param name="callback">The Callback to invoke on receiption of any event</param>
        /// <see cref="OnAny(UnityAction{string, SocketIOEvent})"/>
        /// <seealso cref="JValue"/>
        public void OnAny<T>(UnityAction<string, T> callback)
        {
            registeredCatchallUnityEventHandlers.AddListener((e) => {
                if (e.payloads == null) return;
                if (e.payloads.Count < 1) return;

                try
                {
                    callback.Invoke(e.eventName, e.GetPayload<T>(0));
                }
                catch (Exception)
                {
                    //could not cast the payload into the given type, maybe it is not a value type
                    return;
                }
            });
        }

        /// <summary>
        /// Unregisters a callback for a specific event.
        /// </summary>
        /// <param name="eventName">The name of the event</param>
        /// <param name="callback">The callback which should be removed</param>
        /// <returns>True if the callback was removed, false otherwise</returns>
        public bool Off(string eventName, UnityAction<SocketIOEvent> callback)
        {
            if (!registeredUnityEventHandlers.ContainsKey(eventName))
            {
                return false;
            }

            registeredUnityEventHandlers[eventName].RemoveListener(callback);
            return true;
        }

        //TODO OnAnyOutgoing

        /// <summary>
        /// Unregisters a callback for the catch-all event.
        /// </summary>
        /// <param name="callback">The callback which should be removed</param>
        /// <returns>True if the callback was removed, false otherwise</returns>
        public bool OffAny(UnityAction<SocketIOEvent> callback)
        {
            registeredCatchallUnityEventHandlers.RemoveListener(callback);
            return true;
        }

        /// <summary>
        /// Unregisters all callbacks for the catch-all event.
        /// </summary>
        public void OffAny()
        {
            registeredCatchallUnityEventHandlers.RemoveAllListeners();
        }

        /// <summary>
        /// Unregisters all callbacks (once and permanent) for a specific event.
        /// </summary>
        /// <param name="eventName">The name of the event</param>
        public void RemoveAllListeners(string eventName)
        {
            if (registeredUnityEventHandlers.ContainsKey(eventName))
            {
                registeredUnityEventHandlers[eventName].RemoveAllListeners();
            }

            if (registeredOnceUnityActions.ContainsKey(eventName))
            {
                registeredOnceUnityActions.Remove(eventName);
            }
        }

        /// <summary>
        /// Unregisters all callbacks (once and permanent) for all events - including catchall.
        /// </summary>
        public void RemoveAllListeners()
        {
            registeredUnityEventHandlers.Clear();
            registeredOnceUnityActions.Clear();
            registeredCatchallUnityEventHandlers.RemoveAllListeners();
        }

    }
}
