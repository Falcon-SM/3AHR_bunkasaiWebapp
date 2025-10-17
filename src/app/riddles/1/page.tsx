"use client";
import React, { useEffect, useMemo, useState } from "react";
import Ques from "../../../../components/shomon";
import Toko from "../../../../components/toko";
import { useRiddles } from "@/app/context/riddleContext";
import Script from "next/script";
import { useRouter } from "next/navigation";

const crossd = [
    [0,0,0,1,0,0,0],
    [0,1,0,1,0,0,1],
    [1,1,1,1,0,0,1],
    [0,1,0,1,1,1,1],
    [0,1,0,0,0,0,1]

];
const crosshuto=[8,34,25,10,20,14]

const mondai = [
    "左下の⬛️から右上の⬛️へ向かえ。\n壁にぶつかるまで曲がれない。\nまた、右にしか曲がることができない。\n通った文字を順に読め。",
    "室町幕府の将軍を追放した戦国武将は？",
    "嘘をついているB組生徒の名を出席番号順に読め。\n下の5人は全員同じB組である。",
    "投稿者が文化祭で撮った写真に写っている謎を解け。",
    "トイレの紙の赤い矢印が通る文字を順に読め。"
]

const monim=['naan','naan', '/論理クイズ.png','naan','naan']

export default function Home() {
    const { threeIsAnswered,gazo,setGazo} = useRiddles();
    const [crosswordAnswer, setCrosswordAnswer] = useState("");
    const [isCorrect, setIsCorrect] = useState(false);
    const [showError, setShowError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router=useRouter();

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        console.log(isCorrect)
        if(!isCorrect){
            localStorage.pagen=1;
            localStorage.zikan=sessionStorage.zikan;
            localStorage.sawhint=sessionStorage.sawhint;
            event.preventDefault();
            // Chromeなどでは returnValue の設定が必要
            event.returnValue = "";
        }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);


    const hints=[["徳川家の人だよ！","たい焼きを食べて死んだという噂があるよ！","家康だよ！"],["この人が登場する有名な戦国ゲームがあるよ！","〇〇の野望","織田信長っていう人だよ！"],["a","b","c"],["a","b","d"],["廻天","結","Reboot"]]
    // Base64暗号テキスト（第1問用）

    const handleCheckAnswer = async () => {
        setIsLoading(true);
        setShowError(false);
        setIsCorrect(false);

        try {
            const res = await fetch("/api/riddle/1", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answer: crosswordAnswer }),
            });
            const result = await res.json();
            if (result.correct) {
                setIsCorrect(true);
            } else {
                setShowError(true);
            }
        } catch {
            setShowError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return(<Toko saigo={false}>
            {[...Array(5)].map((_, idx) => (
                <Ques key={idx} hints={hints[idx]} bun={mondai[idx]} n={idx} imgg={monim[idx]} imgWidth={400} imgHeight={250}/>
            ))}
            <div style={{ margin: "28px 0 20px 0", clear:"both"}}>
                <h2 style={{marginBottom: 12, fontWeight: 400 }}>クロスワード</h2>
                <table cellSpacing="0" style={{borderCollapse: "collapse", margin: "0 auto" }}>
                    <tbody>
                        {[...Array(5)].map((_, rowIdx) => (
                            <tr key={rowIdx} style={{margin:0}}>
                                {[...Array(7)].map((_, colIdx) => {
                                    if (crossd[rowIdx][colIdx] === 1) {
                                        return (
                                            <td
                                                key={colIdx}
                                                style={{
                                                    border: `${["1px","3px"][+(crosshuto.indexOf(rowIdx*7+colIdx)!==-1)]} solid black`,
                                                    width: 40,
                                                    height: 40,
                                                    textAlign: "center",
                                                    background: "#f9fafb",
                                                }}
                                            >
                                                {crosshuto.indexOf(rowIdx*7+colIdx)!==-1 && <p style={{margin:0,fontSize:"10px",textAlign:"left"}}>{crosshuto.indexOf(rowIdx*7+colIdx)+1}</p>}
                                                <input
                                                    type="text"
                                                    maxLength={1}
                                                    style={{
                                                        width: "92%",
                                                        height: "92%",
                                                        textAlign: "center",
                                                        background: "transparent",
                                                        fontSize: "1.2rem",
                                                        border:"none"
                                                    }}
                                                />
                                            </td>
                                        );
                                    } else {
                                        return (
                                            <td
                                                key={colIdx}
                                                style={{
                                                    border: "none",
                                                    width: 40,
                                                    height: 40,
                                                    textAlign: "center",
                                                    background: "#303030",
                                                }}
                                            ></td>
                                        );
                                    }
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* クロスワード回答欄＋ボタン */}
            <p style={{marginTop:40,marginBottom:10}}>クロスワードの太線の中の文字を以下の対応する四角に入力せよ</p>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 ,height:50,background: "#303030ff",borderRadius: "4px",border:"1px solid black",padding:8}}>
                
                {[...Array(7)].map((_,idx)=>(
                <input
                    key={idx}
                    maxLength={1}
                    type="text"
                    placeholder={String(idx+1)}
                    style={{
                        
                        width:20,
                        flex: 1,
                        padding: "10px",
                        fontSize: "1rem",
                        borderRadius: "6px",
                        border: "1px solid #d1d5db",
                    }}
                />
                ))}
                <p style={{flexGrow:1}}>星の間を読め</p>
            </div>
            <div style={{display:"flex",marginTop:40}}>
                <input 
                    onChange={e => setCrosswordAnswer(e.target.value)}
                    placeholder={"答えを入力"}
                    className="riddle-input"
                    style={{flexGrow:1,marginRight:5}}
                />
                {crosswordAnswer.trim() !== "" && (
                    <button
                        onClick={handleCheckAnswer}
                        disabled={isLoading}
                        className="botanin"
                        style={{
                            cursor: isLoading ? "not-allowed" : "pointer",
                            opacity: isLoading ? 0.6 : 1,
                        }}
                    >
                        {isLoading ? "判定中..." : "回答する"}
                    </button>
                )}
            </div>
            {showError && (
                <div style={{ color: "#d63031", marginBottom: 12 }}>
                    答えが違います。もう一度挑戦してください。
                </div>
            )}
            {isCorrect && (
                <button
                    onClick={()=>{router.push("/riddles/2")}}
                    className="botan"
                    style={{
                        width:"95%",
                    }}
                >
                    次の謎へ進む
                </button>
            )}
    </Toko>);
}