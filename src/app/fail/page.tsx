"use client";

import { useEffect, useState, useRef } from "react";
//import { microcms } from "@/lib/microcms";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useRiddles } from "../context/riddleContext";

type PageContent = {
  title: string;
  content: string;
};

/*type MicroCMSResponse = {
  contents: PageContent[];
};*/

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { setStartTime, setPaused } = useRiddles();

  const handleStartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleModalOk = () => {
    setShowModal(false);
    try {
      // stop client-side updater immediately when moving on
      setStartTime(null);
      setPaused(true);
    } catch (e) {
      console.warn("could not set pause/startTime from fail page", e);
    }
    router.push("/final");
  };

  const handleVideoEnded = () => {
    setVideoEnded(true);
  };
  // ensure the timer/updater is paused as soon as this page mounts
  useEffect(() => {
    try {
      setStartTime(null);
      setPaused(true);
    } catch (e) {
      console.warn('could not set pause/startTime on fail mount', e);
    }
  }, [setStartTime, setPaused]);
  useEffect(() => {
      const handleBeforeUnload = (event: BeforeUnloadEvent) => {
          localStorage.pagen=4;
          localStorage.zikan=sessionStorage.zikan;
          localStorage.sawhint=sessionStorage.sawhint;
          event.preventDefault();
          // Chromeなどでは returnValue の設定が必要
          event.returnValue = "";
      };
  
      window.addEventListener("beforeunload", handleBeforeUnload);
  
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }, []);

  return (
    <div className="container">
      <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8SS8YBH1B6"
          strategy="afterInteractive"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-8SS8YBH1B6');` }}
        />
      <h2/>
      <div style={{ margin: "32px 0" }}>
        <video
          controls
          width="100%"
          style={{
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
          }}
          ref={videoRef}
          onEnded={handleVideoEnded}
        >
          <source src="/BunkasaiVideo3.mp4" type="video/mp4" />
          お使いのブラウザは動画再生に対応していません。別のブラウザをお試しください。
        </video>
      </div>
      {videoEnded && (
        <button
          onClick={handleModalOk}
          className="botan"
        >
          次へ
        </button>
          )}
    </div>
  );
}
