import React, { createContext, useContext, useEffect, useState } from "react";
import { socketObj } from "../config/Socket";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(socketObj);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      socket.connect(); 
      socket.emit("join", storedUser.id); 
  
      socket.on("connect", () => {
        console.log("Socket Connected:", socket.id);
        setIsConnected(true);
      });
  
      socket.on("disconnect", () => {
        console.log("Socket Disconnected");
        setIsConnected(false);
      });
    }
  
    return () => {
      socket.disconnect();
    };
  }, []);
  

  /*   useEffect(() => {
      if (!socket) return;
  
      socket.connect();
  
      socket.on("connect", () => {
        console.log("Socket Connected:", socket.id);
        setIsConnected(true);
      });
  
      socket.on("disconnect", () => {
        console.log("Socket Disconnected");
        setIsConnected(false);
      });
  
      return () => {
        socket.disconnect();
      };
    }, [socket]);
   */
  return (
    <SocketContext.Provider value={{ socket, isConnected, user, setUser }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
