import React from 'react'
import { Box, Text } from 'ink'
import { ChessState } from '../types/chess.js'
import { Marker as MarkerType } from '../types/marker.js'
import { Chess } from './Chess.js'
import { Marker } from './Marker.js'

interface BoardProps {
  cursorX: number
  cursorY: number
  situation: ChessState[]
  markers: MarkerType[]
}

export const Board: React.FC<BoardProps> = ({ cursorX, cursorY, situation, markers }) => {
  const renderBoard = () => {
    const board = []
    
    for (let y = 0; y < 10; y++) {
      const row = []
      
      // Add left border
      row.push(
        <Text key={`left-${y}`}>
          {'┠'}
        </Text>
      )
      
      for (let x = 0; x < 9; x++) {
        const isCursor = x === cursorX && y === cursorY
        const chess = situation.find(c => c.position.x === x && c.position.y === y)
        const marker = markers.find(m => m.x === x && m.y === y)
        
        let cellContent = '十'
        let cellColor = undefined
        
        if (chess) {
          // Display chess piece with color
          const pieceChar = getPieceChar(chess)
          cellColor = chess.color === 1 ? 'red' : 'blue'
          cellContent = pieceChar
        } else if (marker) {
          cellContent = '🟢'
          cellColor = 'green'
        } 
        
        // Add space before cell content
        row.push(
          <Text key={`space-${x}-${y}`}>
            {' '}
          </Text>
        )
        
        if (isCursor) {
          row.push(
            <Text key={`${x}-${y}`} color={cellColor} inverse>
              {cellContent}
            </Text>
          )
        } else {
          row.push(
            <Text key={`${x}-${y}`} color={cellColor}>
              {cellContent}
            </Text>
          )
        }
      }
      
      // Add space and right border
      row.push(
        <Text key={`space-end-${y}`}>
          {' '}
        </Text>
      )
      row.push(
        <Text key={`right-${y}`}>
          {'┨'}
        </Text>
      )
      
      board.push(
        <Box key={y} flexDirection="row">
          {row}
        </Box>
      )
      
      // Add river line at y = 4
      if (y === 4) {
        const riverRow = []
        riverRow.push(
          <Text key={`river-left`}>
            {'┠ ～ 楚 河 ～ ～ ～ 汉 界 ～ ┨'}
          </Text>
        )
        board.push(
          <Box key={`river`} flexDirection="row">
            {riverRow}
          </Box>
        )
      }
    }
    
    return board
  }

  return (
    <Box flexDirection="column">
      {renderBoard()}
    </Box>
  )
}

function getPieceChar(chess: ChessState): string {
  const { color, value } = chess
  const redPieces = {
    100: '帅', // General
    50: '俥',  // Chariot
    30: '炮',  // Cannon
    29: '傌',  // Horse
    16: '相',  // Elephant
    10: '仕',  // Guard
    1: '兵',   // Soldier
  }
  
  const blackPieces = {
    100: '将', // General
    50: '车',  // Chariot
    30: '砲',  // Cannon
    29: '马',  // Horse
    16: '象',  // Elephant
    10: '士',  // Guard
    1: '卒',   // Soldier
  }
  
  return color === 1 ? redPieces[value as keyof typeof redPieces] : blackPieces[value as keyof typeof blackPieces]
}