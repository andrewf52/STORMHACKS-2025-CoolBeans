import React from 'react'
import { createRoot } from 'react-dom/client'

function App() {
  const handleClick = () => {
    try {
      chrome.runtime.sendMessage({ hello: 'from popup' })
    } catch (e) {
      console.log('not in extension environment', e)
    }
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 12 }}>
      <h1>CoolBeans</h1>
      <button onClick={handleClick}>Send message</button>
    </div>
  )
}

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
