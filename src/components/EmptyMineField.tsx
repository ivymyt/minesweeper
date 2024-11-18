import { range } from 'lodash-es';
import { Position } from '../utils.tsx'

function EmptyMineCell({
    row,
    column,
    onStart,
  }: {
    row: number,
    column: number,
    onStart: Function,
  }) {

  function handleClick(event: React.MouseEvent) {
    event.stopPropagation()
    const position: Position = {
      row,
      column,
    }
    onStart(position)
  }

  return (
    <div className="mine-cell" onClick={handleClick} />
  )
}

function EmptyMineRow({
    row,
    numColumns,
    onStart,
  }: {
    row: number,
    numColumns: number,
    onStart: Function,
  }) {

  return (
    <div className="mine-row">
      {
        range(numColumns).map((column: number) =>
          <EmptyMineCell key={column} row={row} column={column} onStart={onStart} />
        )
      }
    </div>
  )
}

function EmptyMineField({
    numRows,
    numColumns,
    onStart,
  }: {
    numRows: number,
    numColumns: number,
    onStart: Function,
  }) {
  return (
    <div className="mine-field new-game">
      {
        range(numRows).map((row: number) =>
          <EmptyMineRow key={row} row={row} numColumns={numColumns} onStart={onStart} />
        )
      }
    </div>
  )
}

export default EmptyMineField
