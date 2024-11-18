import classnames from 'classnames';
import { CellState } from '../utils.tsx'

function MineCell({
    row,
    column,
    state,
    onReveal,
    onRevealNeighbours,
    onFlag,
  }: {
    row: number,
    column: number,
    state: CellState,
    onReveal: Function,
    onRevealNeighbours: Function,
    onFlag: Function,
  }) {

  const className = classnames({
    'mine-cell': true,
    'revealed': state.revealed,
    'flagged': state.flagged,
    'mined': state.mined,
  })

  function handleClick(event: React.MouseEvent) {
    event.stopPropagation()
    onReveal({row, column})
  }

  function handleDoubleClick(event: React.MouseEvent) {
    event.stopPropagation()
    onRevealNeighbours({row, column})
  }

  function handleContextMenu(event: React.MouseEvent) {
    event.stopPropagation()
    event.preventDefault()
    onFlag({row, column})
  }

  return (
    <div className={className} onClick={handleClick} onContextMenu={handleContextMenu} onDoubleClick={handleDoubleClick}>
      { state.flagged && "🚩" }
      { state.revealed && state.mined && "💣" }
      { state.revealed && !state.mined && state.minedNeighbours > 0 && (
        <div>{state.minedNeighbours}</div>
      )}
    </div>
  )
}

function MineRow({
    row,
    cells,
    onReveal,
    onRevealNeighbours,
    onFlag,
  }: {
    row: number,
    cells: Array<CellState>,
    onReveal: Function,
    onRevealNeighbours: Function,
    onFlag: Function,
  }) {
  return (
    <div className="mine-row">
      {
        cells.map((state: CellState, column: number) =>
          <MineCell key={column} row={row} column={column} state={state}
            onReveal={onReveal} onRevealNeighbours={onRevealNeighbours} onFlag={onFlag} />
        )
      }
    </div>
  )
}

function MineField({
    rows,
    onReveal,
    onRevealNeighbours,
    onFlag,
  }: {
    rows: Array<Array<CellState>>,
    onReveal: Function,
    onRevealNeighbours: Function,
    onFlag: Function,
  }) {
  return (
    <div className="mine-field">
      {
        rows.map((cells: Array<CellState>, row: number) =>
          <MineRow key={row} row={row} cells={cells}
            onReveal={onReveal} onRevealNeighbours={onRevealNeighbours} onFlag={onFlag} />
        )
      }
    </div>
  )
}

export default MineField