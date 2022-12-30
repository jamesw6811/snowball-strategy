import React from "react";
import ViewportDiv from "./ViewportDiv";

export default function ResultsDisplay({children, handleClick}){
    return <div 
        style={{width:"100%", height:"100%", 
        position: "fixed",
        top: 0,
        left: 0,
        display: "flex",
        justifyContent: "center"
        }} onClick={handleClick}>
        <ViewportDiv viewportHeight={100} viewportWidth={100}>
            <div style={{width:"100%", height:"100%", background:"white", opacity:"95%", whiteSpace: "pre-wrap",
            display: "flex", alignItems: "center", padding: "5vh"}}>
                {children}
            </div>
        </ViewportDiv>
    </div>
    
}

