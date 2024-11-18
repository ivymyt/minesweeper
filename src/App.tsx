import { useState } from 'react'
import { sumBy } from 'lodash-es';
import {
  createEmptyMineData, createMineData,
  CellState, GameState, MineFieldConfig, Position
} from './utils.tsx'
import EmptyMineField from './components/EmptyMineField.tsx'
import MineField from './components/MineField.tsx'
import './App.css'

function App() {
  const defaultConfig: MineFieldConfig = {
    rows: 9,
    columns: 9,
    mines: 10,
  }

  const [ rows, setRows ] = useState(() => createEmptyMineData())
  const [ config, setConfig ] = useState(defaultConfig)
  const [ gameState, setGameState] = useState(GameState.New)

  function recurseReveal(position: Position, nextRows: Array<Array<CellState>>) {
    const cellState = nextRows[position.row][position.column]
    cellState.revealed = true

    if (cellState.minedNeighbours === 0) {
      for (let i = Math.max(0, position.row-1); i < Math.min(position.row+2, config.rows); i++) {
        for (let j = Math.max(0, position.column-1); j < Math.min(position.column+2, config.columns); j++) {
          if (!nextRows[i][j].revealed) {
            recurseReveal({row: i, column: j}, nextRows)
          }
        }
      }
    }
  }

  function hasWon(nextRows: Array<Array<CellState>>): boolean {
    const numRevealed = sumBy(nextRows, (row) => sumBy(row, (cellState) => cellState.revealed ? 1 : 0))
    return numRevealed === config.rows * config.columns - config.mines
  }

  function handleStart(startPosition: Position) {
    const nextRows = createMineData(config, startPosition)
    recurseReveal(startPosition, nextRows)
    setGameState(GameState.InProgress)
    setRows(nextRows)
  }

  function handleFlag(position: Position) {
    if (gameState !== GameState.InProgress) {
      return;
    }

    const nextRows = [...rows]
    let cellState = rows[position.row][position.column]
    if (cellState.revealed) {
      return;
    }

    cellState.flagged = !cellState.flagged
    setRows(nextRows)
  }

  function handleReveal(position: Position) {
    if (gameState !== GameState.InProgress) {
      return;
    }

    const nextRows = [...rows]
    let cellState = rows[position.row][position.column]
    if (cellState.revealed || cellState.flagged) {
      return;
    }

    if (cellState.mined) {
      cellState.revealed = true
      setRows(nextRows)
      setGameState(GameState.Loss)
    } else {
      recurseReveal(position, nextRows)
      setRows(nextRows)
      if (hasWon(nextRows)) {
        setGameState(GameState.Win)
      }
    }
  }

  function handleRevealNeighbours(position: Position) {
    if (gameState !== GameState.InProgress) {
      return;
    }

    const nextRows = [...rows]
    let cellState = rows[position.row][position.column]
    if (!cellState.revealed) {
      return;
    }

    let numFlagged = 0
    for (let i = Math.max(0, position.row-1); i < Math.min(position.row+2, config.rows); i++) {
      for (let j = Math.max(0, position.column-1); j < Math.min(position.column+2, config.columns); j++) {
        if (nextRows[i][j].flagged) {
          numFlagged++
        }
      }
    }

    if (numFlagged !== cellState.minedNeighbours) {
      return;
    }

    for (let i = Math.max(0, position.row-1); i < Math.min(position.row+2, config.rows); i++) {
      for (let j = Math.max(0, position.column-1); j < Math.min(position.column+2, config.columns); j++) {
        if (!nextRows[i][j].flagged) {
          nextRows[i][j].revealed = true
        }
      }
    }

    setRows(nextRows)
  }

  return (
    <>
    <h1>
      {gameState === GameState.New && "Click to Start"}
      {gameState === GameState.InProgress && "Keep Going…"}
      {gameState === GameState.Loss && "You Lose!"}
      {gameState === GameState.Win && "You Win!"}
    </h1>
    {
      gameState === GameState.New ? (
        <EmptyMineField numRows={config.rows} numColumns={config.columns} onStart={handleStart} />
      ) : (
        <MineField rows={rows} onFlag={handleFlag} onReveal={handleReveal} onRevealNeighbours={handleRevealNeighbours}/>
      )
    }
    </>
  )
}

export default App