const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  const style = {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    fontSize: 16,
    color: type === 'error' ? 'red' : 'green',
    background: type === 'error' ? '#ffe6e6' : '#e6ffe6',
    border: `2px solid ${type === 'error' ? 'red' : 'green'}`
  }

  return <div style={style}>{message}</div>
}

export default Notification
