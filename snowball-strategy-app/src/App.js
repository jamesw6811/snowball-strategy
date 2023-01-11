
import './App.css';
import Board from './Board';
import Snowfall from 'react-snowfall';
import snowBackground from './images/snowBackground.png';
import ViewportDiv from './ViewportDiv';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useCallback, useState } from 'react';
import { formatSimulationResult, InfoString, ItemTypes } from './constants';
import { SpritePalette } from './spriteAssets';
import ResultsDisplay from './ResultsDisplay';
import { runGPTCompletion } from './cloudFunctions';
import createSimulationPrompt from './createSimulationPrompt';
import SimulateButton from './SimulateButton';
import InfoButton from './InfoButton';
import useNextId from './useNextId';

const paletteSpriteLayout = SpritePalette.map((sprite, index)=>{
  return {id:index, x:1, y:index*3+2, image:sprite.image, name:sprite.name};
});

function App() {
  const [sprites, setSprites] = useState([]);
  const [selectedSprite, setSelectedSprite] = useState();
  const [simulationResult, setSimulationResult] = useState();
  const [simulating, setSimulating] = useState(false);
  const nextId = useNextId().next; // TODO: IS THIS BAD PRACTICE?

  const wrapWithSimulating = useCallback((asyncFunction)=>{
    return async ()=>{
      setSimulating(true);
      await asyncFunction();
      setSimulating(false);
    }
  },[]);

  const handleSimulationSpriteClick = useCallback((sprite)=>{
    setSelectedSprite(sprite);
  },[]);

  const handleSpriteMoved = useCallback(({boardX, boardY, id})=>{
    setSprites(sprites.map(
      (sprite)=>{
        if(sprite.id===id){
          const newSprite = {...sprite, x:boardX, y:boardY};
          setSelectedSprite(newSprite);
          return newSprite;
        } else return sprite;  
      })
    );
  }, [sprites]);

  const handleSpritePlaced = useCallback(({boardX, boardY, id})=>{
    const paletteSprite = paletteSpriteLayout.find((sprite)=>sprite.id===id);
    if (paletteSprite){
      const newSprite = {...paletteSprite, x:boardX, y:boardY, id:nextId()};
      setSprites([...sprites, newSprite]);
      setSelectedSprite(newSprite);
    } else {
      console.error("Palette id not found");
    }
  }, [sprites, nextId]);

  const handleBoardDrop = useCallback(({type, ...dropParams})=>{
    if (type===ItemTypes.SPRITE) {
      handleSpriteMoved(dropParams);
    } else if (type===ItemTypes.PALETTE) {
      handleSpritePlaced(dropParams);
    } else {
      console.error("Type not found");
      return;
    }
  },[handleSpriteMoved, handleSpritePlaced]);

  const handlePaletteDrop = useCallback(({id, type})=>{
    if (type===ItemTypes.SPRITE) {
      setSprites(sprites.filter((sprite)=>sprite.id!==id));
    }
    setSelectedSprite(null);
  },[sprites]);

  const hasEnoughSpritesToSimulate = useCallback(()=>{
    return sprites.length > 1;
  },[sprites]);

  const readyToSimulate = useCallback(()=>{
    return selectedSprite && hasEnoughSpritesToSimulate() && !simulating;
  },[selectedSprite, hasEnoughSpritesToSimulate, simulating]);

  const simulate = wrapWithSimulating(useCallback(async ()=>{
    const text = await runGPTCompletion(
      createSimulationPrompt(sprites, selectedSprite)
    );
    setSimulationResult(formatSimulationResult(selectedSprite.name, text));
  }, [selectedSprite, sprites]));

  const simulateButtonClick = useCallback(()=>{
    if (readyToSimulate()) simulate();
  },[readyToSimulate, simulate]);

  const resetResult = useCallback(()=>{
    setSimulationResult(null);
  },[]);

  const onClickInfo = useCallback(()=>{
    setSimulationResult(InfoString);
  },[]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{display: "flex", justifyContent: "center", alignItems: "center", 
      marginBottom: "1vh", marginTop: "1vh"}}>
        <SimulateButton enoughSprites={hasEnoughSpritesToSimulate()} 
          readyToSimulate={readyToSimulate}
          simulating={simulating}
          selectedSprite={selectedSprite} 
          onClick={simulateButtonClick} />
        <InfoButton onClick={onClickInfo} />
      </div>
      <div style={{display: "flex", justifyContent: "center"}}>
        <ViewportDiv viewportHeight={90} viewportWidth={10}>
          <Board spriteType={ItemTypes.PALETTE} sprites={paletteSpriteLayout} 
          handleBoardDrop={handlePaletteDrop}
          unitsWidth={2} unitsHeight={27}/>
        </ViewportDiv>
        <ViewportDiv viewportHeight={90} viewportWidth={5} />
        <ViewportDiv viewportHeight={90} viewportWidth={85}>
          <Board spriteType={ItemTypes.SPRITE} sprites={sprites} handleSpriteClick={handleSimulationSpriteClick}
          handleBoardDrop={handleBoardDrop} backgroundImage={snowBackground} contain={false}/>
        </ViewportDiv>
      </div>
      <ResultsDisplay results={simulationResult} onClick={resetResult} />
      {simulating && <Snowfall />}
    </DndProvider>
  );
}

export default App;
