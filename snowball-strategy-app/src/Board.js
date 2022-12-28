import React from "react";
import Sprite from "./Sprite";
const SPRITESTYLE = {  position: "absolute", 
    transform: "translate(-50%, -50%)", width: "5%", height: "5%"}

export default function Board({sprites, viewportWidth=100, unitsWidth=25.0, unitsHeight=25.0}){
    return (
        <div style={{position:"relative", width:`${viewportWidth}vw`,height:`${viewportWidth}vw`, 
            maxWidth:"100vh", maxHeight:"100vh"}}>
            {sprites.map((sprite, i) =>
                <div key={i} style={{...SPRITESTYLE, 
                    left: `${100.0*sprite.x/unitsWidth}%`, top: `${100.0*sprite.y/unitsHeight}%`}}>
                    <Sprite image={sprite.image} />
                </div>
            )}
        </div>
    );
}