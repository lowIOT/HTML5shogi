import React, { useState, useEffect } from 'react';
import Board from './Board';
import { makeAIMove } from './AI';
import './ShogiGame.css';

const ShogiGame = () => {
  const initialBoard = [
    ["香", "桂", "銀", "金", "王", "金", "銀", "桂", "香"],
    ["", "飛", "", "", "", "", "", "角", ""],
    ["歩", "歩", "歩", "歩", "歩", "歩", "歩", "歩", "歩"],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["歩", "歩", "歩", "歩", "歩", "歩", "歩", "歩", "歩"],
    ["", "角", "", "", "", "", "", "飛", ""],
    ["香", "桂", "銀", "金", "玉", "金", "銀", "桂", "香"]
  ];

  const [board, setBoard] = useState(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  const handlePieceClick = (row, col) => {
    if (isPlayerTurn && gameStarted) {
      if (selectedPiece) {
        if (isValidMove(selectedPiece, [row, col])) {
          const newBoard = movePiece(board, selectedPiece, [row, col]);
          setBoard(newBoard);
          setSelectedPiece(null);
          setIsPlayerTurn(false);
          setTimeout(() => {
            const aiBoard = makeAIMove(newBoard);
            setBoard(aiBoard);
            setIsPlayerTurn(true);
          }, 500);
        } else {
          setSelectedPiece(null);
        }
      } else {
        setSelectedPiece([row, col]);
      }
    }
  };

  const isValidMove = (from, to) => {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    const piece = board[fromRow][fromCol];
    // 将棋の駒の動きをここでチェック
    switch (piece) {
      case "歩":
        return fromCol === toCol && fromRow + 1 === toRow;
      case "香":
        return fromCol === toCol && fromRow < toRow && !board.slice(fromRow + 1, toRow).some(row => row[fromCol] !== "");
      case "桂":
        return Math.abs(fromCol - toCol) === 1 && fromRow + 2 === toRow;
      case "銀":
        return (Math.abs(fromRow - toRow) === 1 && Math.abs(fromCol - toCol) === 1) || (fromRow + 1 === toRow && fromCol === toCol);
      case "金":
      case "成銀":
        return Math.abs(fromRow - toRow) <= 1 && Math.abs(fromCol - toCol) <= 1 && !(fromRow - 1 === toRow && Math.abs(fromCol - toCol) === 1);
      case "王":
        return Math.abs(fromRow - toRow) <= 1 && Math.abs(fromCol - toCol) <= 1;
      case "飛":
        return (fromRow === toRow || fromCol === toCol) && !board.slice(Math.min(fromRow, toRow) + 1, Math.max(fromRow, toRow)).some(row => row[fromCol] !== "") && !board[fromRow].slice(Math.min(fromCol, toCol) + 1, Math.max(fromCol, toCol)).some(cell => cell !== "");
      case "角":
        return Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol);
      default:
        return false;
    }
  };

  const movePiece = (board, from, to) => {
    const newBoard = board.map(row => row.slice());
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    const piece = newBoard[fromRow][fromCol];
    newBoard[toRow][toCol] = piece;
    newBoard[fromRow][fromCol] = "";
    // 成りのルールを追加
    if (piece === "歩" && toRow === 0) {
      newBoard[toRow][toCol] = "成歩";
    } else if (piece === "銀" && toRow <= 2) {
      newBoard[toRow][toCol] = "成銀";
    }
    return newBoard;
  };

  const checkForWin = (board) => {
    const playerKing = board.some(row => row.includes("玉"));
    const aiKing = board.some(row => row.includes("王"));
    if (!playerKing) alert("AIの勝利！");
    if (!aiKing) alert("プレイヤーの勝利！");
  };

  useEffect(() => {
    checkForWin(board);
  }, [board]);

  const startGame = (isPlayerFirst) => {
    setIsPlayerTurn(isPlayerFirst);
    setGameStarted(true);
    if (!isPlayerFirst) {
      setTimeout(() => {
        const aiBoard = makeAIMove(board);
        setBoard(aiBoard);
        setIsPlayerTurn(true);
      }, 500);
    }
  };

  return (
    <div className="shogi-game">
      {!gameStarted && (
        <div className="start-screen">
          <button onClick={() => startGame(true)}>先手</button>
          <button onClick={() => startGame(false)}>後手</button>
        </div>
      )}
      {gameStarted && <Board board={board} onPieceClick={handlePieceClick} selectedPiece={selectedPiece} />}
    </div>
  );
};

export default ShogiGame;
