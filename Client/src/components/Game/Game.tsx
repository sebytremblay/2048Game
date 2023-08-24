import { useEffect, useRef, useState } from "react";
import { useThrottledCallback } from "use-debounce";
import { useGame } from "./hooks/useGame";
import { Board, animationDuration, tileCount } from "../Board";
import { Button } from "../Button";
import { State } from "./hooks/useGame/reducer";
import {
  addGameStateToDB,
  getGameStateFromDB,
  getGameStateHistoryFromDB,
  initializeGame,
  deleteGame
} from "./services/api";

export type GameRef = {
  undoMove: () => void;
}

export const Game = () => {
  const [tiles, moveLeft, moveRight, moveUp, moveDown, getGameState, setGameState] = useGame();
  const [gameId, setGameId] = useState("");
  const isMountedRef = useRef(true);

  let gameplayEnabled = true;

  async function handleReplay() {
    gameplayEnabled = false;
    let gameStateHistory: State[] = await getGameStateHistoryFromDB(gameId);

    // Skips blank initial state
    let replayIndex = 1;

    function replayNextState() {
      if (replayIndex < gameStateHistory.length) {
        if (isMountedRef.current) {
          setGameState(gameStateHistory[replayIndex]);
        }
        replayIndex++;
        setTimeout(replayNextState, 1000);  // delay of 1 second
      } else {
        // Optionally reset or do something when replay is done
      }
    }

    replayNextState();
  }

  const saveCurrentState = () => {
    const currState: State = getGameState();
    addGameStateToDB(gameId, currState);
  }

  async function handleUndo() {
    const oldState: State = await getGameStateFromDB(gameId);
    console.log('Reseting to ' + oldState);
    setGameState(oldState);
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    // disables page scrolling with keyboard arrows
    e.preventDefault();

    if (gameplayEnabled) {
      switch (e.code) {
        case "ArrowLeft":
          moveLeft();
          saveCurrentState();
          break;
        case "ArrowRight":
          moveRight();
          saveCurrentState();
          break;
        case "ArrowUp":
          moveUp();
          saveCurrentState();
          break;
        case "ArrowDown":
          moveDown();
          saveCurrentState();
          break;
      }
    }
  };

  // protects the reducer from being flooded with events.
  const throttledHandleKeyDown = useThrottledCallback(
    handleKeyDown,
    animationDuration,
    { leading: true, trailing: false }
  );

  const deleteGameDataOnTeardown = () => {
    if (gameId) {
      deleteGame(gameId)
    };
  };

  useEffect(() => {
    // This function sends a POST request to start a new game and sets the game ID
    async function setupGame() {
      const initialState = getGameState();
      const data = await initializeGame(initialState);
      setGameId(data.gameId);
    }

    setupGame();
    window.addEventListener("keydown", throttledHandleKeyDown);
    window.addEventListener("beforeunload", deleteGameDataOnTeardown);
    isMountedRef.current = true;

    return () => {
      window.removeEventListener("keydown", throttledHandleKeyDown);
      window.removeEventListener("beforeunload", deleteGameDataOnTeardown);
      isMountedRef.current = false;
    };
  }, []); // Removed dependencies

  return (
    <div className="gameboard">
      <div className="header">
        <div>
          <h1>Play 2048</h1>
        </div>
        <div className="button-container">
          <Button onClick={handleUndo} className="undo-button">Undo Move</Button>
          <Button onClick={handleReplay} className="restart-button">Restart</Button>
        </div>
      </div>
      <Board tiles={tiles} tileCountPerRow={tileCount} />
    </div>
  );
};