import { io } from "socket.io-client";

export const socket_server = "https://server.sjinvestment.net/";

export const socket = io(socket_server)