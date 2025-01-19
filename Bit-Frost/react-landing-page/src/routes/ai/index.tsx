import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const SYSTEM_PROMPT = `
You are Natty, a specialized AI assistant focused exclusively on crypto, blockchain, Web3, and DeFi topics. Your primary expertise is in cross-chain operations, particularly for the Bifrost product. Bifrost is a decentralized darkpool-based chain abstraction service using the Frost Schnorr threshold scheme, offering fast and cheap order finalities with zero slippage.

Key instructions:
1. Only respond to queries related to crypto, blockchain, Web3, and DeFi.
2. For any off-topic questions, reply: "I don't know and am not trained for this task."
3. Provide general information about the crypto space when asked.
4. Assist users in creating orders for the Bifrost product.
5. When a user wants to transfer tokens between chains, output a JSON object in the following format:
   { amount: [number], fromChain: [chain], toChain: [chain] }

Supported chains:
- evm:sepolia
- evm:base
- evm:scroll
- evm:amoy
- evm:optimism
- evm:bnb
- evm:citrea
- evm:moonbase
- bitcoin

Rules for order creation:
- Only support BTC for the Bitcoin chain and xBTC for EVM-based chains.
- Users cannot bridge from the same chain to the same chain.
- If any required information is missing, ask the user for specifics.
- xBTC amounts must be whole numbers (no decimals).
- When all order details are available, return only the JSON object, I repeat only json cuz i will parse this json into js code and use it accordingly no other text than json EVER.

For unsupported chains, inform the user: "This feature is not part of the system yet. Please contact the developers. Supported chains are: sepolia, base, scroll, amoy,  optimism, hedera, linea, morph, flow, airdao,gnosis, rootstock and bitcoin."

Example user inputs and responses:
User: "I want to swap my xbtc 100 from sepolia to scroll"
Response: { amount: 100, fromChain: "evm:sepolia", toChain: "evm:scroll" }

User: "I want to bridge my btc to amoy"
Response: "To create your order, I need to know the amount of BTC you want to bridge. Please provide the amount."

User: "2000"
Response: { amount: 2000, fromChain: "bitcoin", toChain: "evm:amoy" }

Note: for evms its xBTC and BTC is for bitcoin.
`;
const App: React.FC = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!message.trim() || !API_KEY) {
      alert("Please enter a message and provide an API key.");
      return;
    }

    const newMessage: Message = { role: "user", content: message };
    setChatHistory([...chatHistory, newMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://api.red-pill.ai/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...chatHistory,
            newMessage,
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );

      const assistantMessage: Message = {
        role: "assistant",
        content: response.data.choices[0].message.content,
      };
      setChatHistory([...chatHistory, newMessage, assistantMessage]);

      interface  Params {
        amount?: string;
        fromChain?: string;
        toChain?: string;
      }
      try {
        // console.log(assistantMessage.content);
        // parse assistant messege is parsed do some computation
        const json = JSON.parse(assistantMessage.content) as Params;
        
        // console.log("assistantMessage.content" , json.amount , json.fromChain , json.toChain);
        // if worked go to /swap/amount/chain/chain
        if (json.amount && json.fromChain && json.toChain) {
          window.location.href = `/swap/${json.amount}/${json.fromChain}/${json.toChain}`;
        }

      } catch (error) {
        //do nothing
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen  bg-gray-900 text-white flex flex-col">
        <div className="fixed right-5 glowButtonAbs top-5 px-5 py-2" onClick={() => window.location.href = '/'}>
            Home
        </div>
      <div className="container  mx-auto px-2 py-3 flex-1 flex flex-col mb-7">
        <h1 className="text-3xl font-bold mb-6 mt-5">Natty Your Cross Chain AI assitant</h1>
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto mb-4 Faqbg rounded-xl p-4"
        >
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 ${
                msg.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <span
                className={`inline-block p-2 swap-card border rounded-lg ${
                  msg.role === "user" ? "ml-72" : "mr-72"}`}
              >
                {msg.content}
              </span>
            </div>
          ))}
          {isLoading && (
            <div className="text-center">
              <span className="inline-block p-2 rounded bg-gray-700">
                AI is thinking...
              </span>
            </div>
          )}
        </div>
        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 p-2 bg-gray-800 rounded-l outline-none"
          />
          <button
            onClick={handleSendMessage}
            className="bg-white text-black font-bold  p-2 rounded-r"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
