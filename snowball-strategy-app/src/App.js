
import './App.css';
import Board from './Board';
import Snowfall from 'react-snowfall';
import snowBackground from './images/snowBackground.png';
import infoIcon from './images/infoicon.png';
import ViewportDiv from './ViewportDiv';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useCallback, useState } from 'react';
import { GAMEPALETTE, ItemTypes } from './Constants';
import ResultsDisplay from './ResultsDisplay';
import { runGPTCompletion } from './cloudFunctions';


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
      runGPTCompletion(createSimulationPrompt()).then((text) => {
          setSimulationResult("FROM: " + selectedSprite.name +"\nRE: snowball fight strategy\n" + text + "\n\n\n   - " + selectedSprite.name);
          setSimulating(false);
        });
      }
  },[readyToSimulate, createSimulationPrompt, selectedSprite])

  const resetResult = useCallback(()=>{
    setSimulationResult(null);
  },[setSimulationResult])

  const onClickInfo = ()=>{
    setSimulationResult(`this web experience simulates the thoughts and strategies of participants in a snow fight
    
    to get started, drag at least 2 images from the palette on the left to the snow arena on the right 
    then click the button at the top and wait a bit
    
    Jamie Earl White is responsible for these shenanigans
    one simulation costs me about 1 cent. if you like it and have the means, please throw a dollar or nice message my way
    
    venmo @jamieearlwhite and send feedback/words of affirmation to me@jamieearlwhite.com
    
    under the hood, these messages are generated by
      1. programatically creating a structured data prompt, including information about the protagonist, their situation, and the location of people and objects in their environment
      2. feeding this prompt to OpenAI's GPT-3 model API's Completion endpoint
      3. displaying the response in a cute screen

    the images were all generated using OpenAI's DALL-E`);
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{display: "flex", justifyContent: "center", alignItems: "center", 
      marginBottom: "1vh", marginTop: "1vh"}}>
        <button style={{height:"5vh", width:"40vh", borderRadius:"1vh",
        background:readyToSimulate()?"#09E85E":"#817E9F",
        marginRight: "1vh"
        }} onClick={simulateButtonClick}>
          { (simulating && <>Simulating...</>) ||
          (!hasEnoughSpritesToSimulate() && <>Drag things into the snowball arena</>) ||
          (hasEnoughSpritesToSimulate() && !selectedSprite && <>Choose someone by dragging</>) ||
          (readyToSimulate() && <>View {selectedSprite.name}'s plan</>)}
        </button>
        <div onClick={onClickInfo}>
          <ViewportDiv viewportHeight={3} viewportWidth={3}>
          <img style={{width:"100%", height:"100%"}} src={infoIcon} alt="info"/>
          </ViewportDiv>
        </div>
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
