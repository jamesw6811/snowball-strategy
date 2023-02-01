import React from "react";

export default function ResultsDisplay({results, onClick}){
    if (results)
        return <div 
            style={{ width:"100vw", height:"100vh", 
            position: "fixed",
            top: 0,
            left: 0,
            opacity:"95%",
            background:"white",
            }} onClick={onClick}>
                <div style={{overflow:"auto", maxHeight:"100%", maxWidth:"100%", boxSizing: "border-box",
    padding: "10%"}} >
                    <span style={{whiteSpace: "pre-wrap"}}>
                        {results}
                    </span>
                </div>
        </div>
    else return <></>
    
}

