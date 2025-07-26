import {
  ChessColor,
  ChessState,
  select as selectChess,
  unselect,
  move as moveChess,
  ChessValue,
  unmark,
  mark,
} from '../types/chess.js'
import { Marker } from '../types/marker.js'
import { PositionValue, isSamePosition } from '../types/position.js'

export type GameState = {
  currentPlayer: ChessColor
  selectedChess?: ChessState
  situation: ChessState[]
  markers: Marker[]
}

/**
 * 将的位置是否合法
 */
const isGeneralValid = (color: ChessColor, { x, y }: PositionValue) => {
  switch (color) {
    case ChessColor.Black:
      return !(x < 3 || x > 5 || (y > 2 && y < 7))
    case ChessColor.Red:
      return !(x < 3 || x > 5 || (y > 2 && y < 7))
  }
}

/**
 * 士的位置是否合法
 */
const isGuardValid = (color: ChessColor, { x, y }: PositionValue) => {
  switch (color) {
    case ChessColor.Black:
      return [
        [3, 0],
        [3, 2],
        [5, 0],
        [5, 2],
        [4, 1],
      ].find(([x1, y1]) => x1 === x && y1 === y)
    case ChessColor.Red:
      return [
        [3, 7],
        [3, 9],
        [5, 7],
        [5, 9],
        [4, 8],
      ].find(([x1, y1]) => x1 === x && y1 === y)
  }
}

/**
 * 象的位置是否合法
 */
const isElephantValid = (color: ChessColor, { x, y }: PositionValue) => {
  switch (color) {
    case ChessColor.Black:
      return [
        [0, 2],
        [2, 0],
        [2, 4],
        [4, 2],
        [6, 0],
        [6, 4],
        [8, 2],
      ].find(([x1, y1]) => x1 === x && y1 === y)
    case ChessColor.Red:
      return [
        [0, 7],
        [2, 5],
        [2, 9],
        [4, 7],
        [6, 5],
        [6, 9],
        [8, 7],
      ].find(([x1, y1]) => x1 === x && y1 === y)
  }
}

/**
 * 兵的位置是否合法
 */
const isSoldierValid = (color: ChessColor, { x, y }: PositionValue) => {
  switch (color) {
    case ChessColor.Black:
      return !(y < 3 || (y < 5 && x % 2 === 1))
    case ChessColor.Red:
      return !(y > 6 || (y > 4 && x % 2 === 1))
  }
}

const canCannonAttack =
  (game: GameState) =>
  ({ position: source }: ChessState, { x, y }: PositionValue) => {
    // 不在一条直线上，不能走
    if (source.x !== x && source.y !== y) {
      return false
    }

    // 先检测目标位置有无棋子
    if (
      game.situation.find((chess) => {
        return chess.position.x === x && chess.position.y === y
      })
    ) {
      // 目标位置非空，吃子的逻辑，检测中间时候有且仅有一个棋子
      // 同一水平线
      if (source.y === y) {
        return (
          game.situation.filter((chess) => {
            return chess.position.y === y && (chess.position.x - x) * (chess.position.x - source.x) < 0
          }).length === 1
        )
      }

      // 同一竖直线
      if (source.x === x) {
        return (
          game.situation.filter((chess) => {
            return chess.position.x === x && (chess.position.y - y) * (chess.position.y - source.y) < 0
          }).length === 1
        )
      }
    }

    return false
  }

const canGeneralMove =
  () =>
  ({ position: source }: ChessState, { x, y }: PositionValue) => {
    return Math.abs(source.y - y) + Math.abs(source.x - x) === 1
  }

const canGuardMove =
  () =>
  ({ position: source }: ChessState, { x, y }: PositionValue) => {
    const square = (a: number) => a * a
    return square(source.x - x) + square(source.y - y) === 2
  }

const canElephantMove =
  (game: GameState) =>
  ({ position: source }: ChessState, { x, y }: PositionValue) => {
    if (Math.abs(source.x - x) !== 2 || Math.abs(source.y - y) !== 2) {
      return false
    } else {
      // 象眼位置没有棋子
      return !game.situation.find((chess) => {
        return chess.position.x === (source.x + x) / 2 && chess.position.y === (source.y + y) / 2
      })
    }
  }

const canHorseMove =
  (game: GameState) =>
  ({ position: source }: ChessState, { x, y }: PositionValue) => {
    const dx = source.x - x
    const dy = source.y - y

    // 马走日，并且马腿的位置没有棋子
    return (
      dx * dx + dy * dy === 5 &&
      !game.situation.find((chess) => {
        return (
          chess.position.x === Math.round((2 * source.x + x) / 3) &&
          chess.position.y === Math.round((2 * source.y + y) / 3)
        )
      })
    )
  }

const canMoveStraightly =
  (game: GameState) =>
  ({ position: source }: ChessState, { x, y }: PositionValue) => {
    // 不在一条直线上，不能走
    if (source.x !== x && source.y !== y) {
      return false
    }

    // 同一条水平线，中间无棋子
    if (source.y === y) {
      return !game.situation.find(
        (chess) => chess.position.y === y && (chess.position.x - x) * (chess.position.x - source.x) < 0
      )
    }

    // 同一竖直线，中间无棋子
    if (source.x === x) {
      return !game.situation.find(
        (chess) => chess.position.x === x && (chess.position.y - y) * (chess.position.y - source.y) < 0
      )
    }

    return false
  }

const canSoldierMove =
  () =>
  ({ position: source, color }: ChessState, { x, y }: PositionValue) => {
    switch (color) {
      case ChessColor.Black:
        return y >= source.y && Math.abs(x - source.x) + Math.abs(y - source.y) === 1
      case ChessColor.Red:
        return y <= source.y && Math.abs(x - source.x) + Math.abs(y - source.y) === 1
    }
  }

/**
 * 判断在当前棋局下，某个棋子能否移动到目的位置
 */
const canMove = (game: GameState) => (chess: ChessState, position: PositionValue) => {
  const { color, value } = chess
  switch (value) {
    case ChessValue.General:
      return isGeneralValid(color, position) && canGeneralMove()(chess, position)
    case ChessValue.Guard:
      return isGuardValid(color, position) && canGuardMove()(chess, position)
    case ChessValue.Elephant:
      return isElephantValid(color, position) && canElephantMove(game)(chess, position)
    case ChessValue.Horse:
      return canHorseMove(game)(chess, position)
    case ChessValue.Chariot:
      return canMoveStraightly(game)(chess, position)
    case ChessValue.Cannon:
      return canMoveStraightly(game)(chess, position)
    case ChessValue.Soldier:
      return isSoldierValid(color, position) && canSoldierMove()(chess, position)
  }
}

/**
 * 判断在当前棋局下，某个棋子能否攻击目标位置
 */
const canAttack = (game: GameState) => (chess: ChessState, dest: ChessState) => {
  if (chess.color === dest.color) {
    // 不能吃自己的棋子
    return false
  }

  if (chess.value === ChessValue.Cannon) {
    return canCannonAttack(game)(chess, dest.position)
  } else {
    return (
      game.situation.find((chess) => isSamePosition(chess.position, dest.position)) &&
      canMove(game)(chess, dest.position)
    )
  }
}

/**
 * 在当前棋局中，点击指定位置
 */
export const click =
  (position: PositionValue) =>
  (game: GameState): GameState => {
    const { currentPlayer, situation, selectedChess } = game

    const dest = situation.find((chess) => isSamePosition(chess.position, position))

    if (selectedChess) {
      if (dest) {
        if (dest.color === currentPlayer) {
          return select(position)(game)
        } else {
          return attack(position)(game)
        }
      } else {
        return move(position)(game)
      }
    } else {
      if (dest) {
        if (dest.color === currentPlayer) {
          return select(position)(game)
        }
      }
    }

    return game
  }

/**
 * 在当前棋局中选中指定位置的棋子
 */
const select =
  (position: PositionValue) =>
  (game: GameState): GameState => {
    const { currentPlayer, situation } = game

    const { x, y } = position
    let newSelectedChess: ChessState | undefined = undefined
    const newSituation = situation
      .map((chess) => unmark(unselect(chess)))
      .map((chess) => {
        if (chess.position.x === x && chess.position.y === y) {
          newSelectedChess = selectChess(chess)
          return newSelectedChess
        } else {
          return chess
        }
      })
      .map((chess) => {
        if (newSelectedChess && canAttack(game)(newSelectedChess, chess)) {
          return mark(chess)
        } else {
          return chess
        }
      })

    const markers: Marker[] = new Array(90)
      .fill(null)
      .map((v, index) => {
        const x = index % 9
        const y = (index - x) / 9
        return { x, y }
      })
      .filter((v) => newSelectedChess && canMove(game)(newSelectedChess, v))

    return {
      currentPlayer,
      selectedChess: newSelectedChess,
      situation: newSituation,
      markers,
    }
  }

/**
 * 在当前棋局中，把选中的棋子移动到指定位置
 */
const move =
  (position: PositionValue) =>
  (game: GameState): GameState => {
    const { currentPlayer, situation, selectedChess } = game

    if (selectedChess && canMove(game)(selectedChess, position)) {
      const { x, y } = selectedChess.position
      const newSituation = situation
        .map((chess) => {
          if (chess.position.x === x && chess.position.y === y) {
            return moveChess(position)(chess)
          } else {
            return chess
          }
        })
        // 走完之后，去掉棋子的选中和标记状态
        .map((chess) => unmark(unselect(chess)))

      return {
        currentPlayer: -currentPlayer as ChessColor,
        selectedChess: undefined,
        situation: newSituation,
        markers: [],
      }
    }
    return game
  }

/**
 * 在当前棋局中，用选中的棋子攻击指定位置
 */
const attack =
  (position: PositionValue) =>
  (game: GameState): GameState => {
    const { currentPlayer, situation, selectedChess } = game

    // 要攻击的棋子
    const dest = situation.find((chess) => chess.position.x === position.x && chess.position.y === position.y)

    if (selectedChess && dest && canAttack(game)(selectedChess, dest)) {
      const { x, y } = selectedChess.position
      const newSituation = situation
        .map((chess) => {
          // 吃别人的，自己移动到对方位置
          if (chess.position.x === x && chess.position.y === y) {
            return moveChess(position)(chess)
          }

          // 被吃的，拿掉
          if (chess.position.x === position.x && chess.position.y === position.y) {
            return null
          }

          // 其他保持原样
          return chess
        })
        .filter((chess): chess is ChessState => !!chess)
        // 走完之后，去掉棋子的选中和标记状态
        .map((chess) => unmark(unselect(chess)))

      return {
        currentPlayer: -currentPlayer as ChessColor,
        selectedChess: undefined,
        situation: newSituation,
        markers: [],
      }
    }
    return game
  }

const defaultSituation: Array<
  Array<{
    color: ChessColor
    value: ChessValue
  } | null>
> = [
  [
    { color: ChessColor.Black, value: ChessValue.Chariot },
    { color: ChessColor.Black, value: ChessValue.Horse },
    { color: ChessColor.Black, value: ChessValue.Elephant },
    { color: ChessColor.Black, value: ChessValue.Guard },
    { color: ChessColor.Black, value: ChessValue.General },
    { color: ChessColor.Black, value: ChessValue.Guard },
    { color: ChessColor.Black, value: ChessValue.Elephant },
    { color: ChessColor.Black, value: ChessValue.Horse },
    { color: ChessColor.Black, value: ChessValue.Chariot },
  ],
  [],
  [
    null,
    {
      color: ChessColor.Black,
      value: ChessValue.Cannon,
    },
    null,
    null,
    null,
    null,
    null,
    {
      color: ChessColor.Black,
      value: ChessValue.Cannon,
    },
  ],
  [
    {
      color: ChessColor.Black,
      value: ChessValue.Soldier,
    },
    null,
    {
      color: ChessColor.Black,
      value: ChessValue.Soldier,
    },
    null,
    {
      color: ChessColor.Black,
      value: ChessValue.Soldier,
    },
    null,
    {
      color: ChessColor.Black,
      value: ChessValue.Soldier,
    },
    null,
    {
      color: ChessColor.Black,
      value: ChessValue.Soldier,
    },
  ],
  [],
  [],
  [
    {
      color: ChessColor.Red,
      value: ChessValue.Soldier,
    },
    null,
    {
      color: ChessColor.Red,
      value: ChessValue.Soldier,
    },
    null,
    {
      color: ChessColor.Red,
      value: ChessValue.Soldier,
    },
    null,
    {
      color: ChessColor.Red,
      value: ChessValue.Soldier,
    },
    null,
    {
      color: ChessColor.Red,
      value: ChessValue.Soldier,
    },
  ],
  [
    null,
    {
      color: ChessColor.Red,
      value: ChessValue.Cannon,
    },
    null,
    null,
    null,
    null,
    null,
    {
      color: ChessColor.Red,
      value: ChessValue.Cannon,
    },
  ],
  [],
  [
    { color: ChessColor.Red, value: ChessValue.Chariot },
    { color: ChessColor.Red, value: ChessValue.Horse },
    { color: ChessColor.Red, value: ChessValue.Elephant },
    { color: ChessColor.Red, value: ChessValue.Guard },
    { color: ChessColor.Red, value: ChessValue.General },
    { color: ChessColor.Red, value: ChessValue.Guard },
    { color: ChessColor.Red, value: ChessValue.Elephant },
    { color: ChessColor.Red, value: ChessValue.Horse },
    { color: ChessColor.Red, value: ChessValue.Chariot },
  ],
]

export const createInitialGame = (): GameState => {
  const situation: ChessState[] = []

  for (let y = 0; y <= 9; y++) {
    for (let x = 0; x <= 8; x++) {
      const chess = defaultSituation[y][x]
      if (chess) {
        situation.push({
          ...chess,
          position: {
            x,
            y,
          },
        })
      }
    }
  }

  return {
    currentPlayer: ChessColor.Red,
    situation,
    markers: [],
  }
}