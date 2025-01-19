using Firesplash.GameDevAssets.SocketIOPlus;
using System;
using System.Text;
using UnityEngine;
using UnityEngine.UI;

public class ExampleScript : MonoBehaviour
{
    public SocketIOClient io;
    public Text uiStatus, uiGreeting, uiPodName;

    [Serializable]
    struct ItsMeData
    {
        public string version;
    }

    [Serializable]
    struct ServerTechData
    {
        public string timestamp;
        public string podName;
    }

    // Start is called before the first frame update
    void Start()
    {
        //sioCom is assigned via inspector so no need to initialize it.
        //We just fetch the actual Socket.IO instance using its integrated Instance handle and subscribe to the connect event using a Generic "On" which is the most simple way
        //Please note you could also write io.D.On("connect", (string nothing) => {... but we want to explicitely show the difference
        io.D.On("connect", () => {
            Debug.Log("LOCAL: Hey, we are connected!");
            uiStatus.text = "Socket.IO Connected. Doing work...";

            //NOTE: All those emitted and received events (except connect and disconnect) are made to showcase how this asset works. The technical handshake is done automatically.

            //First of all we knock at the servers door
            //EXAMPLE 1: Sending an event without payload data
            io.D.Emit("KnockKnock");
        });

        //The server will respond to our knocking by askin who we are:
        //EXAMPLE 2: Listening for an event without payload using the full featured way
        io.D.On("WhosThere", (sioEvent) =>
        {
            //This time we got a SocketIOEvent as callback parameter because we're not using the "Generic" wrapper subscription (On<T>).
            //We can now check the payload and access some more API methods
            if (sioEvent.payloads == null) 
                Debug.Log("RECEIVED a WhosThere event without payload data just as expected.");

            //As the server just asked for who we are, let's be polite and answer him.
            //EXAMPLE 3: Sending an event with payload data
            ItsMeData me = new ItsMeData()
            {
                version = Application.unityVersion
            };

            //The emit directly takes the object and serializes it for transmission. This is done using a generic again.
            //this is the full written variant. Again: it can be simplified but we want to clearly show what we are doing here.
            io.D.Emit<ItsMeData>("ItsMe", me);
        });


        //The server will now receive our event and parse the data we sent. Then it will answer with two events.
        //EXAMPLE 4: Listening for an event with plain text payload using a generic subscription
        //The cool thing about these subscriptions is, that the library validates the payload to match the expected type before invoking the callback.
        //the downside is, that we are not able to remove the specific listener again without removing *all* listeners
        io.D.On<string>("Welcome", (payload) =>
        {
            Debug.Log("SERVER: " + payload);
            uiGreeting.text = payload;
        });


        //EXAMPLE 5: Listening for an event with JSON Object payload, again using the full implementation
        io.D.On("TechData", (sioEvent) =>
        {
            //Let's validate the payload - we expect our object in the first payload
            if (sioEvent.payloads.Count < 1)
            {
                Debug.LogError("Received TechData without payload");
                return;
            }

            try
            {
                ServerTechData dataReceived = sioEvent.GetPayload<ServerTechData>(0);
                Debug.Log("Received the POD name from the server. Updating UI. Oh! It's " + dataReceived.timestamp + " by the way.");
                uiPodName.text = "I talked to " + dataReceived.podName;
            }
            catch (Exception e)
            {
                //if the payload was not what we expect, we'll get an Exception thrown.
                Debug.LogException(e);
            }

            //Let's ask for random numbers (example 6 below)
            //This time, we use the API of the event to respond, instead the client directly. This has no actual reason, just a showcase.
            sioEvent.Namespace.Emit("SendNumbers");
        });


        //EXAMPLE 6: Listening for an event with a primitive Array payload
        io.D.On<int[]>("RandomNumbers", (numbers) =>
        {
            Debug.Log("We received the following numbers from the server: " + string.Join(", ", numbers));

            //EXAMPLE 7: Sending an acknowledgement
            io.D.Emit("DemoAck", "SomeValue", (rspPayload) => {
                //This callback will be called, when the server answers
                //The object[] contains the payloads, each element is eighter a byte[] or a JToken - In our case its a JToken containing a string
                Debug.Log("We received a response to the acknowledgement: " + rspPayload[0]);

                //EXAMPLE 8: Sending binary data
                //We encode a string into a byte[] for this example. The server will verify this and emit an event "BinResponse".
                Debug.Log("We will now send some binary data to the server...");
                byte[] binData = Encoding.UTF8.GetBytes("Hello Server");
                io.D.Emit<byte[]>("BinRequest", binData);
            });
            
        });


        //EXAMPLE 9: Listening for an event with a binary payload
        io.D.On<byte[]>("BinResponse", (binData) =>
        {
            //Let's decode the binary data into a string (the data contained in the byte[] could also be a picture, a file, ... - whatever the server sends. Remember to verify received data in a real world project.)
            string decodedString = Encoding.UTF8.GetString(binData);
            Debug.Log("We received the expected binary event from the server. The server said: " + decodedString);

            //Send a last event to be polite (this has absolutely no technical reason. It will simply make the server cleanly disconnect us. On a clean disconnect, no reconnect is issued.)
            Debug.Log("We will now tell the server, we're done.");
            io.D.Emit("Goodbye", "Thanks for talking to me!");
        });




        //When the conversation is done, the server will close our connection after we said Goodbye
        io.D.On<string>("disconnect", (payload) => {
            if (payload.Equals("io server disconnect"))
            {
                Debug.Log("Disconnected from server.");
                uiStatus.text = "Finished. Server closed connection.";
            } 
            else
            {
                Debug.LogWarning("We have been unexpecteldy disconnected. This will cause an automatic reconnect. Reason: " + payload);
            }
        });




        //We are now ready to actually connect
        //The simple way will use the parameters set in the inspector (or with a former call to Connect(...)):
        //io.Connect();

        //You can even transmit authentication payload to the server. This is done using a delegate.
        //io.SetAuthPayloadCallback(GetAuthData);
        //This is now it's own example. Check it out!


        //But the following command shows how you can programmatically connect to any server at any given time - in this case including our previously set auth information
        io.Connect("https://sio-v4-example.unityassets.i01.clu.firesplash.de");

        //If you want to run our delivered test server (exampleServer.js) locally on your PC, use this line instead:
        //io.Connect("http://localhost:8123");
    }

}
