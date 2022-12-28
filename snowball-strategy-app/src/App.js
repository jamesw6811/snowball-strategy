
import './App.css';
import Board from './Board';
import churchillImage from './images/churchill.jpg';
import ViewportDiv from './ViewportDiv';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useCallback, useState } from 'react';
import { ItemTypes } from './Constants';

function App() {
  const [sprites, setSprites] = useState({gameBoard:[{id:0, x:5, y:12, image:churchillImage, name:"Winston Churchill"}, 
      {id:1, x:15, y:3, image:churchillImage, name:"Winston Churchill"}, 
      {id:2, x:0, y:0, image:churchillImage, name:"Winston Churchill"}],
    palette:[{x:1, y:1, image:churchillImage, name:"Winston Churchill"}, 
      {id:3, x:2, y:1, image:churchillImage, name:"Winston Churchill"}, 
      {id:4, x:1, y:2, image:churchillImage, name:"Winston Churchill"}, 
      {id:5, x:2, y:2, image:churchillImage, name:"Winston Churchill"}]});
  
  const [nextId, setNextId] = useState(6);

  const handleBoardDrop = useCallback(({id, boardX, boardY, type})=>{
    if (type===ItemTypes.SPRITE) {
      setSprites({
        palette:sprites.palette,
        gameBoard: sprites.gameBoard.map(
          (sprite)=>sprite.id===id?{...sprite, x:boardX, y:boardY}:sprite)
      });
    } else if (type===ItemTypes.PALETTE) {
      const paletteSprite = sprites.palette.find((sprite)=>sprite.id===id);
      if (paletteSprite){
        setSprites({
          palette:sprites.palette,
          gameBoard: [...sprites.gameBoard, {...paletteSprite, x:boardX, y:boardY, id:nextId}]
        });
        setNextId(nextId+1);
      } else {
        console.error("Palette id not found");
      }
    } else {
      console.error("Type not found");
    }
  },[nextId, sprites]);

  const handlePaletteDrop = useCallback(({id, boardX, boardY, type})=>{
    console.log(id);
    console.log(sprites.gameBoard);
    console.log(sprites.gameBoard.filter((sprite)=>sprite.id!==id));
    if (type===ItemTypes.SPRITE) {
      setSprites({
        palette: sprites.palette,
        gameBoard: sprites.gameBoard.filter((sprite)=>sprite.id!==id)
      });
    }
  },[sprites]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{display: "flex"}}>
        <ViewportDiv viewportHeight={80} viewportWidth={10}>
          <Board spriteType={ItemTypes.PALETTE} sprites={sprites.palette} 
          handleBoardDrop={handlePaletteDrop}
          unitsWidth={3} unitsHeight={24}/>
        </ViewportDiv>
        <ViewportDiv viewportHeight={80} viewportWidth={80}>
          <Board spriteType={ItemTypes.SPRITE} sprites={sprites.gameBoard} 
          handleBoardDrop={handleBoardDrop} />
        </ViewportDiv>
      </div>
    </DndProvider>
  );
}

export default App;
