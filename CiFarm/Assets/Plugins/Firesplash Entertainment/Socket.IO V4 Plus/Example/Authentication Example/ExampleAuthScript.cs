using Firesplash.GameDevAssets.SocketIOPlus;
using Newtonsoft.Json.Linq;
using System;
using UnityEngine;
using UnityEngine.UI;
using static Firesplash.GameDevAssets.SocketIOPlus.DataTypes;

public class ExampleAuthScript : MonoBehaviour
{
    public SocketIOClient io;
    public Text uiStatus;
    public Text lblButton;

    [Serializable]
    struct AuthData
    {
        //This is just an example. You can design this object to amtch your needs.
        public string supersecret;
    }

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

    private void OnGUI()
    {
        if (io.D.state != DataTypes.ConnectionState.CONNECTED)
        {
            lblButton.text = "Connect";
        }
        else
        {
            lblButton.text = "Disconnect";
        }
    }

    // Start is called before the first frame update
    void Start()
    {
        io.D.On("connect", () => {
            Debug.Log("LOCAL: Hey, we are connected!");
            uiStatus.text = "Socket.IO Connected.";

        });


        //The internal event connect_error is fired, when the server rejects our authentication (or something else propagates an error on the server side).
        //The payload of the connect_error event is a SocketIOErrorPayload instance except when the server issued an error on connect time (auth failure).
        //In this case, you're passed the whole JObject as it was received from the server. It can, however, be casted into a SocketIOErrorPayload if your server issues a JS Error compatible datastructure.
        io.D.On<SocketIOErrorPayload>("connect_error", (jsErrorObject) => {
            Debug.Log("LOCAL: An error occured at connect time: " + jsErrorObject.message);
            uiStatus.text = "Error: " + jsErrorObject.message;
        });


        //When the conversation is done, the server will close our connection after 4 seconds
        io.D.On("disconnect", (reason) => {
            uiStatus.text = "Disconnected: " + reason;
        });


        //You can even transmit authentication payload to the server. This is done using a delegate.
        io.SetAuthPayloadCallback(GetAuthData);

        //We are now ready to actually connect
        //The simple way will use the parameters set in the inspector (or with a former call to Connect(...)):
        //This is done in the ButtonClick callback at the top of this script

    }


    /// <summary>
    /// This delegate is called by the library, when it requires authentication data for a namespace connect.
    /// We assigned this delegate a few lines higher.
    /// </summary>
    /// <param name="namespacePath">The namespace path ("/" for default)</param>
    /// <returns>should return the required payload object</returns>
    /// The server can access it using 
    object GetAuthData(string namespacePath)
    {
        if (namespacePath.Equals("/"))
        {
            Debug.Log("Delivering auth data for namespace /");
            return new AuthData()
            {
                supersecret = "UnityAuthenticationSample"
            };
        }
        return null;
    }
}
