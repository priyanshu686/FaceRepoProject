import React, { useEffect } from "react";
import { getsnap, init, loadModels, stopVideo } from "../utils/face_detect";
import "../styles/videoElement.css";
import { useAppContext } from "../configs/AppContext";

export async function getSnap() {
    return await getsnap();
}

export default function VideoElement() {
  const { video } = useAppContext();
  const ref = React.useRef();
  const [loaded, setLoaded]= React.useState(false);

  const func = React.useCallback(() => {
    async function __init() {
      console.log('loading')
        //   await init();
        setLoaded(false)
        await loadModels(init);
      trackChanges();
      setLoaded(true)
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

  useEffect(()=>{
    if(ref.current){
      // console.log(ref.current)
      ref.current.style.display = "block"
      ref.current.style.position = "sticky"
      setLoaded(true)
      func()
    }
  },[ref]);

  return (
    <div className="video_container">
      {
        !loaded &&
        <div id="Loader"><div className="child"></div></div>
      }
      <video
        id="facecam"
        width="680"
        height="560"  
        autoPlay
        muted
        style={{
          display:"none"
        }}
        ref={ref}
      ></video>
    </div>
  );
}