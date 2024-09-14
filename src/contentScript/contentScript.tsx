import React, { useCallback, useEffect, useRef, useState } from "react";
import "../assets/tailwind.css";
import BotModel from "./bot/botModel";
import { X } from "lucide-react";
import { YoutubeTranscript } from "youtube-transcript";

const ContentScript = () => {
  const chatbotRef = useRef(null);
  const [showModel, setShowModel] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isYoutube, setIsYoutube] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [videoId, setVideoId] = useState("");

  const [position, setPosition] = useState({
    x: window.innerWidth - 100,
    y: window.innerHeight - 100,
  });

  let videUrl = window.location.href;
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { type, value, videoId, url } = message;
    videUrl = url;
    if (type === "NEW") {
      setIsYoutube(true);
      // wait for page to load
      setTimeout(() => {
        const progressIndicator = document.querySelectorAll(
          ".style-scope.ytd-thumbnail-overlay-resume-playback-renderer"
        );
        console.log("progressIndicator", progressIndicator.length);
        if (progressIndicator.length > 0) {
          progressIndicator.forEach((element) => {
            const htmlElement = element as HTMLElement;
            htmlElement.style.zIndex = "0";
          });
        }
      }, 2000);

      console.log("videoId", videoId);
      setVideoId(videoId);
    }
  });

  const getTranscript = useCallback(async () => {
    YoutubeTranscript.fetchTranscript(videoId)
      .then((res) =>
        res.forEach((item) => setTranscript((prev) => [...prev, item.text]))
      )
      .catch((err) => console.log(err));
  }, [videoId]);

  useEffect(() => {
    if (!isYoutube) return;

    getTranscript();
    console.log("getTranscript", transcript);
  }, [videoId]);

  // useEffect(() => {
  //   if (!isYoutube && !videoId) return;
  //   const getTranscript = useCallback(async () => {
  //     YoutubeTranscript.fetchTranscript(videoId)
  //       .then((res) =>
  //         res.forEach((item) => setTranscript((prev) => [...prev, item.text]))
  //       )
  //       .catch((err) => console.log(err));
  //   }, [videoId]);

  //   console.log("getTranscript", getTranscript);

  //   getTranscript();
  // }, [videoId]);

  const handleDragStart = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragMove = (event) => {
    if (isDragging) {
      const x = event.clientX - chatbotRef.current.offsetWidth / 2;
      const y = event.clientY - chatbotRef.current.offsetHeight / 2;
      setPosition({ x, y });
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const toggleModel = () => {
    console.log("toggleModel", showModel);
    setShowModel(!showModel);
  };
  console.log("position", position.x);
  return (
    <>
      <div
        ref={chatbotRef}
        onClick={toggleModel}
        className="ext-fixed ext-bottom-0 ext-right-0 ext-h-16 ext-w-16 ext-z-[999999999px] ext-bg-gradient-to-r ext-from-slate-900 ext-to-slate-700 ext-text-white ext-flex ext-items-center ext-justify-center ext-rounded-full 
       bot-icon ext-cursor-pointer ext-shadow-lg ext-transition-transform ext-duration-300
       "
        style={{
          left: position.x,
          top: position.y,
          height: isYoutube ? "80px" : "default",
          width: isYoutube ? "80px" : "default",
        }}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        <img
          className="ext-overflow-hidden ext-h-16 ext-w-16 ext-rounded-full ext-object-cover"
          src={
            "https://firebasestorage.googleapis.com/v0/b/devignite-5823b.appspot.com/o/image.png?alt=media&token=52cd7c4d-6a7b-48a4-b089-2672a6117947"
          }
          alt=""
        />
      </div>
      {showModel && (
        <div
          style={{
            left: position.x < 348 ? position.x : position.x - 348,
            top: position.y - window.innerHeight / 2 - 80,
          }}
          className="ext-w-[400px] ext-fixed ext-bottom-3 ext-right-5 ext-flex ext-h-[60vh] ext-items-center ext-justify-center ext-rounded-2xl ext-md:bottom-10 ext-md:right-10 ext-md:h-[70vh] ext-md:w-[30%]"
        >
          <BotModel
            toggleModel={toggleModel}
            transcript={transcript.join(" ")}
            videoId={videoId}
          />
        </div>
      )}
    </>
  );
};

export default ContentScript;
