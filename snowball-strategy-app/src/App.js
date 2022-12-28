
import './App.css';
import Board from './Board';

function App() {
  var sprites = [{x:5, y:12, image:0}, {x:15, y:3, image:0}, {x:0, y:0, image:0}];
  return (
      <Board sprites={sprites} />
  );
}

export default App;
