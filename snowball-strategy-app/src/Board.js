import React from "react";
import Square from "./Square";
import Sprite from "./Sprite";

export default function Board(){
    return (
        <div style={{width:"100vw",height:"100vw", maxWidth:"100vh", maxHeight:"100vh"}}>
        <Square><Sprite /></Square>
        </div>
    );
}