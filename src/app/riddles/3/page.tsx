"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
import Diamond from "../../../../components/diamondd";
import Toko from "../../../../components/toko";
import Script from "next/script";
import { useRouter } from "next/navigation";



export default function Home() {
    const [isCorrect, setIsCorrect] = useState(false);
    const [showError, setShowError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [anses,setAnses]=useState([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
    const kazumozi=["A","S","T","M","C","I","B","U","P","O","G","R","M","R","K","F","V","E","W","A","I"]

    const getAns=(bango:number)=>(
        ()=>{setAnses((prev)=>(prev.slice(0,bango).concat([1-prev[bango]]).concat(prev.slice(bango+1))))}
    )
    const router=useRouter()
    const handleCheckAnswer = async () => {
        setIsLoading(true);
        setShowError(false);
        setIsCorrect(false);
        try {
            const res = await fetch("/api/riddle/3", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answer: anses.join('')}),
            });
            const result = await res.json();
            //console.log(result)
            if (result.correct) setIsCorrect(true); else setShowError(true);
        } catch {
            setShowError(true);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            console.log(isCorrect)
            if(!isCorrect){
                localStorage.pagen=3;
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

    return (<Toko saigo={true}>
                <h2
                    style={{
                        fontSize: "1.2rem",
                        marginBottom: 12,
                        background: "#303030ff",
                        padding: "8px 16px",
                        borderRadius: "8px",
                    }}
                >「SNSの使い方」を読み、「なくすべきもの」を押せ</h2>
                <div style={{background: "#303030ff",border:"2px solid black",borderRadius: "8px"}}>
                <p　style={{marginBottom:"10px",textAlign: 'left'}}>　箱のパスワードは、、、</p>
                <div style={{width:330,height:200,position:"relative",margin:"0 auto"}}>
                {[...Array(3)].map((_,idx)=>(
                    <div key={idx} style={{width:100,}}>
                    <Diamond typp={0} mozi={kazumozi[idx*7]} x={80+idx*110} y={15} sub={getAns(idx*7)}></Diamond>
                    <Diamond typp={0} mozi={kazumozi[idx*7+1]} x={0+idx*110} y={15} sub={getAns(idx*7+1)}></Diamond>
                    <Diamond typp={0} mozi={kazumozi[idx*7+2]} x={0+idx*110} y={90} sub={getAns(idx*7+2)}></Diamond>
                    <Diamond typp={0} mozi={kazumozi[idx*7+3]} x={80+idx*110} y={90} sub={getAns(idx*7+3)}></Diamond>
                    <Diamond typp={1} mozi={kazumozi[idx*7+4]} x={15+idx*110} y={0} sub={getAns(idx*7+4)}></Diamond>
                    <Diamond typp={1} mozi={kazumozi[idx*7+5]} x={15+idx*110} y={77} sub={getAns(idx*7+5)}></Diamond>
                    <Diamond typp={1} mozi={kazumozi[idx*7+6]} x={15+idx*110} y={157} sub={getAns(idx*7+6)}></Diamond>
                    </div>
                ))}
                </div>
                </div>
                <button
                        onClick={handleCheckAnswer}
                        disabled={isLoading}
                        className="botanin"
                        style={{marginTop:10}}
                    >
                        {isLoading ? "判定中..." : "回答する"}
                </button>
                
                
                {showError && <div style={{ color: "#d63031", marginBottom: 12 }}>答えが違います。もう一度挑戦してください。</div>}
                {isCorrect && (
                <button
                    onClick={()=>{router.push("/riddles/4")}}
                    className="botan"
                    style={{
                        width:"95%",
                    }}
                >
                    箱が開いた！
                </button>
                )}
        </Toko>
        
    );
}