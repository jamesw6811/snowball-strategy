
import './App.css';
import Board from './Board';
import churchillImage from './images/churchill.jpg';
import ViewportDiv from './ViewportDiv';

function App() {
  var sprites = [{x:5, y:12, image:churchillImage, name:"Winston Churchill"}, 
    {x:15, y:3, image:churchillImage, name:"Winston Churchill"}, 
    {x:0, y:0, image:churchillImage, name:"Winston Churchill"}];
  var spritesSelector = [{x:1, y:1, image:churchillImage, name:"Winston Churchill"}, 
  {x:2, y:1, image:churchillImage, name:"Winston Churchill"}, 
  {x:1, y:2, image:churchillImage, name:"Winston Churchill"}, 
  {x:2, y:2, image:churchillImage, name:"Winston Churchill"}];
    
  return (
    <div style={{display: "flex"}}>
      <ViewportDiv viewportHeight={80} viewportWidth={10}>
        <Board sprites={spritesSelector} unitsWidth={3} unitsHeight={24}/>
      </ViewportDiv>
      <ViewportDiv viewportHeight={80} viewportWidth={80}>
        <Board sprites={sprites} />
      </ViewportDiv>
    </div>
  );
}

export default App;
