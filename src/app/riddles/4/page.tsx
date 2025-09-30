"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRiddles } from "@/app/context/riddleContext";

export default function Home() {
    const { fourIsAnswered, incrementDecryptCount, decryptCounts } = useRiddles();
    const [posts, setPosts] = useState([
        { icon: "/sampleicon.png", name: "Riddlemaster", content: "謎を解いていくと、ここに新しい投稿が表示されます！" },
    ]);
    const [decodeComment, setDecodeComment] = useState("");
    const [hasDecrypted, setHasDecrypted] = useState(false);

    // Base64暗号テキスト（第4問用）
    const base64Hint = useMemo(() => {
        const hint = "第4問のヒント: 東北地方の太平洋沖が震源の大規模地震。";
        if (typeof window === "undefined") return "";
        try { return window.btoa(unescape(encodeURIComponent(hint))); } catch { return ""; }
    }, []);

    // 4問目に文字が入ったら暗号投稿
    useEffect(() => {
        if (fourIsAnswered && posts.length === 1 && base64Hint) {
            setPosts((prev) => ([
                ...prev,
                { icon: "/sampleicon.png", name: "Riddlemaster", content: `暗号化された画面: ${base64Hint}` },
            ]));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fourIsAnswered, base64Hint]);

    const handleDecodeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cmd = decodeComment.trim();
        if (!cmd) return;
        if (cmd === "復号する" && !hasDecrypted) {
            try {
                const decoded = decodeURIComponent(escape(window.atob(base64Hint)));
                setPosts((prev) => {
                    const next = [...prev];
                    if (next[1]) next[1] = { ...next[1], content: decoded };
                    return next;
                });
                setHasDecrypted(true);
                incrementDecryptCount(4);
                try {
                    const stored = JSON.parse(localStorage.getItem("decryptCounts") || "{}");
                    stored[4] = (stored[4] || 0) + 1;
                    localStorage.setItem("decryptCounts", JSON.stringify(stored));
                } catch { }
            } catch { }
        } else {
            setPosts((prev) => ([
                ...prev,
                { icon: "/sampleicon.png", name: "Riddlemaster", content: "コマンドが違うみたい。「復号する」と入力して送信してね。" },
            ]));
        }
        setDecodeComment("");
    };

    return (
        <div style={{ maxWidth: 900, margin: "40px auto", padding: "32px" }}>
            <h1 style={{ textAlign: "center", marginBottom: 24, fontWeight: 800, color: "#1f2937" }}>謎4</h1>
            <div style={{ width: 320, margin: "0 auto", background: "#f6f8fb", borderRadius: "16px", boxShadow: "0 6px 18px rgba(0,0,0,0.08)", padding: "20px 14px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                {posts.map((post, idx) => (
                    <div key={`post-${idx}`} style={{ width: "100%", marginBottom: "24px", background: "#fff", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", padding: "16px 12px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <img src={post.icon} alt="アカウントアイコン" style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", marginBottom: "8px", border: "2px solid #0984e3" }} />
                        <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "6px" }}>{post.name}</div>
                        <div style={{ color: "#4b5563", fontSize: "0.95rem", textAlign: "center", whiteSpace: "pre-line", lineHeight: 1.6 }}>{post.content}</div>
                    </div>
                ))}
                {fourIsAnswered && (
                    <form onSubmit={handleDecodeSubmit} style={{ width: "100%", display: "flex", gap: 8 }}>
                        <input type="text" value={decodeComment} onChange={(e) => setDecodeComment(e.target.value)} placeholder="コメントで「復号する」 と送信" style={{ flex: 1, padding: "10px", fontSize: "0.95rem", borderRadius: "6px", border: "1px solid #d1d5db", background: "#fff" }} />
                        <button type="submit" style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", padding: "8px 14px", fontWeight: 600, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>送信</button>
                    </form>
                )}
                {hasDecrypted && (
                    <div style={{ marginTop: 10, color: "#6b7280", fontSize: "0.85rem" }}>復号回数（第4問）: {decryptCounts[4] ?? 1}</div>
                )}
            </div>
        </div>
    );
}
