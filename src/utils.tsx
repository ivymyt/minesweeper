import { range } from 'lodash-es';

enum GameState {
  New,
  InProgress,
  Loss,
  Win,
}

interface CellState {
  mined: boolean,
  revealed: boolean,
  flagged: boolean,
  minedNeighbours: number,
}

interface MineFieldConfig {
  rows: number,
  columns: number,
  mines: number,
}

interface Position {
  row: number,
  column: number,
}

function shuffleInPlace(array: Array<any>) {
  // Fisher-Yates shuffle
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function convertToFlatPosition(config: MineFieldConfig, row: number, column: number) {
  return row * config.columns + column
}

function createEmptyMineData(): Array<Array<CellState>> {
  const cellState: CellState = {
    mined: false,
    revealed: false,
    flagged: false,
    minedNeighbours: 0,
  }
  return [[cellState]];
}

function createMineData(config: MineFieldConfig, startPosition: Position): Array<Array<CellState>> {
  // generate the minefield "flat"
  let flatPositions = range(config.rows * config.columns)
  shuffleInPlace(flatPositions)
  let flatMinePositions = flatPositions.slice(0, config.mines)

  // ensure safe position is not a mine
  const flatSafePosition = convertToFlatPosition(config, startPosition.row, startPosition.column)
  const safePositionIndex = flatMinePositions.indexOf(flatSafePosition)
  if (safePositionIndex > -1) {
    // swap safe position with next position in list of all squares
    flatMinePositions[safePositionIndex] = flatPositions[config.mines]
  }

  // convert to cell states
  return range(config.rows).map((row) =>
    range(config.columns).map((column) => {
      let minedNeighbours = 0
      for (let i = Math.max(0, row-1); i < Math.min(row+2, config.rows); i++) {
        for (let j = Math.max(0, column-1); j < Math.min(column+2, config.columns); j++) {
          const flatNeighbour = convertToFlatPosition(config, i, j)
          if (flatMinePositions.indexOf(flatNeighbour) > -1) {
            minedNeighbours++
          }
        }
      }

      const flatPosition = convertToFlatPosition(config, row, column)
      return {
        position: {row, column},
        mined: flatMinePositions.indexOf(flatPosition) > -1,
        revealed: false,
        flagged: false,
        minedNeighbours,
      }
    })
  )
}

export { createEmptyMineData, createMineData, convertToFlatPosition, GameState }
export type { CellState, MineFieldConfig, Position }
