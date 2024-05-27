import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { FiCopy, FiUser, FiSmartphone } from "react-icons/fi";
import reactLogo from "./assets/react.svg";
import "./index.css";

function App() {
  const [response, setResponse] = useState("");
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const askQuestion = async () => {
    if (question.trim() === "") return;
    setLoading(true);
    const res = await fetch(`/chat?${encodeURIComponent(question)}`);
    const text = await res.text();
    const timestamp = new Date().toLocaleTimeString();
    setChatHistory([
      ...chatHistory,
      { question, response: null, timestamp, type: "user" },
      { question: null, response: text, timestamp, type: "bot" },
    ]);
    setQuestion("");
    setLoading(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        Swal.fire({
          icon: "success",
          title: "Copied!",
          text: "Code copied to clipboard",
          showConfirmButton: false,
          timer: 1500,
        });
      },
      (err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to copy!",
        });
        console.error("Failed to copy: ", err);
      }
    );
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const renderResponse = (response) => {
    const codeRegex = /```(.*?)```/gs;
    const parts = response.split(codeRegex);

    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // This is code
        return (
          <div
            key={index}
            className="relative bg-gray-900 text-white p-3 rounded-r-lg rounded-bl-lg my-2"
          >
            <pre className="whitespace-pre-wrap">
              <code>{part}</code>
            </pre>
            <button
              onClick={() => copyToClipboard(part)}
              className="absolute top-1 right-1 bg-gray-500 text-white p-1 rounded-lg hover:bg-gray-700 flex items-center"
            >
              <FiCopy className="mr-1" /> Copy
            </button>
          </div>
        );
      } else {
        // This is normal text
        return (
          <span key={index} className="text-gray-800 my-2">
            {part}
          </span>
        );
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen min-h-screen bg-gray-100 text-gray-800 p-10">
      <div className="flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="flex flex-col flex-grow h-0 p-4 overflow-auto">
          {chatHistory.map((chat, index) => (
            <div
              key={index}
              className={`flex w-full mt-2 space-x-3 max-w-xs ${
                chat.type === "bot" ? "ml-auto justify-end" : ""
              }`}
            >
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                {chat.type === "user" ? (
                  <FiUser className="text-gray-700" />
                ) : (
                  <FiSmartphone className="text-gray-700" />
                )}
              </div>
              <div>
                <div
                  className={`p-3 ${
                    chat.type === "bot"
                      ? "bg-gray-300 text-white rounded-l-lg rounded-br-lg"
                      : "bg-gray-200 rounded-r-lg rounded-bl-lg"
                  }`}
                >
                  {chat.question && <p className="text-sm">{chat.question}</p>}
                  {chat.response && (
                    <div className="text-sm">
                      {renderResponse(chat.response)}
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-500 leading-none">
                  {chat.timestamp}
                </span>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
              <div className="bg-yellow-100 p-2 rounded-lg mt-2">
                <p className="text-yellow-800">
                  <strong>Bot:</strong> Waiting for Llama...
                </p>
              </div>
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <FiSmartphone className="text-gray-700" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div className="bg-gray-300 p-4">
          <input
            className="flex items-center h-10 w-full rounded px-3 text-sm"
            type="text"
            placeholder="Type your message…"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && askQuestion()}
            disabled={loading} // Disable input while loading
          />
        </div>
      </div>
    </div>
  );
}

export default App;
