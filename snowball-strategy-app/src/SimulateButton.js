import React from 'react';

export default function SimulateButton({enoughSprites, readyToSimulate, simulating, selectedSprite, onClick}){
    return <button style={{height:"5vh", width:"40vh", borderRadius:"1vh",
    background:readyToSimulate?"#09E85E":"#817E9F",
    marginRight: "1vh"
    }} onClick={onClick}>
      {(simulating && <>Simulating...</>) ||
      (!enoughSprites && <>Drag things into the snowball arena</>) ||
      (!selectedSprite && <>Click on someone to simulate</>) ||
      (readyToSimulate && <>View {selectedSprite.name}'s plan</>)}
    </button>
}