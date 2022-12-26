import React from "react";

export default function Square({children}) {
    return <div style={{backgroundColor:"grey", width:"100%", height:"100%"}}>
        {children}
    </div>
}