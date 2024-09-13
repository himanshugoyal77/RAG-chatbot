import {
  MessageSquareText,
  MessageSquareTextIcon,
  School,
  X,
} from "lucide-react";
import React, { useState } from "react";
import SummaryComponent from "./SummaryComponent";
import ChatComponent from "./ChatComponent";
import "../../assets/tailwind.css";

function BotModel({ toggleModel }) {
  const [currentTab, setCurrentTab] = useState("chat");
  console.log("BotModel");
  function summaryModule() {
    setCurrentTab("summary");
  }

  function chatModule() {
    setCurrentTab("chat");
  }

  return (
    <div
      className="ext-relative z-[999999999999px] ext-flex ext-h-full ext-w-[400px] ext-bg-[#2f2f2f] 
    ext-rounded-2xl ext-md:h-[70vh] ext-md:w-[100%]"
    >
      <div className="w-[87%] md:w-[90%] ext-flex-grow">
        {currentTab === "summary" && <SummaryComponent />}
        {currentTab === "chat" && <ChatComponent />}
      </div>
      <div
        className="
      ext-absolute ext-right-0 ext-bottom-0 ext-top-0 ext-flex ext-w-[13%] ext-flex-col ext-items-center
      ext-justify-start
      ext-space-y-3 ext-rounded-r-2xl ext-bg-gray-100 ext-px-2 ext-md:w-[10%]"
      >
        <button
          onClick={toggleModel}
          className="
        tooltip tooltip-left ext-flex ext-items-center ext-justify-center ext-gap-4 ext-rounded-md ext-py-2 ext-hover:scale-95 ext-hover:rounded-xl ext-hover:bg-white ext-md:px-2 ext-lg:justify-start 
        ext-hover:scale-110"
        >
          <X strokeWidth={3} />
        </button>
        <button
          onClick={summaryModule}
          data-tip="Chat"
          className={`tooltip tooltip-left ext-flex ext-items-center ext-justify-center ext-gap-4 ext-rounded-md ext-py-2 ext-hover:scale-95 ext-hover:rounded-xl ext-hover:bg-white ext-md:px-2 ext-lg:justify-start ${
            currentTab === "summary" ? "ext-text-purple-500" : ""
          }`}
        >
          <MessageSquareText strokeWidth={3} />
        </button>
        <button
          onClick={chatModule}
          data-tip="College Recommendations"
          className={`tooltip tooltip-left ext-flex ext-items-center ext-justify-center ext-gap-4 ext-rounded-md ext-py-2 
            ext-hover:scale-95 ext-hover:rounded-xl ext-hover:bg-white ext-md:px-2 ext-lg:justify-start ${
              currentTab === "chat" ? "ext-text-purple-500" : ""
            }`}
        >
          <School strokeWidth={2} />
        </button>
        <div className="ext-flex-grow"></div>
      </div>
    </div>
  );
}

export default BotModel;
