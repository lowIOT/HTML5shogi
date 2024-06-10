import React, { useEffect } from 'react';
import './Board.css';

const Board = ({ board, onPieceClick, selectedPiece }) => {
  useEffect(() => {
    const audio = new Audio('/move-sound.mp3');
    audio.play();
  }, [board]);

  return (
    <div className="board">
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`cell ${selectedPiece && selectedPiece[0] === rowIndex && selectedPiece[1] === colIndex ? 'selected' : ''}`}
            onClick={() => onPieceClick(rowIndex, colIndex)}
          >
            {piece && <div className="piece">{piece}</div>}
          </div>
        ))
      )}
    </div>
  );
};

export default Board;
