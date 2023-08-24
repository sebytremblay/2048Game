import "./App.less";
import { Game } from "./components/Game"

/* eslint-disable react/jsx-no-target-blank */
export const App = () => {
  return (
    <div className="App">
      <Game />
      <div>
        <p>
          <strong>HOW TO PLAY:</strong> Use your arrow keys to move the tiles. 
          Tiles with the same number merge into one when they touch. Add them up to reach 2048!
        </p>
      </div>
    </div>
  );
};
/* eslint-enable react/jsx-no-target-blank */
