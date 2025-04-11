import { io } from "socket.io-client";

export const socket_server = "https://server.sj-investment.net/";

export const socket = io(socket_server)