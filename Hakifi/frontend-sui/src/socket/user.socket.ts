"use client";
import EventEmitter from 'eventemitter3';
import { io, Manager, Socket } from 'socket.io-client';

type Callback = (data: any) => void;

class UserSocket extends EventEmitter {
    private static instance: UserSocket | undefined;
    m!: Manager;
    socket!: Socket;
    isConnected: boolean = false;
    closeInitiated: boolean = false;
    handlers: Map<string, Callback[]> = new Map();

    constructor(token: string) {
        super();
        this.initSocket(token);
    }

    private initSocket = (token: string) => {
        this.m = new Manager('wss://' + process.env.NEXT_PUBLIC_USER_SOCKET, {
            query: {
                token
            },
        });
        this.socket = this.m.socket('/');

        this.socket.on("connect", () => {
            this.isConnected = true;
            this.emit('connect');
            console.info('Connected to user socket');
        });

        this.socket.on("disconnect", (reason) => {
            if (reason === "io server disconnect") {
                // the disconnection was initiated by the server, you need to reconnect manually
                console.error('Socket encountered error: io server disconnect');
                this.socket.connect();

                this.isConnected = false;
                this.emit('disconnect');
            }
            // else the socket will automatically try to reconnect
        });

        this.socket.on("connect_error", (error) => {
            // ...
            console.error('Socket encountered error: ', error, 'Closing socket');
            this.socket.close();
        });
    };

    connect = () => {
        this.isConnected = true;
        this.socket.connect();
    };

    disconnect = () => {
        this.isConnected = false;
        this.socket.disconnect();
    };

    subscribe = (event: string, callback: (data: any) => void) => {
        if (!this.isConnected) {
            console.error('Socket not connected');
            return;
        }

        this.socket.on(event, (data) => {
            callback(data);
        });
    };

    unsubscribe = (event: string, callback: (data: any) => void) => {
        if (!this.isConnected) {
            console.error('Socket not connected');
            return;
        }

        this.socket.off(event, (data) => {
            callback(data);
        });
    };

    removeInstance = () => {
        UserSocket.instance = undefined;
    };

    public static getInstance(token: string): UserSocket {
        if (!!UserSocket.instance === false) {
            UserSocket.instance = new UserSocket(token);
        }

        return UserSocket.instance;
    }
}

export default UserSocket;
