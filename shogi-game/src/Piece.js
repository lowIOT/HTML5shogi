import React from 'react';
import './Piece.css';

const Piece = ({ type, color }) => {
  return <div className={`piece ${color}`}>{type}</div>;
};


export default Piece;
