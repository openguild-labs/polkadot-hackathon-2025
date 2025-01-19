using System.Collections.Generic;
using UnityEngine;
using Firesplash.GameDevAssets.SocketIOPlus;
using System.Linq;

public class SIOPingPongExampleV2 : MonoBehaviour
{
    //This is a sample how to use Acknowlegdements.
    //You can also use the delivered exampleServer.js for reference

    public SocketIOClient io;
    float nextPingWaitTime = 1f;
    float pongTimeout = -1;
    float pingTimestamp;

    public UnityEngine.UI.Text lblRTT, lblStats, lblState;

    bool addListenerRegistered = false;
    int pingCount = 0;
    int timeoutCount = 0;

    List<float> pingResults = new List<float>();

    public UnityEngine.UI.Text lblButton;
    public UnityEngine.UI.Text lblAddButton;

    public void ButtonClick()
    {
        if (io.D.state != DataTypes.ConnectionState.CONNECTED)
        {
            io.Connect();
        } 
        else
        {
            io.Disconnect();
        }
    }


    // *** Example for On/Off
    public void AdditionalPongCallback(SocketIOEvent e)
    {
        Debug.Log("Received AdditionalPongEvent with timestamp " + e.GetPayload<string>(0));
    }

    public void BtnToggleAdditionalListener()
    {
        if (!addListenerRegistered)
        {
            io.D.On("AdditionalPongEvent", AdditionalPongCallback);
            addListenerRegistered = true;
            lblAddButton.text = "Unregister AdditionalPongEvent";
        } 
        else
        {
            io.D.Off("AdditionalPongEvent", AdditionalPongCallback);
            addListenerRegistered = false;
            lblAddButton.text = "Register AdditionalPongEvent";
        }
    }
    // *** End On/Off example

    private void OnGUI()
    {
        if (io.D.state != DataTypes.ConnectionState.CONNECTED)
        {
            lblButton.text = "Start";
        }
        else
        {
            lblButton.text = "Stop";
        }

        lblState.text = "Socket State: " + io.State.ToString() + " | DefaultNamespace State: " + io.D.state.ToString();
    }

    private void Update()
    {
        if (io.State != Firesplash.GameDevAssets.SocketIOPlus.EngineIO.DataTypes.ConnectionState.Open) return;
        if (io.D.state != DataTypes.ConnectionState.CONNECTED) return;

        if (pongTimeout > 0)
        {
            pongTimeout -= Time.deltaTime;
            if (pongTimeout <= 0) {
                Debug.LogWarning("Ping Timeout!");
                timeoutCount++;
            }
        }
        else if (nextPingWaitTime > 0)
        {
            nextPingWaitTime -= Time.deltaTime;
            if (nextPingWaitTime <= 0)
            {
                pongTimeout = 5; //5 seconds pong timeout
                float maxPongTime = Time.unscaledTime + pongTimeout;
                Debug.Log("PING");

                //Default Namespace
                io.D.Emit("PingV2", 0, (uselessPayload) => //the "0" is only a random payload as the protocol requires a payload for all acknowledgements. uselessPayload[0] will be the "1" sent from our server.
                {
                    //This lambda will be called, when the acknowlegdement is called from the server side (this is basically the PONG)

                    if (Time.unscaledTime > maxPongTime)
                    {
                        //Too late! Ignore this PONG...
                        Debug.LogWarning("Received a PONG on / after timeout. This will be ignored.");
                    }
                    else
                    {
                        float rtt = Time.unscaledTime - pingTimestamp;
                        pingResults.Add(rtt);
                        pongTimeout = 0;
                        lblRTT.text = (rtt*1000).ToString();
                        Debug.Log("PONG received on /, RTT=" + rtt*1000 + "ms");
                    }
                });
                
                pingTimestamp = Time.unscaledTime;
                pingCount++;
                nextPingWaitTime = 1f;
            }
        }

        lblStats.text = pingCount + " PING sent\r\n" + pingResults.Count + " PONG received\r\n" + timeoutCount + " packets lost \r\nAvg RTT: " + (pingResults.Count > 0 ? pingResults.Average() * 1000 : "---") + "ms";

    }

    private void OnDestroy()
    {
        io.Disconnect();
    }

}
