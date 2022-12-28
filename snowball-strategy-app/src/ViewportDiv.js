import React from "react";

export default function ViewportDiv({children, viewportHeight, viewportWidth}){
    return (
        <div style={{width:`${viewportWidth}vw`,height:`${viewportHeight}vw`, 
        maxWidth:`${viewportWidth}vh`, maxHeight:`${viewportHeight}vh`}}>
            {children}
        </div>
    )
}