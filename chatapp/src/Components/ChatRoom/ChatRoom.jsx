import React, { useEffect, useState } from 'react';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import { Button, TextField, List, ListItem, Paper, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import './ChatRoom.css';
import { useNavigate } from 'react-router-dom';
import chatbgimg from '../images/hand-drawn-text-messages-two-cellphone-blackboard.jpg';



let stompClient = null;

const ChatRoom = () => {
  const [privateChats, setPrivateChats] = useState(new Map());
  const [publicChats, setPublicChats] = useState([]);
  const [tab, setTab] = useState("CHATROOM");
  const [userData, setUserData] = useState({
    username: '',
    receivername: '',
    connected: false,
    message: ''
  });

  const navigate = useNavigate();
  const handleLeaveRoom = () => {
    navigate('/'); // Navigate to the home page
  };



  useEffect(() => {
    console.log(userData);
  }, [userData]);

  const connect = () => {
    const Sock = new SockJS('http://localhost:8080/ws');
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    setUserData(prevState => ({ ...prevState, connected: true }));
    stompClient.subscribe('/chatroom/public', onMessageReceived);
    stompClient.subscribe(`/user/${userData.username}/private`, onPrivateMessage);
    userJoin();
  };

  const userJoin = () => {
    const chatMessage = {
      senderName: userData.username,
      status: "JOIN"
    };
    stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
  };

  const onMessageReceived = (payload) => {
    const payloadData = JSON.parse(payload.body);
    if (payloadData.status === "JOIN") {
      if (!privateChats.get(payloadData.senderName)) {
        privateChats.set(payloadData.senderName, []);
        setPrivateChats(new Map(privateChats));
      }
    } else if (payloadData.status === "MESSAGE") {
      setPublicChats(prevChats => [...prevChats, payloadData]);
    }
  };

  const onPrivateMessage = (payload) => {
    const payloadData = JSON.parse(payload.body);
    setPrivateChats(prevChats => {
      const updatedChats = new Map(prevChats);
      if (updatedChats.has(payloadData.senderName)) {
        updatedChats.get(payloadData.senderName).push(payloadData);
      } else {
        updatedChats.set(payloadData.senderName, [payloadData]);
      }
      return updatedChats;
    });
  };

  const onError = (err) => {
    console.error(err);
  };

  const handleMessage = (event) => {
    const { value } = event.target;
    setUserData(prevState => ({ ...prevState, message: value }));
  };

  const sendValue = () => {
    if (stompClient && userData.message) {
      const chatMessage = {
        senderName: userData.username,
        message: userData.message,
        status: "MESSAGE"
      };
      stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
      setUserData(prevState => ({ ...prevState, message: '' }));
    }
  };

  const sendPrivateValue = () => {
    if (stompClient && userData.message) {
      const chatMessage = {
        senderName: userData.username,
        receiverName: tab,
        message: userData.message,
        status: "MESSAGE"
      };

      if (userData.username !== tab) {
        privateChats.get(tab).push(chatMessage);
        setPrivateChats(new Map(privateChats));
      }

      stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
      setUserData(prevState => ({ ...prevState, message: '' }));
    }
  };

  const handleUsername = (event) => {
    const { value } = event.target;
    setUserData(prevState => ({ ...prevState, username: value }));
  };

  const registerUser = () => {
    connect();
  };

  return (
    <div className="container">
       {/* <div className='chatroom-BG'>
       <img src={chatbgimg} alt="" />
       </div> */}
      {userData.connected ? (
        <div className="chat-box">
          <div className="member-list">
            <ul>
              <li
                onClick={() => setTab("CHATROOM")}
                className={`member ${tab === "CHATROOM" && "active"}`}
              >
                Chatroom
              </li>
              {[...privateChats.keys()].map((name, index) => (
                <li
                  onClick={() => setTab(name)}
                  className={`member ${tab === name && "active"}`}
                  key={index}
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>

          {tab === "CHATROOM" ? (
            <div className="chat-content">
              <ul className="chat-messages">
                {publicChats.map((chat, index) => (
                  <li
                    className={`message ${chat.senderName === userData.username && "self"}`}
                    key={index}
                  >
                    {chat.senderName !== userData.username && (
                      <div className="avatar">{chat.senderName}</div>
                    )}
                    <div className="message-data">{chat.message}</div>
                    {chat.senderName === userData.username && (
                      <div className="avatar self">{chat.senderName}</div>
                    )}
                  </li>
                ))}
              </ul>

              <div className="send-message">
                <input
                  type="text"
                  className="input-message"
                  placeholder="Enter the message"
                  value={userData.message}
                  onChange={handleMessage}
                />
                <button type="button" className="send-button" onClick={sendValue}>
                  Send
                </button>
              </div>
            </div>
          ) : (
            <div className="chat-content">
              <ul className="chat-messages">
                {[...privateChats.get(tab)].map((chat, index) => (
                  <li
                    className={`message ${chat.senderName === userData.username && "self"}`}
                    key={index}
                  >
                    {chat.senderName !== userData.username && (
                      <div className="avatar">{chat.senderName}</div>
                    )}
                    <div className="message-data">{chat.message}</div>
                    {chat.senderName === userData.username && (
                      <div className="avatar self">{chat.senderName}</div>
                    )}
                  </li>
                ))}
              </ul>

              <div className="send-message">
                <input
                  type="text"
                  className="input-message"
                  placeholder="Enter the message"
                  value={userData.message}
                  onChange={handleMessage}
                />
                <button
                  type="button"
                  className="send-button"
                  onClick={sendPrivateValue}
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="register">
          <input
          
            id="user-name"
            placeholder="Enter your name"
            name="userName"
            value={userData.username}
            onChange={handleUsername}
            margin="normal"
          
          />
           <button 
        type="button" 
        onClick={registerUser} 
        disabled={!userData.username.trim()} // Disable if no name entered
      >
        Connect
      </button>

        </div>
      )}
     <div className="left-chatroom">
      <button onClick={handleLeaveRoom} className="nav-button">
        Left Room
      </button>
    </div>
    </div>
  );
};

export default ChatRoom;
