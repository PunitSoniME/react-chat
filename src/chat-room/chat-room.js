import React, { useState, useEffect, useRef } from 'react';
import './chat-room.css';

export default function ChatRoom({ socket, onLogout }) {

    const msgRef = useRef();
    const [chats, setChats] = useState([]);
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState(null);

    useEffect(() => {

        socket.on("on-user-add", (msg) => {
            setChats((oldChats) => {
                return [...oldChats, { username: msg.username, message: msg.message, type: msg.type }];
            });

            setTimeout(() => {
                window.scrollTo(0, document.body.scrollHeight);
            }, 100);
        });

        socket.on("on-receive-message", (msg) => {
            setChats((oldChats) => {
                return [...oldChats, { username: msg.username, message: msg.message, type: msg.type }];
            });

            setTimeout(() => {
                window.scrollTo(0, document.body.scrollHeight);
            }, 100);
        });

        socket.on("on-logout", (msg) => {
            setChats((oldChats) => {
                return [...oldChats, { username: msg.username, message: msg.message, type: msg.type }];
            });

            setTimeout(() => {
                window.scrollTo(0, document.body.scrollHeight);
            }, 100);
        });

        setUsername(localStorage.getItem("username"));

        return function cleanup() {
            socket = null;
            onLogout = () => null;
        };

    }, []);

    function sendMessage() {
        socket.emit("send-message", { username: username, message: message });
        setMessage('');

        msgRef.current.focus();
    }

    function logout() {
        socket.emit("logout", username);
        localStorage.removeItem("username");
        onLogout();
    }

    return (
        <div className="chatroom">

            <div className="chats">
                <div className="chatting">
                    {
                        chats.map((chat) => {
                            if (chat.username) {
                                if (username == chat.username) {
                                    return <div className="message my-message text-right" key={Math.random()}>
                                        <span>{chat.message}</span>
                                    </div>
                                }
                                else {
                                    return <div className="message others-message" key={Math.random()}>
                                        <span><b className="text-black">{chat.username}:</b> {chat.message}</span>
                                    </div>
                                }
                            }
                            else {
                                let msgClass = chat.type == "new-user" ? "text-success" : "text-danger";
                                msgClass = `message text-center ${msgClass}`;

                                return <div className={msgClass} key={Math.random()}>
                                    {chat.message}
                                </div>

                            }
                        })
                    }
                </div>

            </div>
            <div className="send-message">
                <label className="username-label">{username}</label>
                <input type="text" ref={msgRef} className="input-message" value={message} placeholder="Enter Message" onChange={(ev) => setMessage(ev.target.value)} />
                <button type="button" className="button send-button" onClick={sendMessage}
                    disabled={message && message.trim() != '' ? '' : 'disabled'}>Send</button>
                <button type="button" className="button danger" onClick={logout}>Logout</button>
            </div>

        </div>
    )
}
