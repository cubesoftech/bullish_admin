import { io } from "socket.io-client";

export const socket_server = "http://localhost:9001/";

export const socket = io(socket_server)