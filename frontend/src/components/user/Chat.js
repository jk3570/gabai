import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaGripLinesVertical } from "react-icons/fa";
import { BsSend } from "react-icons/bs";
import Markdown from 'markdown-to-jsx';
import RequestForm from '../RequestForm';
import { useAuthContext } from '../../hooks/useAuthContext';
import ChatSidebar from './ChatSidebar';
import { BaseURL } from "../../BaseURL"

const ChatComponent = () => {
  const { user } = useAuthContext();

  const userid = user?.userid || 'guest';
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSendDisabled, setIsSendDisabled] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversationId, setConversationId] = useState('');
  const [conversationTitles, setConversationTitles] = useState([]);
  const [summary, setSummary] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestMeetingClicked, setRequestMeetingClicked] = useState(false);
  const [showRequestButton, setShowRequestButton] = useState(false);
  const [inputVisible, setInputVisible] = useState(true); // State to control input visibility

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
    setConversationId('');
    fetchConversationTitles();
  };

  const fetchConversationTitles = () => {
    axios.get(`${BaseURL}/gab/conversations/${userid}`)
      .then(response => {
        setConversationTitles(response.data);
      })
      .catch(error => console.error('Error fetching conversation titles:', error));
  };

  const handleConversationClick = (conversationId) => {
    axios.get(`${BaseURL}/gab/conversation/${conversationId}`)
      .then(response => {
        setMessages(response.data.messages);
        setConversationId(conversationId);
      })
      .catch(error => console.error('Error fetching conversation:', error));
  };

  const sendMessage = () => {
    if (input.trim() !== '') {
      const newMessage = { role: 'user', content: input };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInput('');

      axios.post(`${BaseURL}/gab/conversation`, { input, conversationId, userid: userid})
        .then(response => {
          const aiMessage = { role: 'assistant', content: response.data.message };
          setMessages(prevMessages => [...prevMessages, aiMessage]);

          if (!conversationId) {
            setConversationId(response.data.conversationId);
          }

          setSummary(response.data.summary);

          if (response.data.message.includes("Thank you for confirming. You can now request a video conference")) {
            setShowRequestButton(true);
            setInputVisible(false); // Hide the input field
          }

        })
        .catch(error => console.error('Error:', error));
    } else {
      console.error('Error: Empty input');
    }
  };

  useEffect(() => {
    setIsSendDisabled(input === '');
  }, [input]);

  useEffect(() => {
    fetchConversationTitles();
  }, []);

  const chatContentRef = useRef(null);

  useEffect(() => {
    // Scrolls to the bottom of the chat container
    chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
  }, [messages]); // Re-runs when messages change

  return (
    <div className="relative z-10 w-full h-screen flex flex-row justify-start items-start">
      <div className="flex flex-row w-full h-screen bg-bkg">
        {/* Chat History Sidebar */}
        <div
          id="chat-history"
          className={`transition-all overflow-hidden ${sidebarOpen ? 'w-0' : 'w-full md:w-64'} h-full bg-bkg z-50 shadow-lg left-0 top-0`}
        >
          <ChatSidebar
            handleNewChat={handleNewChat}
            handleConversationClick={handleConversationClick}
            conversationTitles={conversationTitles}
            setShowRequestButton={setShowRequestButton}
          />
        </div>

        {/* Toggle Sidebar  */}
        <div className="relative z-50 flex h-full items-center justify-center cursor-pointer bg-bkg" onClick={toggleSidebar}>
          <FaGripLinesVertical className="text-label text-2xl" />
        </div>

        {/* Chat Conversation */}
        <div id="chat-content" className={`flex flex-col h-full ${sidebarOpen ? 'w-full' : 'w-0 md:w-full'} mx-auto max-w-4xl justify-between pt-[3.875rem]`}>
          <div ref={chatContentRef} className="h-full overflow-y-auto flex flex-col gap-2 p-5 pt-7">
            {messages.map((message, index) => (
              <div className="p-5 bg-gray-400 bg-opacity-20 rounded-xl animate__animated text-content" key={index}>
                <p><b>{message.role === 'user' ? 'You' : 'Gab'}</b></p>
                <p><Markdown>{message.content}</Markdown></p>
              </div>
            ))}
          </div>
          <div className="relative items-center">
            <div className="flex flex-col justify-center items-center">
              {showRequestButton && !requestMeetingClicked ? (
                <>
                  <button className="flex h-10 w-[50%] px-3 py-2 bg-azure text-white rounded-md justify-center items-center text-sm transition-all duration-100 ease-in-out hover:bg-azure-300" onClick={() => setShowRequestForm(true) || setRequestMeetingClicked(true)}>Request a video conference</button>
                  <button className="flex h-10 w-[50%] px-3 py-2 bg-white border border-azure text-azure rounded-md justify-center items-center text-sm transition-all duration-100 ease-in-out my-2" onClick={() => {
                    setInputVisible(true); // Show the input field
                    setShowRequestButton(false); // Hide the buttons
                  }}>Continue the conversation</button>
                </>
              ) : (
                <>
                  {inputVisible && (
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        sendMessage();
                      }}
                      className="flex flex-row gap-1 bottom-0 w-full py-2 px-2"
                    >
                      <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        className="p-3 border-2 border-gray-500 border-opacity-50 rounded-full w-full bg-bkg text-content"
                        placeholder="Type your message here"
                      />
                      <button
                        type="submit"
                        id="sendBtn"
                        disabled={isSendDisabled}
                        className={
                          isSendDisabled
                            ? 'relative pb-1 pl-1 p-2 text-center text-2xl justify-center ml-2 my-2 rounded-full bg-gray-400 text-white right-0'
                            : 'relative pb-1 pl-1 p-2 text-center text-2xl justify-center ml-2 my-2 rounded-full bg-azure-500 text-white right-0'
                        }>
                        <BsSend className="h-[1em] w-[1em]" />
                      </button>
                    </form>
                  )}
                  <div className="flex justify-center items-center pb-3">
                    <p className="text-gray-400 text-xs">
                      All conversations are completely confidential.
                    </p>
                  </div>
                </>
              )}
            </div>
            {showRequestForm && <RequestForm summary={summary} onClose={() => { setShowRequestForm(false); setRequestMeetingClicked(false); }} />}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
