import React from 'react'
import { Text } from 'ink'
import { ChessState, ChessColor, ChessValue } from '../types/chess.js'

interface ChessProps {
  chess: ChessState
}

const formatChessValue = (color: ChessColor, value: ChessValue): string => {
  const redPieces = {
    [ChessValue.General]: '帅',
    [ChessValue.Guard]: '仕',
    [ChessValue.Elephant]: '相',
    [ChessValue.Horse]: '马',
    [ChessValue.Chariot]: '车',
    [ChessValue.Cannon]: '炮',
    [ChessValue.Soldier]: '兵',
  }
  
  const blackPieces = {
    [ChessValue.General]: '将',
    [ChessValue.Guard]: '士',
    [ChessValue.Elephant]: '象',
    [ChessValue.Horse]: '马',
    [ChessValue.Chariot]: '车',
    [ChessValue.Cannon]: '炮',
    [ChessValue.Soldier]: '卒',
  }
  
  return color === ChessColor.Red ? redPieces[value] : blackPieces[value]
}

export const Chess: React.FC<ChessProps> = ({ chess }) => {
  const { color, value, position, selected, marked } = chess
  
  let style = ''
  if (selected) {
    style = 'inverse'
  } else if (marked) {
    style = 'underline'
  }
  
  const pieceText = formatChessValue(color, value)
  const coloredText = color === ChessColor.Red ? `{red-fg}${pieceText}{/red-fg}` : `{black-fg}${pieceText}{/black-fg}`
  
  return (
    <Text
      color={color === ChessColor.Red ? 'red' : 'black'}
      inverse={selected}
      underline={marked}
    >
      {pieceText}
    </Text>
  )
}