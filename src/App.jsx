import React, { useState, useEffect, useRef } from "react";
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
    setChatHistory([...chatHistory, { question, response: text }]);
    setQuestion("");
    setLoading(false);
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex space-x-4 mb-8">
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="w-16 h-16" alt="React logo" />
        </a>
      </div>
      <h1 className="text-3xl font-bold mb-8">Chat with LLM</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="h-64 overflow-y-auto mb-4">
          {chatHistory.map((chat, index) => (
            <div key={index} className="mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <p className="text-blue-800">
                  <strong>You:</strong> {chat.question}
                </p>
              </div>
              <div className="bg-gray-100 p-2 rounded-lg mt-2">
                <p className="text-gray-800">
                  <strong>Bot:</strong> {chat.response}
                </p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="bg-yellow-100 p-2 rounded-lg mt-2">
              <p className="text-yellow-800">
                <strong>Bot:</strong> Waiting for Llama...
              </p>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question"
          className="border border-gray-300 p-2 rounded-lg mb-4 w-full"
          onKeyPress={(e) => e.key === "Enter" && askQuestion()}
          disabled={loading} // Disable input while loading
        />
        <button
          onClick={askQuestion}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full flex items-center justify-center"
          disabled={loading} // Disable the button while loading
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 mr-3 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          ) : (
            "Ask"
          )}
        </button>
      </div>
    </div>
  );
}

export default App;
