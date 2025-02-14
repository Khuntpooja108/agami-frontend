import React, { createContext, useContext, useEffect, useState } from "react";
import { socket } from "../config/Socket";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.connect(); 

    socket.on("connect", () => {
      console.log("Socket Connected == ", socket.id);
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Socket Disconnected");
      setIsConnected(false);
    });

    return () => {
      socket.disconnect(); 

    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
