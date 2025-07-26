# Ink Chinese Chess (中国象棋)

A beautiful terminal-based Chinese Chess (Xiangqi) game built with React Ink. Play the classic strategy game right in your terminal with an elegant, traditional board layout.

## Features

- 🎮 Full Chinese Chess gameplay with traditional rules
- 🎨 Beautiful terminal UI with clean grid lines and borders
- 🔴🔵 Color-coded pieces (Red vs Blue)
- ⌨️ Keyboard controls for smooth gameplay
- 🟢 Visual move indicators and piece highlighting
- 🏛️ Traditional "楚河汉界" (Chu River Han Boundary) display

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ink-chess
```

2. Install dependencies:
```bash
npm install
```

3. Start the game:
```bash
npm start
```

## How to Play

### Game Objective
The goal is to checkmate your opponent's General (将/帅) by putting it in a position where it cannot escape capture.

### Controls
- **Arrow Keys**: Move the cursor around the board
- **Enter/Space**: Select a piece or confirm a move
- **Q**: Quit the game

### Game Pieces

#### Red Pieces (Bottom)
- **帅 (Shuài)** - General: The most important piece, must be protected
- **仕 (Shì)** - Guard: Protects the General, moves diagonally within the palace
- **相 (Xiàng)** - Elephant: Moves diagonally, cannot cross the river
- **俥 (Jū)** - Chariot: Moves horizontally and vertically, most powerful piece
- **傌 (Mǎ)** - Horse: Moves in an "L" shape, can be blocked
- **炮 (Pào)** - Cannon: Moves like a chariot but needs to jump over pieces to capture
- **兵 (Bīng)** - Soldier: Moves forward, can move sideways after crossing the river

#### Black Pieces (Top)
- **将 (Jiāng)** - General: Same as red General
- **士 (Shì)** - Guard: Same as red Guard
- **象 (Xiàng)** - Elephant: Same as red Elephant
- **车 (Chē)** - Chariot: Same as red Chariot
- **马 (Mǎ)** - Horse: Same as red Horse
- **砲 (Pào)** - Cannon: Same as red Cannon
- **卒 (Zú)** - Soldier: Same as red Soldier

### Basic Rules

1. **Turn-based**: Red moves first, then players alternate turns
2. **River Boundary**: The board is divided by the "楚河汉界" (Chu River Han Boundary)
3. **Palace**: The 3×3 area where Generals and Guards are confined
4. **Piece Movement**: Each piece has unique movement patterns
5. **Capture**: Land on an opponent's piece to capture it
6. **Check**: When the General is under attack, it must be moved to safety
7. **Checkmate**: When the General cannot escape capture, the game ends

### Special Rules

- **Generals cannot face each other**: They cannot be on the same file with no pieces between them
- **Elephants cannot cross the river**: They are confined to their own side
- **Guards and Generals stay in the palace**: They cannot leave the 3×3 palace area
- **Horse blocking**: A horse can be blocked if there's a piece adjacent to it in the direction of movement
- **Cannon jumping**: Cannons must jump over exactly one piece to capture

### Gameplay Tips

1. **Protect your General**: Always ensure your General is safe
2. **Control the center**: Pieces in the center have more mobility
3. **Coordinate attacks**: Use multiple pieces to create threats
4. **Develop pieces early**: Get your pieces into active positions
5. **Watch for tactics**: Look for forks, pins, and skewers
6. **Plan ahead**: Think several moves in advance

## Game Interface

```
中国象棋 - 当前玩家: 红
使用方向键移动光标，回车或空格选择/移动棋子，q 退出

┠ 车 马 象 士 将 士 象 马 车 ┨
┠ 十 十 十 十 十 十 十 十 十 ┨
┠ 十 砲 十 十 十 十 十 砲 十 ┨
┠ 卒 十 卒 十 卒 十 卒 十 卒 ┨
┠ ～ 楚 河 ～ ～ ～ 汉 界 ～ ┨
┠ 十 十 十 十 十 十 十 十 十 ┨
┠ 兵 十 兵 十 兵 十 兵 十 兵 ┨
┠ 十 炮 十 十 十 十 十 炮 十 ┨
┠ 十 十 十 十 十 十 十 十 十 ┨
┠ 俥 傌 相 仕 帅 仕 相 傌 俥 ┨
```

- **十**: Empty intersection
- **🟢**: Available move position
- **Highlighted piece**: Currently selected piece
- **Color coding**: Red pieces vs Blue pieces for easy distinction

## Development

### Tech Stack
- **React**: UI framework
- **Ink**: Terminal UI library
- **TypeScript**: Type safety
- **Node.js**: Runtime environment

### Project Structure
```
src/
├── components/          # React components
│   ├── App.tsx         # Main application
│   ├── Board.tsx       # Game board rendering
│   ├── Chess.tsx       # Individual chess pieces
│   └── Marker.tsx      # Move markers
├── game/               # Game logic
│   └── game.ts         # Core game mechanics
├── types/              # TypeScript definitions
│   ├── chess.ts        # Chess piece types
│   ├── marker.ts       # Marker types
│   └── position.ts     # Position types
└── index.tsx           # Entry point
```

### Building
```bash
npm run build
```

### Running
```bash
node dist/index.js
```

## License

MIT License - see LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Enjoy playing Chinese Chess in your terminal! 🎮