import React, { useState, useCallback } from 'react'
import { Box, Text, useInput } from 'ink'
import { GameState, createInitialGame, click } from '../game/game.js'
import { ChessColor } from '../types/chess.js'
import { Board } from './Board.js'
import { Chess } from './Chess.js'
import { Marker } from './Marker.js'

const App: React.FC = () => {
  const [game, setGame] = useState<GameState>(() => createInitialGame())
  const [cursorX, setCursorX] = useState(0)
  const [cursorY, setCursorY] = useState(0)

  const handleInput = useCallback(
    (input: string, key: any) => {
      if (key.leftArrow && cursorX > 0) {
        setCursorX(cursorX - 1)
      } else if (key.rightArrow && cursorX < 8) {
        setCursorX(cursorX + 1)
      } else if (key.upArrow && cursorY > 0) {
        setCursorY(cursorY - 1)
      } else if (key.downArrow && cursorY < 9) {
        setCursorY(cursorY + 1)
      } else if (key.return || input === ' ') {
        // 点击当前位置
        setGame(click({ x: cursorX, y: cursorY })(game))
      } else if (input === 'q') {
        process.exit(0)
      }
    },
    [cursorX, cursorY, game]
  )

  useInput(handleInput)

  const formatColor = (color: ChessColor) => {
    return color === ChessColor.Red ? '红' : '黑'
  }

  return (
    <Box flexDirection="column">
      <Text>
        中国象棋 - 当前玩家: {formatColor(game.currentPlayer)}
      </Text>
      <Text>
        使用方向键移动光标，回车或空格选择/移动棋子，q 退出
      </Text>
      <Box marginTop={1}>
        <Board 
          cursorX={cursorX} 
          cursorY={cursorY} 
          situation={game.situation}
          markers={game.markers}
        />
      </Box>
    </Box>
  )
}

export default App