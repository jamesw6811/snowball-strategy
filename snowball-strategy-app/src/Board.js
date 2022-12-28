import React from "react";
import Sprite from "./Sprite";

export default function Board({sprites, unitsWidth=25.0, unitsHeight=25.0}){
    return (
        <div style={{position:"relative", width:"100%", height:"100%", borderStyle: "solid"}}>
            {sprites.map((sprite, i) =>
                <div key={i} style={{position: "absolute",
                    left: `${100.0*sprite.x/unitsWidth}%`, top: `${100.0*sprite.y/unitsHeight}%`}}>
                    <Sprite image={sprite.image} altText={sprite.name} />
                </div>
            )}
        </div>
    );
}