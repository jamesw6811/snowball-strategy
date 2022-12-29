import React from "react";

export default function ResultsDisplay({children, handleClick}){
    return <div style={{position:"absolute", top:"50vh", left:"50vh", 
    height:"70vh", width:"90vh"}}><div 
        style={{position:"absolute", width:"100%", height:"100%", top:"-50%", left:"-50%", 
        background:"lightgreen", opacity:"75%", whiteSpace: "pre-wrap"}} onClick={handleClick}>
        {children}
    </div>
    </div>
}

