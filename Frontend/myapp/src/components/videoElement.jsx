import React, { useEffect } from "react";
import { getsnap, init, loadModels, stopVideo } from "../utils/face_detect";
import "../styles/videoElement.css";
import { useAppContext } from "../configs/AppContext";

export async function getSnap() {
    return await getsnap();
}

export default function VideoElement() {
  const { video } = useAppContext();

  useEffect(() => {
    async function __init() {
        //   await init();
        await loadModels(init);
      trackChanges();
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopVideo();
        document.querySelector("canvas")?.remove();
        cancelAnimationFrame(video.current);
      } else {
        __init();
      }
    };

    const trackChanges = () => {
      video.current = requestAnimationFrame(trackChanges);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    __init();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopVideo();
      document.querySelector("canvas")?.remove();
      cancelAnimationFrame(video.current);
    };
  }, [video]);

  return (
    <div className="video_container">
      <video
        id="facecam"
        width="680"
        height="560"  
        autoPlay
        muted
      ></video>
    </div>
  );
}