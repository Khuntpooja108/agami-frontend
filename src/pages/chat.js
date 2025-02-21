import React, { useEffect, useState, useRef } from "react";
import { useSocket } from "../context/SocketContext";
import axiosObj from "../config/Axios";

const Chat = () => {
    const { socket, user } = useSocket();
    const [admins, setAdmins] = useState([]);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!user) return;

        axiosObj.get("/api/admin").then((res) => {
            const filteredAdmins = res.data.data.filter((admin) => admin.id !== user.id);
            setAdmins(filteredAdmins);
        });

        socket.on("receive_message", (data) => {
            console.log("receive called");
            
            if (selectedAdmin?.id === data.senderId || selectedAdmin?.id === data.receiverId) {
                setMessages((prev) => [...prev, data]);
            }
        });

        return () => socket.off("receive_message");
    }, [socket, user, selectedAdmin]);

    useEffect(() => {
        if (!user || !selectedAdmin) return;

        axiosObj
            .get(`/api/messages?receiverId=${selectedAdmin.id}&senderId=${user.id}`)
            .then((res) => {
                setMessages(res.data.messages);
            })
            .catch((err) => console.error("Error fetching messages:", err));
    }, [selectedAdmin, user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView();
    }, [messages]);

    const sendMessage = () => {
        if (!user?.id || !selectedAdmin?.id || !message.trim()) return;

        const msgData = {
            senderId: user.id,
            receiverId: selectedAdmin.id,
            message,
        };

        socket.emit("message", msgData);
        setMessage("");
    };
    return (
        <div className="flex ">

            <div className="w-1/4 bg-gray-100 border-r h-screen flex flex-col ">
                <h2 className="text-xl font-semibold p-4 border-b bg-gray-100 sticky top-[72px] z-20">
                    Chats
                </h2>

                <div className="flex-1 overflow-y-auto">
                    {admins.map((admin) => (
                        <div
                            key={admin.id}
                            onClick={() => setSelectedAdmin(admin)}
                            className={`p-3 cursor-pointer flex items-center hover:bg-gray-200 ${selectedAdmin?.id === admin.id ? "bg-gray-300" : ""
                                }`}
                        >
                            <div className="w-10 h-10 bg-gray-500 text-white rounded-full flex items-center justify-center">
                                {admin.name[0]}
                            </div>
                            <span className="ml-3">{admin.name}</span>
                        </div>
                    ))}
                </div>
            </div>




            <div className="w-3/4 flex flex-col bg-gray-200 h-screen pt-[72px]">
                {selectedAdmin ? (
                    <>
                        <div className="p-4 bg-gray-500 text-white shadow-md flex items-center sticky top-0 z-10">
                            <div className="w-10 h-10 bg-white text-gray-500 rounded-full flex items-center justify-center">
                                {selectedAdmin.name[0]}
                            </div>
                            <h2 className="ml-3 text-lg font-semibold">{selectedAdmin.name}</h2>
                        </div>

                        <div className="flex-1 p-4 overflow-y-auto space-y-2 max-h-full">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex w-full ${(msg.senderId || msg.sender_id) === user.id ? "justify-end" : "justify-start"}`}>
                                    <div className={`p-3 rounded-lg max-w-[75%] break-words ${(msg.senderId || msg.sender_id) === user.id
                                        ? "bg-gray-500 text-white rounded-br-none"
                                        : "bg-white text-black rounded-bl-none"
                                        }`}
                                    >
                                        {msg.message}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 bg-white flex items-center border-t sticky bottom-0">
                            <input
                                type="text"
                                className="flex-1 p-2 border rounded focus:outline-none"
                                placeholder="Type a message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            />
                            <button className="ml-3 bg-gray-500 text-white px-4 py-2 rounded" onClick={sendMessage}>
                                Send
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        Select an admin to start chatting
                    </div>
                )}
            </div>

        </div>
    );
};

export default Chat;
