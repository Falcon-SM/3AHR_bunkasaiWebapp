"use client";
import React, { useState } from "react";

type props={
  bun:string;
  n:number;
  cl:()=>void;
};

export default function Ques({cl,bun,n}:props){
    const [isgive,setisgive]=useState(0)
    const hintcheck=()=>{
        if(isgive===0){
            if(window.confirm("ヒント出しますよ？")){
                setisgive(1);
                cl();
            }
        }
    }
    return(
    <div style={{ marginBottom: 28 }}>
        <h2
            //dangerouslySetInnerHTML={{ __html:{mondai[n]}}}
            style={{
                fontSize: "1.2rem",
                color: "#34495e",
                marginBottom: 12,
                background: "#f5f7fa",
                padding: "8px 16px",
                borderRadius: "8px",
            }}
        >{bun}</h2>
        <input
            type="text"
            className="riddle-input"
            placeholder={`謎${n+1}の答えを入力`}
            style={{
                width: "100%",
                padding: "10px",
                fontSize: "1rem",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
                marginBottom: "4px",
            }}
        />
        <button
            onClick={hintcheck}
            style={{
                padding: "10px 20px",
                background: "#0984e3",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontWeight: 600,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                transition: "background 0.2s",
            }}>ヒントを投稿</button>
    </div>)
};