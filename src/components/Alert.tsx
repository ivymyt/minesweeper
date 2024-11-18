function Alert({children}: {children: React.ReactNode}) {
  return (
    <div className="alert">
      <div className="alert-inner">
        <div className="alert-header">Alert!</div>
        <div className="alert-content">{children}</div>
      </div>
    </div>
  )
}

export default Alert
