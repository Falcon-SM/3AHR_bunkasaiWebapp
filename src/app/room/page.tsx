"use client";

import { useEffect, useState, useRef } from "react";
//import { microcms } from "@/lib/microcms";
import { useRouter } from "next/navigation";
import Script from "next/script";

type PageContent = {
  title: string;
  content: string;
};

export default function Home() {
    const [answer, setAnswer] = useState("");
    const router = useRouter();   
    const setCookie = (name: string, value: string, maxAgeSec = 60 * 60 * 24 * 30) => {
        document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSec}; SameSite=Lax`;
    };

    return( 
    <div>
    <input type="text" style={{color:"black"}} onChange={(e) => {
                                setAnswer(e.target.value);
                            }}/>
    <button
        onClick={() => {
            // persist in both localStorage and a 30-day cookie so it survives navigation and final page
            try {
                localStorage.roomnum = answer;
                setCookie('roomnum', answer);
            } catch (e) {
                console.warn('Could not persist roomnum to storage/cookie', e);
            }
            router.push("/")
        }}
        >入室</button>
    

    </div>);
}