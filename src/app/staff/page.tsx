"use client";

import { useEffect, useState, useRef } from "react";

export default function StaffPage() {
    const roomTimes = {
        1: 123,
        2: 150,
        3: 200,
        4: 180,
        5: 220,
        6: 300
    }
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
                <p style = {{textAlign:"left", fontSize:"24px", marginTop:"20px", marginLeft:"500px"}}>
                    部屋1: {roomTimes[1]}秒<br/>
                    部屋2: {roomTimes[2]}秒<br/>
                    部屋3: {roomTimes[3]}秒<br/><br/>
                    入口<br />
                    </p>
                    
                <p style = {{textAlign:"right", fontSize:"24px", marginTop:"20px", marginRight:"500px"}}>
                    部屋4: {roomTimes[4]}秒<br/>
                    部屋5: {roomTimes[5]}秒<br/>
                    部屋6: {roomTimes[6]}秒<br/><br/>
                    出口<br />
                </p>
        </div>
        </div>
    )
}