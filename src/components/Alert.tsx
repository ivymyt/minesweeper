function Alert({
    children,
    onClose,
  }: {
    children: React.ReactNode,
    onClose: Function,
  }) {

  function handleClick(event: React.MouseEvent) {
    event.stopPropagation()
    onClose()
  }

  return (
    <div className="alert">
      <div className="alert-inner">
        <div className="alert-header">
          Alert!
          <button className="alert-header-close" onClick={handleClick}>&times;</button>
        </div>
        <div className="alert-content">{children}</div>
      </div>
    </div>
  )
}

export default Alert
