const getValidMoves = (board, row, col) => {
	const piece = board[row][col];
	const moves = [];
	// 各駒の動きに応じた有効な移動を追加
	switch (piece) {
	  case "歩":
		if (row + 1 < 9 && board[row + 1][col] === "") {
		  moves.push([row + 1, col]);
		}
		break;
	  case "香":
		for (let i = row + 1; i < 9; i++) {
		  if (board[i][col] === "") {
			moves.push([i, col]);
		  } else {
			break;
		  }
		}
		break;
	  case "桂":
		if (row + 2 < 9 && col - 1 >= 0 && board[row + 2][col - 1] === "") {
		  moves.push([row + 2, col - 1]);
		}
		if (row + 2 < 9 && col + 1 < 9 && board[row + 2][col + 1] === "") {
		  moves.push([row + 2, col + 1]);
		}
		break;
	  case "銀":
		const silverMoves = [[1, -1], [1, 1], [-1, -1], [-1, 1], [1, 0]];
		silverMoves.forEach(([dRow, dCol]) => {
		  if (row + dRow < 9 && col + dCol < 9 && col + dCol >= 0 && board[row + dRow][col + dCol] === "") {
			moves.push([row + dRow, col + dCol]);
		  }
		});
		break;
	  case "金":
	  case "成銀":
		const goldMoves = [[1, -1], [1, 0], [1, 1], [0, -1], [0, 1], [-1, 0]];
		goldMoves.forEach(([dRow, dCol]) => {
		  if (row + dRow < 9 && col + dCol < 9 && col + dCol >= 0 && board[row + dRow][col + dCol] === "") {
			moves.push([row + dRow, col + dCol]);
		  }
		});
		break;
	  case "王":
		const kingMoves = [[1, -1], [1, 0], [1, 1], [0, -1], [0, 1], [-1, -1], [-1, 0], [-1, 1]];
		kingMoves.forEach(([dRow, dCol]) => {
		  if (row + dRow < 9 && col + dCol < 9 && col + dCol >= 0 && board[row + dRow][col + dCol] === "") {
			moves.push([row + dRow, col + dCol]);
		  }
		});
		break;
	  case "飛":
		for (let i = row + 1; i < 9; i++) {
		  if (board[i][col] === "") {
			moves.push([i, col]);
		  } else {
			break;
		  }
		}
		for (let i = row - 1; i >= 0; i--) {
		  if (board[i][col] === "") {
			moves.push([i, col]);
		  } else {
			break;
		  }
		}
		for (let i = col + 1; i < 9; i++) {
		  if (board[row][i] === "") {
			moves.push([row, i]);
		  } else {
			break;
		  }
		}
		for (let i = col - 1; i >= 0; i--) {
		  if (board[row][i] === "") {
			moves.push([row, i]);
		  } else {
			break;
		  }
		}
		break;
	  case "角":
		for (let i = 1; row + i < 9 && col + i < 9; i++) {
		  if (board[row + i][col + i] === "") {
			moves.push([row + i, col + i]);
		  } else {
			break;
		  }
		}
		for (let i = 1; row - i >= 0 && col + i < 9; i++) {
		  if (board[row - i][col + i] === "") {
			moves.push([row - i, col + i]);
		  } else {
			break;
		  }
		}
		for (let i = 1; row + i < 9 && col - i >= 0; i++) {
		  if (board[row + i][col - i] === "") {
			moves.push([row + i, col - i]);
		  } else {
			break;
		  }
		}
		for (let i = 1; row - i >= 0 && col - i >= 0; i++) {
		  if (board[row - i][col - i] === "") {
			moves.push([row - i, col - i]);
		  } else {
			break;
		  }
		}
		break;
	  default:
		break;
	}
	return moves;
  };
  
  const evaluateBoard = (board) => {
	let score = 0;
	board.forEach(row => {
	  row.forEach(cell => {
		switch (cell) {
		  case "王":
			score += 1000;
			break;
		  case "玉":
			score -= 1000;
			break;
		  case "金":
		  case "銀":
		  case "成銀":
		  case "飛":
		  case "角":
		  case "桂":
		  case "香":
		  case "歩":
			score += 1;
			break;
		  case "成歩":
			score += 2;
			break;
		  default:
			break;
		}
	  });
	});
	return score;
  };
  
  const minimax = (board, depth, alpha, beta, isMaximizingPlayer) => {
	if (depth === 0) {
	  return evaluateBoard(board);
	}
  
	const validMoves = [];
	board.forEach((row, rowIndex) => {
	  row.forEach((piece, colIndex) => {
		if (piece && (isMaximizingPlayer ? piece === "王" : piece === "玉")) {
		  validMoves.push(...getValidMoves(board, rowIndex, colIndex).map(move => ({ from: [rowIndex, colIndex], to: move })));
		}
	  });
	});
  
	if (isMaximizingPlayer) {
	  let maxEval = -Infinity;
	  for (const move of validMoves) {
		const newBoard = applyMove(board, move);
		const evaluation = minimax(newBoard, depth - 1, alpha, beta, false);
		maxEval = Math.max(maxEval, evaluation);
		alpha = Math.max(alpha, evaluation);
		if (beta <= alpha) {
		  break;
		}
	  }
	  return maxEval;
	} else {
	  let minEval = Infinity;
	  for (const move of validMoves) {
		const newBoard = applyMove(board, move);
		const evaluation = minimax(newBoard, depth - 1, alpha, beta, true);
		minEval = Math.min(minEval, evaluation);
		beta = Math.min(beta, evaluation);
		if (beta <= alpha) {
		  break;
		}
	  }
	  return minEval;
	}
  };
  
  const getBestMove = (board) => {
	let bestMove = null;
	let bestValue = -Infinity;
	const alpha = -Infinity;
	const beta = Infinity;
  
	board.forEach((row, rowIndex) => {
	  row.forEach((piece, colIndex) => {
		if (piece === "王") {
		  const validMoves = getValidMoves(board, rowIndex, colIndex);
		  validMoves.forEach(move => {
			const newBoard = applyMove(board, { from: [rowIndex, colIndex], to: move });
			const boardValue = minimax(newBoard, 3, alpha, beta, false);
			if (boardValue > bestValue) {
			  bestValue = boardValue;
			  bestMove = { from: [rowIndex, colIndex], to: move };
			}
		  });
		}
	  });
	});
  
	return bestMove;
  };
  
  const applyMove = (board, move) => {
	const newBoard = board.map(row => row.slice());
	const [fromRow, fromCol] = move.from;
	const [toRow, toCol] = move.to;
	newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
	newBoard[fromRow][fromCol] = "";
	return newBoard;
  };
  
  export const makeAIMove = (board) => {
	const move = getBestMove(board);
	return applyMove(board, move);
  };
  