export type PositionValue = {
  x: number
  y: number
}

export const isSamePosition = (pos1: PositionValue, pos2: PositionValue) => {
  return pos1.x === pos2.x && pos1.y === pos2.y
}