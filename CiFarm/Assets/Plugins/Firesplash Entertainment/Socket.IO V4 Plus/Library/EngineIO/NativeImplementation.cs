using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using UnityEngine;
using static Firesplash.GameDevAssets.SocketIOPlus.EngineIO.DataTypes;

namespace Firesplash.GameDevAssets.SocketIOPlus.EngineIO
{
    internal class NativeImplementation : Tranceiver
    {
#if !UNITY_WEBGL || UNITY_EDITOR
        private Thread readerThread, writerThread;
        private CancellationTokenSource CTokenSrc, LowLevelCTokenSrc;
        private ClientWebSocket ws;

        internal NativeImplementation(string pDefaultPath) : base(pDefaultPath)
        {
        }

        internal override void Connect(string serverAddress, bool volatileMode)
        {
            Log("Connecting to server using NATIVE implementation");
            base.Connect(serverAddress, volatileMode);

            //Initialize WebSocket Client
            ws = new ClientWebSocket();
            int targetFramerate = Application.targetFrameRate;

            Task.Run(async () =>
            {
                if (readerThread != null && readerThread.IsAlive) readerThread.Abort();
                if (writerThread != null && writerThread.IsAlive) writerThread.Abort();

                //The LowLevel CT is used for disconnecting, when the main source has been cancelled
                LowLevelCTokenSrc = new CancellationTokenSource();

                //This is the mail source
                CTokenSrc = new CancellationTokenSource();

                try
                {
                    Log("Connecting to WebSocket on " + this.connectionTarget.ToString());
                    await ws.ConnectAsync(this.connectionTarget, CTokenSrc.Token);

                    int tries = 0;
                    while (ws.State != WebSocketState.Open)
                    {
                        if (tries++ > 20)
                        {
                            LogError("Deadlock prevented: WebSocket did not become ready within 10 seconds after connect. Please report this to the devs and include as much background information as possible.");
                            return;
                        }
                        await Task.Delay(50);
                    }
                }
                catch (Exception e)
                {
                    LogException(e);
                    LogError(e.GetType().Name + " while connecting to server: " + e.ToString());
                    OnError?.Invoke(e);
                    return;
                }

                readerThread = new Thread(new ThreadStart(ReaderThread));
                Log("Starting Engine.IO Reader-Thread");
                readerThread.Start();

                writerThread = new Thread(new ParameterizedThreadStart(WriterThread));
                Log("Starting Engine.IO Writer-Thread");
                writerThread.Start(targetFramerate);
            });
        }

        internal override void Disconnect(bool serverInitiated, string technicalReason = null)
        {
            base.Disconnect(serverInitiated, technicalReason);
            if (serverInitiated)
            {
                ws.Abort();
                CTokenSrc.Cancel();
                LowLevelCTokenSrc.Cancel();
            }
            else 
            {
                technicalQueue.Enqueue(new EngineIOPacket(EIOPacketType.Close));
                CTokenSrc.CancelAfter(1000);
                LowLevelCTokenSrc.CancelAfter(3000);
            }
        }

        internal override ConnectionState State
        {
            get
            {
                if (ws == null) return ConnectionState.None;
                if (!handshakeCompleted && ws.State == WebSocketState.Open) return ConnectionState.Handshake;
                else if (ws.State == WebSocketState.CloseReceived) return ConnectionState.Closed;
                return (ConnectionState)ws.State;
            }
        }

        private async void ReaderThread()
        {
            while (!CTokenSrc.Token.IsCancellationRequested)
            {
                var binaryMessage = new List<byte>();

            READ:
                var buffer = new byte[1024];
                WebSocketReceiveResult res = null;

                try
                {
                    res = await ws.ReceiveAsync(new ArraySegment<byte>(buffer), CTokenSrc.Token);
                    if (CTokenSrc.Token.IsCancellationRequested) break;
                }
                catch (OperationCanceledException)
                {
                    Log("EngineIO Reader has been aborted in action on request (by CTokenSrc)");
                    break;
                }
                catch (WebSocketException e)
                {
                    Log("Transport exception: " + e.ToString());
                    OnDisconnect?.Invoke(false, "transport close");
                    break;
                }
                catch (Exception e)
                {
                    Log("An Exception caused the EngineIO Reader to stop unexpectedly: " + e.ToString());
                    break;
                }

                if (res == null)
                    goto READ; //we got nothing. Wait for data.

                //We received data. Let's go and parse it...

                if (res.MessageType == WebSocketMessageType.Close)
                {
                    Log("Received Server-Side-Close");
                    OnDisconnect?.Invoke(true, "transport close");
                    break;
                }

                if (res.MessageType == WebSocketMessageType.Text)
                {
                    binaryMessage.AddRange(buffer);
                    if (!res.EndOfMessage)
                    {
                        goto READ;
                    }
#if EIO_DEBUG
                    Log(" < " + Encoding.UTF8.GetString(binaryMessage.ToArray()));
#endif
                    ReceiveMessage(EngineIOPacket.Parse(false, binaryMessage.ToArray()));
                }
                else if (res.MessageType == WebSocketMessageType.Binary)
                {
                    binaryMessage.AddRange(buffer.Take(res.Count));
                    if (!res.EndOfMessage)
                    {
                        goto READ;
                    }

#if EIO_DEBUG
                    Log(" < BINARY MESSAGE");
#endif
                    ReceiveMessage(EngineIOPacket.Parse(true, binaryMessage.ToArray()));
                }
                else
                {
                    if (!res.EndOfMessage)
                    {
                        goto READ;
                    }

                    Log("Received an unsupported message. Ignoring it...");
                }
            }

            if (ws.State != WebSocketState.CloseReceived) OnDisconnect?.Invoke(false, "transport close");
        }

        private async void WriterThread(object targetFramerate)
        {
            int sleepMS = (int)targetFramerate <= 0 ? 30 : Mathf.Clamp(Mathf.FloorToInt(990f / (int)targetFramerate), 15, 50);
            while (!CTokenSrc.Token.IsCancellationRequested)
            {
#if SIO_MICRO_DELAY
                await Task.Delay(1);
#else
                await Task.Delay(sendQueue.Count > 0 ? 1 : sleepMS);
#endif
                EngineIOPacket[] packets = null;
                bool isTechnical = false;

                //This could happen in rare cases if the Tranceiver is being destroyed while awaiting the delay above.
                if (sendQueue == null)
                {
                    if (!CTokenSrc.Token.IsCancellationRequested)
                    {
                        LogError("sendQueue is null while WriterThread is not requested to cancel. This is a bug. Please report it to the developer.");
                    }
                    break;
                }

                //Send technical packets first
                lock (queueLock)
                {
                    if (technicalQueue.Count > 0)
                    {
                        EngineIOPacket packet;
                        technicalQueue.TryDequeue(out packet);
                        if (packet != null)
                        {
                            packets = new EngineIOPacket[] { packet };
                            isTechnical = true;
                        }
                    }
                    else if (sendQueue.Count > 0) //Then send data
                    {
                        try
                        {
                            packets = sendQueue.First.Value;
                            sendQueue.RemoveFirst();

                            if (packets == null)
                            {
                                LogError("Encountered a NULL-Packet to be transmitted - This could be a Parser issue. Packet will be dismissed and operation continues...");
                                continue;
                            }
                        }
                        catch (Exception e)
                        {
                            LogError(e.GetType().Name + " while taking an element from sendQueue:");
                            LogException(e);
                            continue;
                        }
                    }
                }

                if (packets == null) continue;

                foreach (EngineIOPacket packet in packets)
                {
                    try
                    {
#if EIO_DEBUG
                    if (packet.IsBinaryMessage()) Log(" > BINARY MESSAGE");
                    else Log(" > " + Encoding.UTF8.GetString(packet.GetPacketBytesForTransmission()));
#endif

                        await ws.SendAsync(new ArraySegment<byte>(packet.GetPacketBytesForTransmission()), (packet.IsBinaryMessage() ? WebSocketMessageType.Binary : WebSocketMessageType.Text), true, CTokenSrc.Token)
                            .ConfigureAwait(!isOperatingInVolatileMode || packet.GetPacketType() == EIOPacketType.Close || packet.GetPacketType() == EIOPacketType.Open); //In volatile mode, we do not wait for packets to be sent, except Open/Close

                        if (packet.GetPacketType() == EIOPacketType.Close)
                        {
                            //Cleanly exit the writer on disconnect
                            await ws.CloseOutputAsync(WebSocketCloseStatus.NormalClosure, "io client disconnect", CTokenSrc.Token);
                            goto ExitWriter;
                        }
                    }
                    catch (OperationCanceledException)
                    {
                        Log("PubSub Writer has been aborted in action on request (by CTokenSrc)");
                        if (!isTechnical && !isOperatingInVolatileMode)
                        {
                            lock (queueLock)
                            {
                                sendQueue.AddFirst(packets);
                            }
                        }
                        break;
                    }
                    catch (WebSocketException ex)
                    {
                        if (!isTechnical && !isOperatingInVolatileMode)
                        {
                            lock (queueLock)
                            {
                                sendQueue.AddFirst(packets);
                            }
                        }
                        if (!CTokenSrc.IsCancellationRequested) throw ex; //if we are terminating, this exception is expected.
                        break;
                    }
                    catch (Exception ex)
                    {
                        if (!isTechnical && !isOperatingInVolatileMode)
                        {
                            lock (queueLock)
                            {
                                sendQueue.AddFirst(packets);
                            }
                        }
                        LogException(ex);
                        LogError("Cancelling CTokenSrc on Writer exception: " + ex.ToString());
                        CTokenSrc.Cancel();
                        break;
                    }
                }
            }

            ExitWriter:
            if (ws != null && ws.State == WebSocketState.Open)
            {
                //Seems like our send queue was too long and the cancellation token was cancelled

                EngineIOPacket closePacket = new EngineIOPacket(EIOPacketType.Close);

                await ws.SendAsync(new ArraySegment<byte>(closePacket.GetPacketBytesForTransmission()), WebSocketMessageType.Text, true, LowLevelCTokenSrc.Token);
                await ws.CloseAsync(WebSocketCloseStatus.NormalClosure, "io client disconnect", LowLevelCTokenSrc.Token);
            }
        }
#else
                internal NativeImplementation(string pDefaultPath) : base(pDefaultPath)
        {
            throw new NotImplementedException("The app has been compiled for WebGL targets so the native implementation is not included.");
        }
#endif
    }
}
