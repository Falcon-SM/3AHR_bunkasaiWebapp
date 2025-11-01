"use client";

import { useEffect, useState, useRef } from "react";

export default function StaffPage() {
    const [roomTimes, setRoomTimes] = useState<Record<number, number>>({
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
    });

    const [peopleSum, setPeopleSum] = useState(0);

    const addCount = () => {
        setPeopleSum((prev) => prev + 1);
    };

    const lessCount = () => {
        setPeopleSum((prev) => Math.max(0, prev - 1));
    };

    // cookie helpers at component scope so other effects can reuse
    const getCookie = (name: string) => {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : null;
    };

    const setCookie = (name: string, value: string, maxAgeSec = 60 * 60 * 24 * 30) => {
        document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSec}; SameSite=Lax`;
    };

    // persist peopleSum to cookie for 3 days whenever it changes
    // skip on initial mount to avoid overwriting existing cookie before hydration
    const hasHydratedRef = useRef(false);
    useEffect(() => {
        if (!hasHydratedRef.current) return;
        try {
            setCookie('peopleSum', String(peopleSum), 60 * 60 * 24 * 3);
        } catch {
            // ignore cookie write errors
        }
    }, [peopleSum]);

    useEffect(() => {
        // hydrate peopleSum from cookie if present
        try {
            const ps = getCookie('peopleSum');
            if (ps) {
                const n = Number(ps);
                if (!Number.isNaN(n)) setPeopleSum(n);
            }
        } catch (e) {
            // ignore
        }

        // mark hydrated so persist effect can write updates
        hasHydratedRef.current = true;

        // try hydrate roomTimes from cookie first for faster display
        try {
            const cached = getCookie('roomTimes');
            if (cached) {
                const parsed = JSON.parse(cached);
                // ensure parsed has numeric keys
                const map: Record<number, number> = {1:0,2:0,3:0,4:0,5:0,6:0};
                Object.keys(parsed).forEach(k => {
                    const id = Number(k);
                    if (!Number.isNaN(id)) map[id] = Number(parsed[k]) || 0;
                });
                setRoomTimes(map);
            }
        } catch (e) {
            console.warn('Failed to read roomTimes cookie', e);
        }

        const fetchRoomTimes = async () => {
            try {
                const resp = await fetch('/api/get-room-times');
                if (!resp.ok) {
                    console.error('get-room-times API returned non-ok', resp.status);
                    return;
                }
                const payload = await resp.json();
                if (!payload || !payload.ok) {
                    console.error('get-room-times payload invalid', payload);
                    return;
                }

                const map = payload.data || {1:0,2:0,3:0,4:0,5:0,6:0};
                // ensure numeric values
                const normalized: Record<number, number> = {1:0,2:0,3:0,4:0,5:0,6:0};
                Object.keys(map).forEach(k => {
                    const id = Number(k);
                    if (!Number.isNaN(id)) normalized[id] = Number(map[k]) || 0;
                });
                setRoomTimes(normalized);
                try {
                    setCookie('roomTimes', JSON.stringify(normalized), 60 * 60 * 24 * 30);
                } catch (e) {
                    console.warn('Failed to set roomTimes cookie', e);
                }
            } catch (e) {
                console.error('Unexpected error fetching /api/get-room-times:', e);
            }
        };

        fetchRoomTimes();

        // Poll every 5 seconds to keep the display up-to-date
        const interval = setInterval(fetchRoomTimes, 500);
        return () => clearInterval(interval);
    }, []);

    const formatSec = (sec: number) => {
        const m = Math.floor(sec / 60).toString();
        const s = (sec % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <div>
            <h2 style={{color:"blue", fontSize:"48px", fontWeight:"bold", textAlign:"center", marginTop:"20px"}}>
                スタッフページ
            </h2>

            
            <p style = {{textAlign:"center", fontSize:"24px", marginTop:"40px"}}>
                黒板
            </p>

            <div 
            style={{ 
                display: "grid", 
                gridTemplateColumns: "1fr 1fr", 
                gap: "20px", 
                border: "5px solid white", 
                padding: "20px" 
            }}
            >
                <div style={{ justifySelf: "end" }}>
                    <p style = {{textAlign:"left", fontSize:"24px", marginTop:"20px"}}>
                    部屋1: {formatSec(roomTimes[1])} <br/>
                    部屋2: {formatSec(roomTimes[2])} <br/>
                    部屋3: {formatSec(roomTimes[3])} <br/><br/>
                    入口<br />
                    </p>
                </div>
                    
                <div style={{ justifySelf: "start" }}>
                    <p style = {{textAlign:"left", fontSize:"24px", marginTop:"20px"}}>
                    部屋4: {formatSec(roomTimes[4])} <br/>
                    部屋5: {formatSec(roomTimes[5])} <br/>
                    部屋6: {formatSec(roomTimes[6])} <br/><br/>
                    出口<br />
                </p>
                </div>
        </div>
        <h2>
            {peopleSum}人
        </h2>
        <div style={{display:"flex", justifyContent:"center", gap: "16px", alignItems: "center"}}> 
            <button onClick={lessCount} style={{fontSize:"24px", padding:"10px 20px", marginTop:"20px", backgroundColor:"#722F37", border:"none", borderRadius:"8px", cursor:"pointer", color:"white",}}>
            -
        </button>  

        <button onClick={addCount} style={{fontSize:"24px", padding:"10px 20px", marginTop:"20px", backgroundColor:"#48daff", border:"none", borderRadius:"8px", cursor:"pointer", color:"white",}}>
            +
        </button>   
        </div>
        
        </div>
    )
}