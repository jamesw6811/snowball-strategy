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
import './App.css';
import JinglePlayer from './JinglePlayer';

const paletteSpriteLayout = new Map();
SpritePalette.forEach((sprite, index)=>{
  paletteSpriteLayout.set(index, {x:1, y:index*3+2, image:sprite.image, name:sprite.name});
});

function App() {
  const [boardSprites, setBoardSprites] = useState(new Map());
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
    const newSprites = new Map(boardSprites);
    newSprites.set(id, {...boardSprites.get(id), x:boardX, y:boardY});
    setBoardSprites(newSprites);
    setSelectedSpriteId(id);
  }, [boardSprites]);

  const handleSpritePlaced = useCallback(({boardX, boardY, id})=>{
    const newSprite = {...paletteSpriteLayout.get(id), 
      x:boardX, y:boardY};
    const newSprites = new Map(boardSprites);
    const newId = nextId();
    newSprites.set(newId, newSprite);
    setBoardSprites(newSprites);
    setSelectedSpriteId(newId);
  }, [boardSprites, nextId]);
  
  const handleSpriteRemoved = useCallback((id)=>{
    const newSprites = new Map(boardSprites);
    newSprites.delete(id);
    setBoardSprites(newSprites);
    setSelectedSpriteId(null);
  }, [boardSprites]);

  const handleBoardDrop = useCallback(({type, ...dropParams})=>{
    if (type===ItemTypes.BOARDSPRITE) {
      handleSpriteMoved(dropParams);
    } else if (type===ItemTypes.PALETTESPRITE) {
      handleSpritePlaced(dropParams);
    } else {
      console.error("Type not found");
      return;
    }
  },[handleSpriteMoved, handleSpritePlaced]);

  const handlePaletteDrop = useCallback(({id, type})=>{
    if (type===ItemTypes.BOARDSPRITE) {
      handleSpriteRemoved(id);
    }
  },[handleSpriteRemoved]);

  const hasEnoughSpritesToSimulate = useCallback(()=>{
    return boardSprites.size > 1;
  },[boardSprites]);

  const readyToSimulate = useCallback(()=>{
    return (selectedSpriteId!=null) && hasEnoughSpritesToSimulate() && !simulating;
  },[selectedSpriteId, hasEnoughSpritesToSimulate, simulating]);

  const simulate = wrapWithSimulating(useCallback(async ()=>{
    const text = await runGPTCompletion(
      createSimulationPrompt(boardSprites, selectedSpriteId)
    );
    setSimulationResult(formatSimulationResult(boardSprites.get(selectedSpriteId).name, text));
  }, [selectedSpriteId, boardSprites]));

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
      <div className='viewportrow'>
        <ViewportDiv viewportHeight={7} viewportWidth={100}>
          <div className="topbar">
            <ViewportDiv viewportHeight={5} viewportWidth={50}>
              <SimulateButton enoughSprites={hasEnoughSpritesToSimulate()} 
                readyToSimulate={readyToSimulate()}
                simulating={simulating}
                selectedSprite={boardSprites.get(selectedSpriteId)} 
                onClick={simulateButtonClick} />
            </ViewportDiv>
            <ViewportDiv viewportHeight={3} viewportWidth={3}>
              <InfoButton onClick={onClickInfo} />
            </ViewportDiv>
            <ViewportDiv viewportHeight={3} viewportWidth={40}>
              <JinglePlayer />
            </ViewportDiv>
          </div>
        </ViewportDiv>
      </div>
      <div className='viewportrow'>
        <ViewportDiv viewportHeight={90} viewportWidth={10}>
          <Board spriteType={ItemTypes.PALETTESPRITE} sprites={paletteSpriteLayout} 
          handleBoardDrop={handlePaletteDrop}
          unitsWidth={2} unitsHeight={29}/>
        </ViewportDiv>
        <ViewportDiv viewportHeight={90} viewportWidth={5} />
        <ViewportDiv viewportHeight={90} viewportWidth={85}>
          <Board spriteType={ItemTypes.BOARDSPRITE} sprites={boardSprites} handleSpriteIdClicked={handleSimulationSpriteClick}
          handleBoardDrop={handleBoardDrop} backgroundImage={snowBackground} contain={false}/>
        </ViewportDiv>
      </div>
      <ResultsDisplay results={simulationResult} onClick={resetResult} />
      {simulating && <Snowfall />}
    </DndProvider>
  );
}

export default App;
