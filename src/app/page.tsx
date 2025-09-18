/*
import { microcms } from "@/lib/microcms";

type PageContent = {
  title: string;
  content: string;
};

type MicroCMSResponse = {
  contents: PageContent[];
};

export default async function Home() {
  // API からデータを取得
  const data: MicroCMSResponse = await microcms.get<MicroCMSResponse>({
    endpoint: "intro",
    queries: { limit: 1 },
  });

  const item = data.contents[0];

  return (
    <div className="container">
      <h2 dangerouslySetInnerHTML={
        { __html: item.title }} />
      <p>{item.content}</p>
      <div style={{ margin: "32px 0" }}>
        <video
          controls
          width="100%"
          style={{
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
          }}
        >
          <source src="/BunkasaiVideo1.mov" type="video/mp4" />
          お使いのブラウザは動画再生に対応していません。
        </video>
      </div>
      <a href="/riddles/1">謎解きを始める</a>
    </div>
  );
}
  */

// src/app/page.tsx
"use client"; // クライアントコンポーネントであることを宣言

import { useEffect, useState } from "react";
import { microcms } from "@/lib/microcms";

type PageContent = {
  title: string;
  content: string;
};

type MicroCMSResponse = {
  contents: PageContent[];
};

export default function Home() {
  const [data, setData] = useState<MicroCMSResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // ネットワーク状態の監視
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

    // 初期状態をセット
    setIsOnline(navigator.onLine);

    // APIからデータを取得する非同期関数
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (!navigator.onLine) {
          throw new Error("Offline");
        }
        const response: MicroCMSResponse = await microcms.get<MicroCMSResponse>({
          endpoint: "intro",
          queries: { limit: 1 },
        });
        setData(response);
      } catch (error) {
        // オフライン時や通信エラー時にデータ取得を中断
        setIsOnline(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
    };
  }, []);

  if (!isOnline) {
    return (
    <div className="container">
      <h2>こんにちは！3AHRへようこそ！</h2>
      <p>オフラインモードで続行します</p>
      <div style={{ margin: "32px 0" }}>
        <video
          controls
          width="100%"
          style={{
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
          }}
        >
          <source src="/BunkasaiVideo1.mov" type="video/mp4" />
          お使いのブラウザは動画再生に対応していません。
        </video>
      </div>
      <a href="/riddles/1">謎解きを始める</a>
    </div>
  );
    
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!data || data.contents.length === 0) {
    return <p>データが見つかりませんでした。</p>;
  }

  const item = data.contents[0];

  return (
    <div className="container">
      <h2 dangerouslySetInnerHTML={{ __html: item.title }} />
      <p>{item.content}</p>
      <div style={{ margin: "32px 0" }}>
        <video
          controls
          width="100%"
          style={{
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
          }}
        >
          <source src="/BunkasaiVideo1.mov" type="video/mp4" />
          お使いのブラウザは動画再生に対応していません。
        </video>
      </div>
      <a href="/riddles/1">謎解きを始める</a>
    </div>
  );
}
