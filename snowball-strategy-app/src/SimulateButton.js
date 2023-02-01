import React from 'react';
import './SimulateButton.css';

export default function SimulateButton({enoughSprites, readyToSimulate, simulating, selectedSprite, onClick}){
  return <button className={`simulatebutton${readyToSimulate?" ready":""}`}
        onClick={onClick}>
      {(simulating && <>Simulating...</>) ||
      (!enoughSprites && <>Drag things into the snowball arena</>) ||
      (!selectedSprite && <>Click on someone to simulate</>) ||
      (readyToSimulate && <>View {selectedSprite.name}'s plan</>)}
    </button>
}