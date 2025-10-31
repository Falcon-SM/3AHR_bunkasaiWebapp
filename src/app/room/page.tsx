"use client";

import { useEffect, useState, useRef } from "react";
//import { microcms } from "@/lib/microcms";
import { useRouter } from "next/navigation";
import Script from "next/script";

type PageContent = {
  title: string;
  content: string;
};

/*type MicroCMSResponse = {
  contents: PageContent[];
};*/

export default function Home() {
    const [answer, setAnswer] = useState("");
    const router = useRouter();   
    return( 
    <div>
    <input type="txt" style={{color:"black"}} onChange={(e) => {
                                setAnswer(e.target.value);
                            }}/>
    <button
        onClick={() => {localStorage.roomnum=answer;router.push("/")} 
        }>入室</button>
    

    </div>);
}