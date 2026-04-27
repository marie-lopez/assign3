import * as React from 'react'
import * as ReactBootstrap from 'react-bootstrap'
import { useState } from 'react';
const { Button } = ReactBootstrap;

function Square({ value, onSquareClick, }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, selected, setSelected }) {
  function handleClick(i) {
    if (calculateWinner(squares)) return;

    const player = xIsNext ? 'X' : 'O';
    const playerSquares = squares.map((val, idx) => (val === player ? idx : null)).filter(v => v !== null);
    const nextSquares = squares.slice();

    if (playerSquares.length < 3) {
      if (squares[i]) return;
      nextSquares[i] = player;
      onPlay(nextSquares);
      return;
    }

    if (selected === null) {
      if (squares[i] === player) {
        setSelected(i);
      }
      return;
    }

    if (squares[i]) return;
    const r1 = Math.floor(selected / 3);
    const c1 = selected % 3;
    const r2 = Math.floor(i / 3);
    const c2 = i % 3;

    const isAdjacent =
      Math.abs(r1 - r2) <= 1 &&
      Math.abs(c1 - c2) <= 1;

    if (!isAdjacent) return;

    const hasCenter = squares[4] === player;

    if (hasCenter && selected !== 4) {
      const temp = nextSquares.slice();
      temp[selected] = null;
      temp[i] = player;
      const isMovingCenter = selected === 4;
      if (!calculateWinner(temp) && !isMovingCenter) {
        return;
      }
    }

    nextSquares[selected] = null;
    nextSquares[i] = player;

    setSelected(null);
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const status = winner
    ? 'Winner: ' + winner
    : 'Next player: ' + (xIsNext ? 'X' : 'O');

  return (
    <>
      <div className="status">{status}</div>
      {[0, 3, 6].map(row => (
        <div className="board-row" key={row}>
          {[0, 1, 2].map(col => {
            const i = row + col;
            return (
              <Square
                key={i}
                value={squares[i]}
                onSquareClick={() => handleClick(i)}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [selected, setSelected] = useState(null);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      nextSquares
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setSelected(null);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setSelected(null);
  }

  const moves = history.map((_, move) => (
    <li key={move}>
      <button onClick={() => jumpTo(move)}>
        {move ? 'Go to move #' + move : 'Go to game start'}
      </button>
    </li>
  ));

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          selected={selected}
          setSelected={setSelected}
        />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let [a,b,c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}