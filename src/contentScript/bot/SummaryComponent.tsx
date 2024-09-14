import React, { useCallback, useEffect, useState } from "react";
import "../../assets/tailwind.css";

const SummaryComponent = ({ transcript, videoId }) => {
  const [summary, setSummary] = useState("");
  console.log("SummaryComponent", transcript);
  const getApiResponse = useCallback(async () => {
    const res = await fetch("http://localhost:4500/summary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transcript, videoId }),
    });

    const data = await res.json();

    // id loading true, show ... in the bot message
    if (res.status === 200) {
      setSummary(data.message);
    }

    return "Sorry, I am not able to understand your query";
  }, [transcript]);

  useEffect(() => {
    getApiResponse();
  }, [transcript]);

  return <div className="ext-w-[87%] ext-bg-lime-300  ext-p-4">{summary}</div>;
};

export default React.memo(SummaryComponent);
