import { io } from "socket.io-client";

export const socket_server = "https://server.co-nex.com/";
// export const socket_server = "http://localhost:3008/"

export const socket = io(socket_server)