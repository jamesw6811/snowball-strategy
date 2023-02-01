
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
import letitwomp from './sound/letitwomp.mp3';

const paletteSpriteLayout = new Map();
SpritePalette.forEach((sprite, index)=>{
  paletteSpriteLayout.set(index, {x:1, y:index*3+2, image:sprite.image, name:sprite.name});
});

function App() {
  const [sprites, setSprites] = useState(new Map());
  const [selectedSpriteId, setSelectedSpriteId] = useState(null);
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

  const handleSimulationSpriteClick = useCallback((spriteId)=>{
    setSelectedSpriteId(spriteId);
  },[]);

  const handleSpriteMoved = useCallback(({boardX, boardY, id})=>{
    const newSprites = new Map(sprites);
    newSprites.set(id, {...sprites.get(id), x:boardX, y:boardY});
    setSprites(newSprites);
    setSelectedSpriteId(id);
  }, [sprites]);

  const handleSpritePlaced = useCallback(({boardX, boardY, id})=>{
    const newSprite = {...paletteSpriteLayout.get(id), 
      x:boardX, y:boardY};
    const newSprites = new Map(sprites);
    const newId = nextId();
    newSprites.set(newId, newSprite);
    setSprites(newSprites);
    setSelectedSpriteId(newId);
  }, [sprites, nextId]);
  
  const handleSpriteRemoved = useCallback((id)=>{
    const newSprites = new Map(sprites);
    newSprites.delete(id);
    setSprites(newSprites);
    setSelectedSpriteId(null);
  }, [sprites]);

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
      handleSpriteRemoved(id);
    }
  },[handleSpriteRemoved]);

  const hasEnoughSpritesToSimulate = useCallback(()=>{
    return sprites.size > 1;
  },[sprites]);

  const readyToSimulate = useCallback(()=>{
    return (selectedSpriteId!=null) && hasEnoughSpritesToSimulate() && !simulating;
  },[selectedSpriteId, hasEnoughSpritesToSimulate, simulating]);

  const simulate = wrapWithSimulating(useCallback(async ()=>{
    const text = await runGPTCompletion(
      createSimulationPrompt(sprites, selectedSpriteId)
    );
    setSimulationResult(formatSimulationResult(sprites.get(selectedSpriteId).name, text));
  }, [selectedSpriteId, sprites]));

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
          readyToSimulate={readyToSimulate()}
          simulating={simulating}
          selectedSprite={sprites.get(selectedSpriteId)} 
          onClick={simulateButtonClick} />
        <InfoButton onClick={onClickInfo} />
        <ViewportDiv viewportHeight={3} viewportWidth={40}>
          <audio controlsList="play" controls loop style={{width:"100%", height:"100%", marginLeft:"1vw"}}>
            <source src={letitwomp} type="audio/mpeg" />
          </audio>
        </ViewportDiv>
      </div>
      <div style={{display: "flex", justifyContent: "center"}}>
        <ViewportDiv viewportHeight={90} viewportWidth={10}>
          <Board spriteType={ItemTypes.PALETTE} sprites={paletteSpriteLayout} 
          handleBoardDrop={handlePaletteDrop}
          unitsWidth={2} unitsHeight={29}/>
        </ViewportDiv>
        <ViewportDiv viewportHeight={90} viewportWidth={5} />
        <ViewportDiv viewportHeight={90} viewportWidth={85}>
          <Board spriteType={ItemTypes.SPRITE} sprites={sprites} handleSpriteIdClicked={handleSimulationSpriteClick}
          handleBoardDrop={handleBoardDrop} backgroundImage={snowBackground} contain={false}/>
        </ViewportDiv>
      </div>
      <ResultsDisplay results={simulationResult} onClick={resetResult} />
      {simulating && <Snowfall />}
    </DndProvider>
  );
}

export default App;
