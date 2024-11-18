import { useEffect, useState } from 'react'
import { sumBy } from 'lodash-es';
import {
  createEmptyMineData, createMineData, loopNeighbours,
  CellState, GameState, MineFieldConfig, Position
} from './utils.tsx'
import Alert from './components/Alert.tsx'
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
  const [ numFlagged, setNumFlagged ] = useState(0)
  const [ config, setConfig ] = useState(defaultConfig)
  const [ gameState, setGameState ] = useState(GameState.New)
  const [ timeElapsed, setTimeElapsed ] = useState(0)
  const [ showAlert, setShowAlert ] = useState(false)

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (gameState === GameState.InProgress) {
        setTimeElapsed((prevTimeElapsed) => prevTimeElapsed + 1);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [gameState]);

  function recurseReveal(position: Position, nextRows: Array<Array<CellState>>) {
    const cellState = nextRows[position.row][position.column]
    cellState.revealed = true

    if (cellState.minedNeighbours === 0) {
      loopNeighbours(position, nextRows, config, (neighbour: CellState, nextPosition: Position) => {
        if (!neighbour.revealed) {
          recurseReveal(nextPosition, nextRows)
        }
      })
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
    setTimeElapsed(0)
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
    setNumFlagged((prevNumFlagged) => prevNumFlagged + (cellState.flagged ? 1 : -1))
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
      setShowAlert(true)
    } else {
      recurseReveal(position, nextRows)
      setRows(nextRows)
      if (hasWon(nextRows)) {
        setGameState(GameState.Win)
        setShowAlert(true)
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
    loopNeighbours(position, nextRows, config, (neighbour: CellState) => {
      if (neighbour.flagged) {
        numFlagged++
      }
    })

    if (numFlagged !== cellState.minedNeighbours) {
      return;
    }

    loopNeighbours(position, nextRows, config, (neighbour: CellState, nextPosition: Position) => {
      if (!neighbour.flagged) {
        recurseReveal(nextPosition, nextRows)
      }
    })

    setRows(nextRows)
    if (hasWon(nextRows)) {
      setGameState(GameState.Win)
      setShowAlert(true)
    }
  }

  function handleRestart(event: React.MouseEvent) {
    event.stopPropagation()
    setGameState(GameState.New)
  }

  function handleHideAlert() {
    setShowAlert(false)
  }

  const style = {
    width: (34 * config.columns) + 'px',
  }

  return (
    <>
      <main style={style}>
        <header>
          <div className="title-bar">
            <h1>Minesweeper</h1>
            <button onClick={handleRestart}>♻️</button>
          </div>
          <div className="status">
            <div className="mines-remaining">{config.mines - numFlagged}</div>
            <div className="game-state">
              { gameState === GameState.New && "🙂" }
              { gameState === GameState.InProgress && "🙂" }
              { gameState === GameState.Loss && "😵" }
              { gameState === GameState.Win && "😎" }
            </div>
            <div className="time-elapsed">{timeElapsed}</div>
          </div>
        </header>
        { showAlert && (
          <Alert onClose={handleHideAlert}>
            { gameState === GameState.Loss && <div>You Lose!</div> }
            { gameState === GameState.Win && <div>You Win!</div> }
            <button onClick={handleRestart}>Play Again</button>
          </Alert>
        )}
        {
          gameState === GameState.New ? (
            <EmptyMineField numRows={config.rows} numColumns={config.columns} onStart={handleStart} />
          ) : (
            <MineField rows={rows} onFlag={handleFlag} onReveal={handleReveal}
              onRevealNeighbours={handleRevealNeighbours}/>
          )
        }
      </main>
    </>
  )
}

export default App
