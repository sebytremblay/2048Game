import React, { useEffect, useImperativeHandle } from "react";
import { useThrottledCallback } from "use-debounce";

import { useGame } from "./hooks/useGame";
import { Board, animationDuration, tileCount } from "../Board";

import { Button } from "../Button";

export type GameRef = {
  undoMove: () => void;
}

export const Game = React.forwardRef<GameRef, {}>((props, ref) => {
  const [tiles, moveLeft, moveRight, moveUp, moveDown, undoMove] = useGame();

  const handleKeyDown = (e: KeyboardEvent) => {
    // disables page scrolling with keyboard arrows
    e.preventDefault();

    switch (e.code) {
      case "ArrowLeft":
        moveLeft();
        break;
      case "ArrowRight":
        moveRight();
        break;
      case "ArrowUp":
        moveUp();
        break;
      case "ArrowDown":
        moveDown();
        break;
    }
  };

  useImperativeHandle(ref, () => ({
    undoMove,
  }));

  // protects the reducer from being flooded with events.
  const throttledHandleKeyDown = useThrottledCallback(
    handleKeyDown,
    animationDuration,
    { leading: true, trailing: false }
  );

  useEffect(() => {
    window.addEventListener("keydown", throttledHandleKeyDown);

    return () => {
      window.removeEventListener("keydown", throttledHandleKeyDown);
    };
  }, [throttledHandleKeyDown]);

  return (
    <div>
    <div className="button-container">
    <Button onClick={undoMove} className="undo-button">Undo Move</Button>
    <Button onClick={undoMove} className="restart-button">Restart</Button>
    </div>
    <Board tiles={tiles} tileCountPerRow={tileCount} />
  </div>
  );
});