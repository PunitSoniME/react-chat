import React, { useState, useEffect } from "react";
import socketIOClient from 'socket.io-client';
import ChatRoom from './chat-room/chat-room';
import './App.css';

let socket = socketIOClient('http://localhost:5001', { transports: ['websocket'] });

function App() {
  const [username, setUsername] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {

    socket.on('connection', () => {

    });

    const username = localStorage.getItem("username");
    if (username) {
      setIsLoggedIn(true);
    }

    socket.on('disconnect', () => {

    });

  }, []);

  function addUser() {
    if (username && username.trim() != "") {

      if (socket.disconnected == true) {
        socket.connect();
      }

      localStorage.setItem("username", username);
      setIsLoggedIn(true);
      socket.emit("add-user", username);
    }
    else {
      alert("Please enter any username for identity");
    }
  }

  function onLogout() {
    socket.disconnect();
    setIsLoggedIn(false);
    setUsername('');
  }

  return (
    <>
      {
        !isLoggedIn ?
          <div className="register">
            <div className="user-control">
              <input className="input-control" type="text" placeholder="Enter Username" onChange={(ev) => setUsername(ev.target.value)} />
              <button className="add-user cursor-pointer" type="button" onClick={addUser}>Add User</button>
            </div>
          </div>
          :
          <ChatRoom socket={socket} onLogout={onLogout} />
      }
    </>
  );
}

export default App;