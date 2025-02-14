import { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useSocket } from "../context/SocketContext";

function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { socket, isConnected } = useSocket();


  useEffect(() => {
    const sendMessage = () => {
      if (socket.id) {
        socket.emit("message", "My id is: " + socket.id);
      }
    };

    if (socket.connected) {
      sendMessage();
    } else {
      socket.on("connect", sendMessage);
    }

  }, [socket]);
  return (
    <div className="">
      <p>Welcome to the Employee Management System.</p>
    </div>
  );
}
export default HomePage