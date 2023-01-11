import React, { useCallback } from "react";
import Sprite from "./Sprite";
import SpriteDropCatcher from "./SpriteDropCatcher";

export default function Board({sprites, spriteType, 
    unitsWidth=25.0, unitsHeight=25.0, 
    handleBoardDrop=()=>{}, handleSpriteIdClicked=()=>{},
    backgroundImage, contain}){
    const handleCatcherDrop = useCallback(({id, dropOffset, latestBounds, type})=>{
        const boardX = (dropOffset.x-latestBounds.left)/latestBounds.width*unitsWidth;
        const boardY = (dropOffset.y-latestBounds.top)/latestBounds.height*unitsHeight;
        handleBoardDrop({id, boardX, boardY, type});
    },[handleBoardDrop, unitsHeight, unitsWidth]);
    
    return (
        <SpriteDropCatcher handleDrop={handleCatcherDrop}>
            <div style={{position:"relative", width:"100%", height:"100%",
                backgroundImage: `url(${backgroundImage})`, backgroundSize: contain?"contain":"cover"}}>
                {[...sprites.keys()].map((id) => {
                    var sprite = sprites.get(id);
                    return <div key={id} onClick={()=>handleSpriteIdClicked(id)} 
                        style={{position: "absolute",
                        left: `${100.0*sprite.x/unitsWidth}%`, 
                        top: `${100.0*sprite.y/unitsHeight}%`}}>
                            <Sprite id={id} sprite={sprite} type={spriteType}/>
                    </div>
                }
                )}
            </div>
        </SpriteDropCatcher>
    );
}