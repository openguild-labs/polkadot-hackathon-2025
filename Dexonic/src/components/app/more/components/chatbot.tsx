'use client';

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import { aiChatbot } from '@/services/ai-chatbot';
// import { Textarea } from '@/components/ui/textarea';
// import { Button } from '@/components/ui/button';

import topBanner from '@/public/img/chatbot/top-banner.svg';
import dexonicLogoCircle from '@/public/img/dexonic-logo-circle.svg';
import sendIcon from '@/public/icons/chatbot/send.svg';

const Chatbot = () => {
    const [messages, setMessages] = useState<
        {
            timestamp: ReactNode;
            sender: string;
            text: string;
        }[]
    >([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleSendMessage = async () => {
        if (input.trim() === '') return;

        const timestamp = new Date().toLocaleTimeString();
        const userMessage = { sender: 'user', text: input, timestamp };
        setMessages([...messages, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const data = await aiChatbot(input);
            console.log('API response:', data);
            if (data.length > 0) {
                const botMessage = {
                    sender: 'bot',
                    text: data[0].reply,
                    timestamp: new Date().toLocaleTimeString(),
                };
                setMessages((prevMessages) => [...prevMessages, botMessage]);
                displayBotMessageWordByWord(data[0].reply, botMessage);
            }
        } catch (error) {
            console.error('Error fetching bot response:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const displayBotMessageWordByWord = (
        fullText: string,
        botMessage: { sender: string; text: string; timestamp: ReactNode },
    ) => {
        const words = fullText.split(' ');
        let currentText = '';
        words.forEach((word, index) => {
            setTimeout(() => {
                currentText += (index === 0 ? '' : ' ') + word;
                setMessages((prevMessages) => {
                    const updatedMessages = [...prevMessages];
                    updatedMessages[updatedMessages.length - 1] = {
                        ...botMessage,
                        text: currentText,
                    };
                    return updatedMessages;
                });
            }, index * 70);
        });
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const isLongMessage = (text: string) => text.length > 5;

    const hasUserMessage = messages.some((msg) => msg.sender === 'user');

    return (
        <div className="relative mx-auto flex h-full max-w-md flex-col justify-between pb-4">
            <Image src={topBanner} alt="background" width={500} />
            <div className="absolute left-1/3 right-1/3 top-8 grid justify-center text-center">
                <Image
                    src={dexonicLogoCircle}
                    alt="Dexonic Logo Circle"
                    width={60}
                    className="ml-1.5"
                />
                <h1 className="pt-3">AI Chatbot</h1>
            </div>
            {!hasUserMessage && (
                <div className="p-4 text-center text-gray-500">
                    Dexonic&apos;s AI Chatbot provides AI-powered trading tools and real-time
                    insights to enhance <br /> your crypto management.
                </div>
            )}
            <div className="flex-grow-0 overflow-y-auto p-4">
                <div className="space-y-4">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex items-start ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.sender != 'user' && (
                                <Image
                                    src={dexonicLogoCircle}
                                    alt="dexonic logo in circle"
                                    className="mr-2"
                                />
                            )}
                            <div
                                className={`${msg.sender === 'user' ? 'rounded-xl rounded-br-none border-2 border-blue-500 text-white' : 'rounded-tl-none border-2 border-[#353535] bg-black text-white'} ${isLongMessage(msg.text) && msg.sender === 'user' ? 'w-2/3' : undefined} rounded-lg p-4 text-justify`}
                            >
                                <div>{msg.text}</div>
                                <div className="mt-1 text-right text-xs text-gray-400">
                                    {msg.timestamp}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                    {isLoading && <div className="message bot">Bot is typing...</div>}
                </div>
                <div className="mt-10 flex items-center justify-between rounded-xl border border-[#353535] p-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Send Message..."
                        disabled={isLoading}
                        className="w-full bg-transparent focus:outline-none"
                    />
                    <button onClick={handleSendMessage} disabled={isLoading} className="ml-2">
                        <Image src={sendIcon} alt="send icon" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
