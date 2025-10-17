"use client";
import {useEffect, useRef,useState} from "react";

type diamhiki={
    typp:number;
    mozi:string;
    x:number;
    y:number;
    sub:()=>void;
}
//const canvasRef = [[useRef<(HTMLCanvasElement) | null>(null), useRef<(HTMLCanvasElement) | null>(null), useRef<(HTMLCanvasElement) | null>(null), useRef<(HTMLCanvasElement) | null>(null), useRef<(HTMLCanvasElement) | null>(null),useRef<(HTMLCanvasElement) | null>(null) ], [useRef<(HTMLCanvasElement) | null>(null), useRef<(HTMLCanvasElement) | null>(null), useRef<(HTMLCanvasElement) | null>(null), useRef<(HTMLCanvasElement) | null>(null), useRef<(HTMLCanvasElement) | null>(null),useRef<(HTMLCanvasElement) | null>(null) ], [useRef<(HTMLCanvasElement) | null>(null), useRef<(HTMLCanvasElement) | null>(null), useRef<(HTMLCanvasElement) | null>(null), useRef<(HTMLCanvasElement) | null>(null), useRef<(HTMLCanvasElement) | null>(null),useRef<(HTMLCanvasElement) | null>(null) ]]
export default function Diamond({typp,mozi,x,y,sub}:diamhiki){
    const canvasRef = useRef<(HTMLCanvasElement) | null>(null)
    const[cl,setCl]=useState(0)
    useEffect(()=>{
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        if (typp===0){
            ctx.beginPath();
            ctx.moveTo(10,0);
            ctx.lineTo(20, 10);
            ctx.lineTo(20,60);
            ctx.lineTo(10,70);
            ctx.lineTo(0,60);
            ctx.lineTo(0,10);
            ctx.lineTo(10,0);
            ctx.closePath();
        }else{
            ctx.beginPath();
            ctx.moveTo(0,10);
            ctx.lineTo(10, 20);
            ctx.lineTo(60,20);
            ctx.lineTo(70,10);
            ctx.lineTo(60,0);
            ctx.lineTo(10,0);
            ctx.lineTo(0,10);
            ctx.closePath();
        }
        ctx.fillStyle = ["white","#303030"][1-cl];
        ctx.strokeStyle = ["white","black"][cl];
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = ["white","black"][cl];
         ctx.font = '15px Roboto medium';
        ctx.textBaseline="middle";
        ctx.textAlign="center";
        ctx.fillText(mozi,[10,35][typp],[10,35][1-typp])
    },[cl])

    return(
        <canvas onClick={()=>{sub();setCl((prev)=>(1-prev));}} ref={canvasRef} width={[20,80][typp]} height={[20,80][1-typp]} style={{width:[20,80][typp],height:[20,80][1-typp],position:"absolute",left:x,top:y}}></canvas>
    )
}