
import './App.css';
import Board from './Board';
import Snowfall from 'react-snowfall';
import snowBackground from './images/snowBackground.png';
import ViewportDiv from './ViewportDiv';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useCallback, useState } from 'react';
import { GAMEPALETTE, ItemTypes } from './Constants';
import ResultsDisplay from './ResultsDisplay';

import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY_SNOWBALL,
  authDomain: "snowball-strategy.firebaseapp.com",
  projectId: "snowball-strategy",
  storageBucket: "snowball-strategy.appspot.com",
  messagingSenderId: "963604328150",
  appId: "1:963604328150:web:db6eef1145ff3dc306e377",
  measurementId: "G-JXX5K651FV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

const initialSprites = {palette:[], gameBoard:[]};
GAMEPALETTE.forEach((sprite, index)=>{
  initialSprites.palette.push({id:index, x:1, y:index*3+2, image:sprite.image, name:sprite.name});
});

function App() {
  const [sprites, setSprites] = useState(initialSprites);
  const [selectedSprite, setSelectedSprite] = useState();
  const [simulationResult, setSimulationResult] = useState();
  const [simulating, setSimulating] = useState(false);
  const [nextId, setNextId] = useState(6);

  const handleGameSpriteClick = useCallback((sprite)=>{
    setSelectedSprite(sprite);
  },[setSelectedSprite]);

  const handleBoardDrop = useCallback(({id, boardX, boardY, type})=>{
    if (type===ItemTypes.SPRITE) {
      setSprites({
        palette:sprites.palette,
        gameBoard: sprites.gameBoard.map(
          (sprite)=>{
            if(sprite.id===id){
              const newSprite = {...sprite, x:boardX, y:boardY};
              setSelectedSprite(newSprite);
              return newSprite;
            } else return sprite;  
          })
      });
    } else if (type===ItemTypes.PALETTE) {
      const paletteSprite = sprites.palette.find((sprite)=>sprite.id===id);
      if (paletteSprite){
        const newSprite = {...paletteSprite, x:boardX, y:boardY, id:nextId};
        setSprites({
          palette:sprites.palette,
          gameBoard: [...sprites.gameBoard, newSprite]
        });
        setSelectedSprite(newSprite);
        setNextId(nextId+1);
      } else {
        console.error("Palette id not found");
      }
    } else {
      console.error("Type not found");
      return;
    }
  },[nextId, sprites]);

  const handlePaletteDrop = useCallback(({id, boardX, boardY, type})=>{
    if (type===ItemTypes.SPRITE) {
      setSprites({
        palette: sprites.palette,
        gameBoard: sprites.gameBoard.filter((sprite)=>sprite.id!==id)
      });
    }
    setSelectedSprite(null);
  },[sprites]);

  const hasEnoughSpritesToSimulate = useCallback(()=>{
    return sprites.gameBoard.length > 1;
  },[sprites]);

  const readyToSimulate = useCallback(()=>{
    return selectedSprite && hasEnoughSpritesToSimulate() && !simulating;
  },[selectedSprite, hasEnoughSpritesToSimulate, simulating]);

  const createLocationPrompt = useCallback((viewedSprite, originSprite)=>{
    const dx = viewedSprite.x - originSprite.x;
    // Invert y because our coordinate system is flipped from cardinal directions
    const dy = -(viewedSprite.y - originSprite.y);

    return viewedSprite.name + " is " +
    calculateDistance(dx, dy) + " meters to the " +
    calculateCardinalDirection(dx, dy)+".";
  },[]);

  const calculateDistance = (dx, dy)=>{
    return Math.round(Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)));
  }

  const calculateCardinalDirection = (dx, dy)=>{
    const angle = Math.atan2(dy, dx);
    const div16angle = Math.floor(16*angle/(2.0*Math.PI));
    var direction;
    switch (div16angle) { //TODO: change this to an array of directions instead of ugly switch
      case -8:
        direction = "west";
        break;
      case -7:
        direction = "west-southwest"
        break;
      case -6:
        direction = "southwest";
        break;
      case -5:
        direction = "south-southwest"
        break;
      case -4:
        direction = "south";
        break;
      case -3:
        direction = "south-southeast"
        break;
      case -2:
        direction = "southeast";
        break;
      case -1:
        direction = "east-southeast"
        break;
      case 0:
        direction = "east";
        break;
      case 1:
        direction = "east-northeast"
        break;
      case 2:
        direction = "northeast";
        break;
      case 3:
        direction = "north-northeast"
        break;
      case 4:
        direction = "north"
        break;
      case 5:
        direction = "north-northwest"
        break;
      case 6:
        direction = "northwest"
        break;
      case 7:
        direction = "west-northwest"
        break;
      case 8:
        direction = "west"
        break;
      default:
        throw Error("unrecognized angle:"+direction);
    }
    return direction;
  }

  const createSimulationPrompt = useCallback(()=>{
    var prompt =  "You are in a snowball fight. ";
    sprites.gameBoard.forEach((sprite)=>{
      if(sprite.id !== selectedSprite.id){
        prompt += createLocationPrompt(sprite, selectedSprite) + " ";
      }
    });
    prompt += "You are " + selectedSprite.name + ". Introduce yourself. Then explain your strategy to win the snowball fight step by step in the style of " + selectedSprite.name + ".";
    console.log(prompt);
    return prompt;
  },[createLocationPrompt, selectedSprite, sprites]);

  const simulateButtonClick = useCallback(()=>{
    if (readyToSimulate()) {
      setSimulating(true);
      const addMessage = httpsCallable(functions, 'queryGPT3Completion');
      addMessage({ prompt: createSimulationPrompt() })
        .then((result) => {
          const text = result.data.text;
          console.log(text);
          setSimulationResult("FROM: " + selectedSprite.name +"\nRE: snowball fight strategy\n" + text + "\n\n\n   - " + selectedSprite.name);
          setSimulating(false);
        });
      }
  },[readyToSimulate, createSimulationPrompt, selectedSprite])

  const resetResult = useCallback(()=>{
    setSimulationResult(null);
  },[setSimulationResult])
    
  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{display: "flex", justifyContent: "center", marginBottom: "1vh", marginTop: "1vh"}}>
        <button style={{height:"5vh", width:"40vh", borderRadius:"1vh",
        background:readyToSimulate()?"#09E85E":"#817E9F",
        }} onClick={simulateButtonClick}>
          { (simulating && <>Simulating...</>) ||
          (!hasEnoughSpritesToSimulate() && <>Drag things into the snowball arena</>) ||
          (hasEnoughSpritesToSimulate() && !selectedSprite && <>Choose someone by dragging</>) ||
          (readyToSimulate() && <>View {selectedSprite.name}'s plan</>)}
        </button>
      </div>
      <div style={{display: "flex", justifyContent: "center"}}>
        <ViewportDiv viewportHeight={90} viewportWidth={10}>
          <Board spriteType={ItemTypes.PALETTE} sprites={sprites.palette} 
          handleBoardDrop={handlePaletteDrop}
          unitsWidth={2} unitsHeight={27}/>
        </ViewportDiv>
        <ViewportDiv viewportHeight={90} viewportWidth={5} />
        <ViewportDiv viewportHeight={90} viewportWidth={85}>
          <Board spriteType={ItemTypes.SPRITE} sprites={sprites.gameBoard} handleSpriteClick={handleGameSpriteClick}
          handleBoardDrop={handleBoardDrop} backgroundImage={snowBackground} contain={false}/>
        </ViewportDiv>
      </div>
      {!!simulationResult &&
          <ResultsDisplay handleClick={resetResult}>
            {simulationResult}
          </ResultsDisplay>
      }
      {simulating && <Snowfall />}
    </DndProvider>
  );
}

export default App;
