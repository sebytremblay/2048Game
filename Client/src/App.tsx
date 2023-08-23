import { useState, useEffect, useRef } from "react";
import { Button } from "./components/Button";
import "./App.less";

import { useThrottledCallback } from "use-debounce";
import { useGame } from "./components/Game/hooks/useGame";
import { Board, animationDuration, tileCount } from "./components/Board";
import { TileMeta } from "./components/Tile";


type State = {
  tiles: {
    [id: number]: TileMeta;
  };
  inMotion: boolean;
  hasChanged: boolean;
  byIds: number[];
};

/* eslint-disable react/jsx-no-target-blank */
export const App = () => {
  const [tiles, moveLeft, moveRight, moveUp, moveDown, getGameState, setGameState] = useGame();
  const [gameId, setGameId] = useState("");
  const isMountedRef = useRef(true);

  let gameplayEnabled = true;

  async function handleReplay() {
    gameplayEnabled = false;
    let gameStateHistory: State[] = await getGameStateHistoryFromDB();

    let index = 0;

    function replayNextState() {
        if (index < gameStateHistory.length) {
            if (isMountedRef.current) {
                setGameState(gameStateHistory[index]);
            }
            index++;
            setTimeout(replayNextState, 1000);  // delay of 1 second
        } else {
            // Optionally reset or do something when replay is done
        }
    }

    replayNextState();
  };

  const saveCurrentState = () => {
    const currState: State = getGameState();
    addGameStateToDB(gameId, currState);
  }

  async function handleUndo() {
    const oldState: State = await getGameStateFromDB();
    console.log('Reseting to ' + oldState);
    setGameState(oldState);
  }

  async function addGameStateToDB(gameId: string, state: State) {
    const response = await fetch(`http://localhost:3000/games/${gameId}/state`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentState: state }),
    });
  
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
  
    const data = await response.json();
    return data;
  }
  
  async function getGameStateFromDB() {
    const response = await fetch(`http://localhost:3000/games/${gameId}/state`);
    const data = await response.json();
    return data;
  }

  async function getGameStateHistoryFromDB() {
    const response = await fetch(`http://localhost:3000/games/${gameId}/statehistory`);
    const data = await response.json();
    return data;
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
      // Define an async function for cleanup and call it immediately
      (async () => {
        try {
          const response = await fetch(`http://localhost:3000/games/${gameId}`, {
            method: 'DELETE',
          });
  
          if (!response.ok) {
            // Optionally handle the error based on the response status or message
            console.error('Failed to delete game data:', response.statusText);
          }
        } catch (error) {
          console.error('Error deleting game data:', error);
        }
      })();
    }
  };
  
  useEffect(() => {
    // This function sends a POST request to start a new game and sets the game ID
    async function initializeGame() {
      const initialState = getGameState();

      const response = await fetch('http://localhost:3000/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentState: initialState }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setGameId(data.gameId);
    }

    initializeGame();
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
    <div className="App">
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
