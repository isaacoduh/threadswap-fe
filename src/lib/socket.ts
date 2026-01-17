import {io, type Socket} from 'socket.io-client';

declare global {
    // eslint-disable-next-line no-var
    var __threadswap_socket__: Socket | undefined;
}

function getToken() {
    if(typeof window == "undefined") return null;
    return window.localStorage.getItem("access_token");
}

export function getSocket(): Socket {
    if(typeof window === "undefined") {
        throw new Error("getSocket() must be called in browser")
    }

    if(!globalThis.__threadswap_socket__){
        globalThis.__threadswap_socket__ = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
            transports: ["websocket"],
            autoConnect: false,
            auth: {token: getToken()}
        })
    }

    return globalThis.__threadswap_socket__;
}

export function connectSocket() {
    const socket = getSocket();
    if(!socket.connected) socket.connect();
    return socket;
}

export function disconnectSocket() {
    const socket = getSocket();
    if(socket.connected) socket.disconnect()
}