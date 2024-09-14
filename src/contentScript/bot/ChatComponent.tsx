import React from "react";
import "../../assets/tailwind.css";

import {
  MicIcon,
  School2Icon,
  SendHorizontalIcon,
  LoaderIcon,
  AlertCircleIcon,
  StopCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Smile,
} from "lucide-react";
import { useEffect, useState } from "react";

const faqs = [
  {
    id: 1,
    question: "How do I apply for college?",
    answer:
      "I can help you with your application for college in Rajasthan. First, you should research universities and colleges in Rajasthan offering the course you want to study. You can then apply directly to the college or university of your choice. You can also apply for a scholarship from the Government of Rajasthan, Social Justice, and Empowerment Department.",
  },
  {
    id: 2,
    question: "What are the eligibility criteria?",
    answer:
      "The eligibility criteria for engineering colleges in Rajasthan are based on the marks obtained in a state or national-level entrance exam, followed by a counselling session held online. The Rajasthan Engineering Admission Process (REAP) follows a comprehensive criteria to evaluate candidates for admission to engineering programmes in the state.",
  },
  {
    id: 3,
    question: "How do I get a scholarship?",
    answer:
      "To get a scholarship in Rajasthan, you must have a domicile of Rajasthan. The Rajasthan Scholarship application form is available online. You can apply for the scholarship when college admission starts.",
  },
  {
    id: 4,
    question: "What is the admission deadline?",
    answer:
      "The admission deadline for colleges in Rajasthan varies from college to college. You should check the official website of the college you are interested in to know the admission deadline. Some colleges may have an early admission deadline, while others may have a later deadline. It is important to apply before the deadline to secure your seat in the college.",
  },
  {
    id: 5,
    question: "Can I apply for multiple colleges?",
    answer:
      "Yes, you can apply for multiple colleges in Rajasthan. However, you should check the admission guidelines of each college to know the application process and eligibility criteria. Some colleges may require you to submit separate applications for each course, while others may allow you to apply for multiple courses through a single application form.",
  },
];

export default function ChatComponent({ transcript, videoId }) {
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState("");
  const [loadingIndex, setLoadingIndex] = useState(null); // Track which response is loading

  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [chatState, setChatState] = useState({
    chat: [
      {
        input: "",
        response: "Hi there! How can I help you today?",
      },
    ],
    status: "idle",
  });

  useEffect(() => {
    const generateVectors = async () => {
      const response = await fetch("http://localhost:4500/generate-vectors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcript, videoId }),
      });
      const data = await response.json();
      setChatState((prev) => ({
        chat: [
          ...prev.chat,
          { input: "Generate vectors", response: data.message },
        ],
        status: "loading",
      }));
    };
    generateVectors();
  }, [transcript, videoId]);

  useEffect(() => {
    const element = document.getElementById("chat-section");
    // //scroll to bottom
    // element.scrollTop = element.scrollHeight
    // smooth scroll
    element.scrollTo({ top: element.scrollHeight, behavior: "smooth" });
  }, [questionsAsked]);

  // Request microphone access

  const handleSendMessage = async () => {
    if (inputText.trim()) {
      setChatState((prev) => ({
        chat: [...prev.chat, { input: inputText, response: "" }],
        status: "loading",
      }));

      // Send message to API
      await sendToApi(inputText);
      setInputText("");
    }
  };

  const sendToApi = async (query: string) => {
    console.log("sendToApi", query, videoId);
    const body = {
      query,
      videoId,
    };

    try {
      const response = await fetch("http://localhost:4500/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(`Error: ${errorData.message}`);
        return;
      }

      const data = await response.json();
      setChatState((prev) => {
        const updatedChat = [...prev.chat];
        updatedChat[updatedChat.length - 1].response = data.message;
        return { chat: updatedChat, status: "idle" };
      });
      setError("");
    } catch (err) {
      setError("An error occurred while sending the audio to the API.");
    }
  };

  return (
    <div className="ext-flex ext-h-full ext-flex-col ext-rounded-l-2xl ext-p-4 ext-w-[87%]">
      <div
        id="chat-section"
        className="no-scrollbar ext-flex-grow ext-overflow-y-auto ext-rounded-xl ext-py-4 ext-transition-all ext-duration-300 ext-ease-in-out"
      >
        {chatState.chat.length === 0 && chatState.status !== "loading" ? (
          <div className="ext-flex ext-h-full ext-flex-col ext-items-center ext-justify-center ext-rounded-xl ext-bg-gray-200 ext-p-8 ext-text-center ext-shadow-md">
            <School2Icon size={48} className="ext-text-gray-600" />
            <h2 className="ext-mt-4 ext-text-lg ext-font-semibold ext-text-gray-700">
              How can I assist you today?
            </h2>
          </div>
        ) : (
          <div className="ext-space-y-4">
            {chatState.chat.map((message, index) => (
              <div key={index}>
                {/* User Message */}
                {message.input !== "" && (
                  <div className="ext-flex ext-justify-end">
                    <div className="ext-max-w-xs ext-rounded-lg ext-bg-purple-500 ext-p-3 ext-text-white ext-shadow-md">
                      {message.input}
                    </div>
                  </div>
                )}
                {/* Chatbot Response */}
                <div className="ext-mt-2 ext-flex ext-justify-start">
                  <div className="ext-relative ext-max-w-xs ext-rounded-lg ext-bg-gray-100 ext-p-3 ext-text-gray-900 ext-shadow-md">
                    {loadingIndex === index &&
                    chatState.status === "loading" ? (
                      <div className="ext-flex ext-items-center">loading</div>
                    ) : (
                      message.response
                    )}
                  </div>
                </div>
              </div>
            ))}
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        )}
      </div>

      <div className="ext-mt-4 ext-flex ext-w-full ext-flex-wrap ext-items-center ext-space-x-2 ext-rounded-full ext-border ext-border-gray-300 ext-p-2 ext-shadow-md">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          className="ext-min-w-0 ext-flex-1 ext-rounded-full ext-border-none ext-bg-gray-100 ext-px-4 ext-py-2 ext-text-gray-900 ext-placeholder-gray-500"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSendMessage}
          className="ext-rounded-full ext-bg-purple-500 ext-p-2 ext-hover:bg-purple-600"
        >
          <SendHorizontalIcon color="white" size={20} />
        </button>
      </div>
    </div>
  );
}
