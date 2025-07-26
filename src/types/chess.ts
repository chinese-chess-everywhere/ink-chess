import { PositionValue } from './position.js'

enum ChessValue {
  General = 100,
  Chariot = 50,
  Cannon = 30,
  Horse = 29,
  Elephant = 16,
  Guard = 10,
  Soldier = 1,
}

enum ChessColor {
  Red = 1,
  Black = -1,
}

export type ChessState = {
  color: ChessColor
  value: ChessValue
  selected?: boolean
  marked?: boolean
  position: PositionValue
}

// 标记某个棋子为选中
export const select = (chess: ChessState): ChessState => {
  return {
    ...chess,
    selected: true,
  }
}

// 取消某个棋子的选中状态
export const unselect = (chess: ChessState): ChessState => {
  return {
    ...chess,
    selected: false,
  }
}

// 标记为可被攻击
export const mark = (chess: ChessState): ChessState => {
  return {
    ...chess,
    marked: true,
  }
}

// 取消可攻击状态
export const unmark = (chess: ChessState): ChessState => {
  return {
    ...chess,
    marked: false,
  }
}

// 移动棋子到指定位置
export const move = (position: PositionValue) => {
  return (chess: ChessState): ChessState => {
    return {
      ...chess,
      position,
    }
  }
}

export { ChessColor, ChessValue }