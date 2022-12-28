
import './App.css';
import Board from './Board';
import ViewportDiv from './ViewportDiv';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useCallback, useState } from 'react';
import { GAMEPALETTE, ItemTypes } from './Constants';
import ResultsDisplay from './ResultsDisplay';

const initialSprites = {palette:[], gameBoard:[]};
GAMEPALETTE.forEach((sprite, index)=>{
  initialSprites.palette.push({id:index, x:1, y:index*3+2, image:sprite.image, name:sprite.name});
});

function App() {
  const [sprites, setSprites] = useState(initialSprites);
  const [selectedSprite, setSelectedSprite] = useState();
  const [simulationResult, setSimulationResult] = useState();
  const [nextId, setNextId] = useState(6);

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
        setSprites({
          palette:sprites.palette,
          gameBoard: [...sprites.gameBoard, {...paletteSprite, x:boardX, y:boardY, id:nextId}]
        });
        setSelectedSprite(paletteSprite);
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
    return selectedSprite && hasEnoughSpritesToSimulate();
  },[selectedSprite, hasEnoughSpritesToSimulate]);

  const simulateButtonClick = useCallback(()=>{
    if (readyToSimulate()) setSimulationResult("I throw a snowball at you!");
    console.log("simulate clicked")
  },[readyToSimulate])
    
  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{display: "flex"}}>
        <ViewportDiv viewportHeight={80} viewportWidth={10}>
          <Board spriteType={ItemTypes.PALETTE} sprites={sprites.palette} 
          handleBoardDrop={handlePaletteDrop}
          unitsWidth={2} unitsHeight={24}/>
        </ViewportDiv>
        <ViewportDiv viewportHeight={80} viewportWidth={80}>
          <Board spriteType={ItemTypes.SPRITE} sprites={sprites.gameBoard} 
          handleBoardDrop={handleBoardDrop} />
        </ViewportDiv>
        <div style={{position:"absolute", top:"90vh", left:"50vh", 
          height:"5vh", width:"20vh"
          }}>
          <button style={{position:"absolute", top:"-50%", left:"-50%",
          background:readyToSimulate()?"green":"grey",
          }} onClick={simulateButtonClick}>
            {(!hasEnoughSpritesToSimulate() && <>Add more things</>)}
            {(hasEnoughSpritesToSimulate() && !selectedSprite && <>Move someone to simulate</>)}
            {(readyToSimulate() && <>Simulate {selectedSprite.name}'s strategy</>)}
          </button>
        </div>
        {!!simulationResult &&
          <ResultsDisplay>
            {simulationResult}
          </ResultsDisplay>
        }
      </div>
    </DndProvider>
  );
}

export default App;
