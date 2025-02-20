import { io } from "socket.io-client";

const URL = "http://localhost:3000"; 

export const socketObj = io(URL, {
  autoConnect: false, 
  reconnection: true, 
  reconnectionAttempts: 5, 
  transports: ["websocket"], 
});
