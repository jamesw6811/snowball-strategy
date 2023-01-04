
import './App.css';
import Board from './Board';
import Snowfall from 'react-snowfall';
import snowBackground from './images/snowBackground.png';
import infoIcon from './images/infoicon.png';
import ViewportDiv from './ViewportDiv';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useCallback, useState } from 'react';
import { InfoString, ItemTypes } from './constants';
import { SpritePalette } from './spriteAssets';
import ResultsDisplay from './ResultsDisplay';
import { runGPTCompletion } from './cloudFunctions';
import createSimulationPrompt from './createSimulationPrompt';


const initialSprites = {paletteBoard:[], simulationBoard:[]};
SpritePalette.forEach((sprite, index)=>{
  initialSprites.paletteBoard.push({id:index, x:1, y:index*3+2, image:sprite.image, name:sprite.name});
});

function App() {
  const [sprites, setSprites] = useState(initialSprites);
  const [selectedSprite, setSelectedSprite] = useState();
  const [simulationResult, setSimulationResult] = useState();
  const [simulating, setSimulating] = useState(false);
  const [nextId, setNextId] = useState(6);

  const handleSimulationSpriteClick = useCallback((sprite)=>{
    setSelectedSprite(sprite);
  },[setSelectedSprite]);

  const handleBoardDrop = useCallback(({id, boardX, boardY, type})=>{
    if (type===ItemTypes.SPRITE) {
      setSprites({
        paletteBoard:sprites.paletteBoard,
        simulationBoard: sprites.simulationBoard.map(
          (sprite)=>{
            if(sprite.id===id){
              const newSprite = {...sprite, x:boardX, y:boardY};
              setSelectedSprite(newSprite);
              return newSprite;
            } else return sprite;  
          })
      });
    } else if (type===ItemTypes.PALETTE) {
      const paletteSprite = sprites.paletteBoard.find((sprite)=>sprite.id===id);
      if (paletteSprite){
        const newSprite = {...paletteSprite, x:boardX, y:boardY, id:nextId};
        setSprites({
          paletteBoard:sprites.paletteBoard,
          simulationBoard: [...sprites.simulationBoard, newSprite]
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

  const handlePaletteDrop = useCallback(({id, type})=>{
    if (type===ItemTypes.SPRITE) {
      setSprites({
        paletteBoard: sprites.paletteBoard,
        simulationBoard: sprites.simulationBoard.filter((sprite)=>sprite.id!==id)
      });
    }
    setSelectedSprite(null);
  },[sprites]);

  const hasEnoughSpritesToSimulate = useCallback(()=>{
    return sprites.simulationBoard.length > 1;
  },[sprites]);

  const readyToSimulate = useCallback(()=>{
    return selectedSprite && hasEnoughSpritesToSimulate() && !simulating;
  },[selectedSprite, hasEnoughSpritesToSimulate, simulating]);

  const simulateButtonClick = useCallback(()=>{
    if (readyToSimulate()) {
      setSimulating(true);
      runGPTCompletion(
        createSimulationPrompt(sprites.simulationBoard, selectedSprite)
      ).then((text) => {
          setSimulationResult(
`FROM: ${selectedSprite.name}
RE: snowball fight strategy
${text}


- ${selectedSprite.name}`);
          setSimulating(false);
        });
      }
  },[readyToSimulate, selectedSprite, sprites])

  const resetResult = useCallback(()=>{
    setSimulationResult(null);
  },[setSimulationResult])

  const onClickInfo = ()=>{
    setSimulationResult(InfoString);
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
          <Board spriteType={ItemTypes.PALETTE} sprites={sprites.paletteBoard} 
          handleBoardDrop={handlePaletteDrop}
          unitsWidth={2} unitsHeight={27}/>
        </ViewportDiv>
        <ViewportDiv viewportHeight={90} viewportWidth={5} />
        <ViewportDiv viewportHeight={90} viewportWidth={85}>
          <Board spriteType={ItemTypes.SPRITE} sprites={sprites.simulationBoard} handleSpriteClick={handleSimulationSpriteClick}
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
