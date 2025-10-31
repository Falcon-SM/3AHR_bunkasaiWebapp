"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRiddles } from "@/app/context/riddleContext";
import Script from "next/script";
import { useRouter } from "next/navigation";

type HintPost = {
    icon?: string;
    name?: string;
    content: string; // 表示用のテキスト（暗号化された画面: ... も含む）
    img?: string;
    img2?: string;
    time?: string;
    // 以下は暗号化投稿専用のメタ情報
    riddleNumber?: number; // 1..4 のどの謎の投稿か
    base64?: string; // 暗号化文字列
    isDecrypted?: boolean; // 復号済みか
};

type Props = {
    children: React.ReactNode;
    saigo: boolean;
}

export default function Toko({ children, saigo }: Props) {
    const { threeIsAnswered, gazo, setGazo, kakunin, setKakunin, ok, setOk } = useRiddles();
    const [posts, setPosts] = useState<HintPost[]>([]);
    const router = useRouter();

    useEffect(() => {
        let h = 0
        let m = 0
        if (Number.isNaN(Number(sessionStorage.h))) {
            h = new Date().getHours();
            m = new Date().getMinutes();
            sessionStorage.h = h;
            sessionStorage.m = m;
        } else {
            h = parseInt(sessionStorage.h);
            m = parseInt(sessionStorage.m);
        }
        setPosts([{
            content: "今日はこまば遺跡に行ってきた！これがあの有名な「かがやきの石板」か、、、",
            time: (h + Math.floor((m - 53) / 60)) + ":" + ("0" + (m + 7) % 60).slice(-2),
            img: "/石板.png"
        },
        { content: "ひらがなって平安時代に漢字を簡略化して生まれたらしいぜ", time: (h + Math.floor((m - 37) / 60)) + ":" + ("0" + (m + 23) % 60).slice(-2) },
        { content: "シタっていう男はひどいうそつきだ。あいつの言うことは信じない方がいい。", time: (h + Math.floor((m - 20) / 60)) + ":" + ("0" + (m + 40) % 60).slice(-2) },
        {
            content: "ケルネル高校の文化祭言ってきた!なぞに落書きして妨害してやったわw",
            time: (h + Math.floor((m - 10) / 60)) + ":" + ("0" + (m + 50) % 60).slice(-2),
            img: "/落書き.jpg"
        },
        { content: "おこめ公園のトイレの入り口からこんな紙見えてビビったwこれは何？謎解き...？", img: "/トイレ.png", img2: "/トイレ のコピー.png", time: h + ":" + ("0" + m).slice(-2) }
        ])
    }, [])
    const [nokori, setnokori] = useState(1800);

    const base64Hint3 = useMemo(() => {
        const hint = "第3問のヒント: 2019年から始まった新しい元号。";
        if (typeof window === "undefined") return "";
        try { return window.btoa(unescape(encodeURIComponent(hint))); } catch { return ""; }
    }, []);
    useEffect(() => {
        if (!Number.isNaN(Number(sessionStorage.zikan))) {
            setnokori(parseInt(sessionStorage.zikan));
        }
        if (Number.isNaN(Number(sessionStorage.zikan))) {
            sessionStorage.sawhint = 0;
        }
    }, [])

    const full = () => {
        document.documentElement.requestFullscreen();
    }

    // 謎3に文字が入ったら暗号化投稿を一度だけ表示
    useEffect(() => {
        const alreadyPosted = posts.some(p => p.base64 === base64Hint3 && p.riddleNumber === 3);
        if (threeIsAnswered && !alreadyPosted && base64Hint3 && !saigo) {
            setPosts((prev) => ([
                ...prev,
                {
                    time: new Date().getHours() + ":" + ("0" + new Date().getMinutes()).slice(-2),
                    content: `俺のアカウント名、俺の本名から来てるんだよね。12個あるうちの10個目っていうことでさ。もし名前がトラだったら3/12なんだなw`,
                },
            ]));
            sessionStorage.timm = new Date().getHours() + ":" + ("0" + new Date().getMinutes()).slice(-2);
        }
    }, [threeIsAnswered]);



    useEffect(() => {
        const timerId = setInterval(() => {
            setnokori((prev) => (prev - 1));
            sessionStorage.zikan = nokori;
        }
            , 1000);
        if (nokori < 0) {
            router.push("/fail")
        }
        return () => clearInterval(timerId)
    }, [nokori])

    

    return (
        <div>
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-8SS8YBH1B6"
                strategy="afterInteractive"
            />
            <Script
                id="gtag-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-8SS8YBH1B6');` }}
            />
            <div
                style={{
                    display: "flex",
                    width: 1100,
                    margin: "40px auto",
                    gap: "32px",
                }}
                onClick={full}
            >
                {/* 左側：SNS風ヒントカード */}
                <div
                    style={{
                        padding: "0 0 0 0",
                        width: 320,
                        borderRadius: "16px",
                        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                        border: "none",

                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    {posts.map((post, idx) => (
                        <div
                            key={`post-${idx}`} // ← keyをユニークに
                            style={{
                                width: "100%",
                                marginBottom: "24px",
                                background: "#000000ff",
                                border: "1px solid #747474ff",
                                borderBottom: "none",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                                padding: "16px 12px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                margin: 0
                            }}
                        >
                            <img
                                src={post.icon ?? "/sampleicon.png"}
                                alt="アカウントアイコン"
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    marginBottom: "8px",
                                    border: "2px solid #48daff",
                                }}
                            />
                            <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "6px" }}>
                                {post.name ?? "Bird41"}<span style={{ fontSize: "0.9rem", fontWeight: 200, color: "gray" }}>　{post.time}</span>
                            </div>
                            <div style={{ fontSize: "0.95rem", textAlign: "center", whiteSpace: "pre-line", lineHeight: 1.6, wordBreak: "break-all", overflowWrap: "anywhere" }}>
                                {post.content}
                            </div>
                            {post.img !== undefined &&
                                <img
                                    src={post.img}
                                    onClick={() => { setGazo((post.img ?? "a")) }}
                                    style={{
                                        width: 250,
                                        borderRadius: "5%",
                                        marginTop: "8px",
                                    }}
                                />}
                            {post.img2 !== undefined &&
                                <img
                                    src={post.img2}
                                    onClick={() => { setGazo((post.img2 ?? "a")) }}
                                    style={{
                                        width: 250,
                                        borderRadius: "5%",
                                        marginTop: "8px",
                                    }}
                                />
                            }

                        </div>
                    ))}
                    <div style={{ borderTop: "1px solid #747474ff", width: "340px" }}></div>
                </div>

                {/* 右側：謎解き本体 */}
                <div
                    className="container"
                    style={{
                        flex: 1
                    }}
                >
                    <h1 style={{ textAlign: "center", marginBottom: 24, fontWeight: 400, color: "white", letterSpacing: 0.3, fontSize: 35 }}>
                        問題</h1>
                    {children}
                </div>

                <p style={{
                    background: "#000000ff",
                    borderRadius: "8px",
                    border: "2px solid #00eeffff",
                    fontSize: "50px",
                    padding: "5px",
                    margin: "0px auto",
                    height: 60,
                    width: 140,
                    textAlign: "center"

                }}>{`${nokori / 60 | 0}:${("0" + nokori % 60).slice(-2)}`}</p>
            </div>
            {!(gazo === "n") &&
                <div onClick={() => { setGazo("n") }} style={{ position: "fixed", backgroundColor: "rgba(153, 153, 153, 0.4)", left: "0px", top: "0px", width: "100vw", height: "100vh" }}>
                    <button style={{ position: "fixed", top: 0, right: 0 }} onClick={() => { setGazo("n") }} className="batu">x</button>
                    <img src={gazo} style={{ position: "fixed", width: "calc(100vw - 100px)", height: "calc(100vh - 100px)", top: "50px", left: "50px", objectFit: "contain" }}></img></div>}
            {kakunin &&
                <div style={{
                    position: "fixed",
                    top: 0, left: 0, right: 0, bottom: 0,
                    width: "100vw",
                    height: "100vh",
                    background: "rgba(153, 153, 153, 0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000
                }}>
                    <div style={{
                        background: "#000000ff",
                        padding: "32px",
                        borderRadius: "12px",
                        boxShadow: "0 4px 24px rgba(102, 102, 102, 0.18)",
                        maxWidth: "90vw",
                        textAlign: "center"
                    }}>
                        <h3 style={{ marginBottom: "16px" }}>次は答えが表示されます。<br/>本当にヒントを見ますか？</h3>
                        <button
                            onClick={() => {setKakunin(false);setOk(false)}}
                            style={{
                                padding: "10px 32px",
                                background: "#000",
                                color: "#48daff",
                                border: "2px solid #48daff",
                                borderRadius: "6px",
                                fontWeight: 600,
                                cursor: "pointer",
                                fontSize: "1rem",
                                marginRight: "16px"
                            }}
                        >
                            いいえ
                        </button>

                        <button
                            onClick={()=>{setKakunin(false);setOk(true)}}
                            style={{
                                padding: "10px 32px",
                                background: "#48daff",
                                color: "#000",
                                border: "none",
                                borderRadius: "6px",
                                fontWeight: 600,
                                cursor: "pointer",
                                fontSize: "1rem"
                            }}
                        >
                            はい
                        </button>

                    </div>
                </div>
            }
        </div>
    );
}