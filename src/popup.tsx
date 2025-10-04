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

  const [value, setValue] = React.useState(70) // 0..100, 0==truth, 100==lie

  const setRandom = () => setValue(Math.floor(Math.random() * 101))

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 12 }}>
      <h1>CoolBeans</h1>
      <div className="gauge-wrap">
        <svg className="gauge" viewBox="0 0 200 120" role="img" aria-label="truth lie gauge">
          <defs>
            <linearGradient id="g1" x1="0%" x2="100%">
              <stop offset="0%" stopColor="#6fe51a" />
              <stop offset="60%" stopColor="#6fe51a" />
              <stop offset="60%" stopColor="#f9a825" />
              <stop offset="85%" stopColor="#f9a825" />
              <stop offset="85%" stopColor="#ef5350" />
              <stop offset="100%" stopColor="#ef5350" />
            </linearGradient>
          </defs>
          <path d="M10 100 A90 90 0 0 1 190 100" fill="none" stroke="url(#g1)" strokeWidth="16" strokeLinecap="round" />
          {/* pointer */}
          <g transform={`translate(100,100) rotate(${(value-50) * 0.9})`}>
            <rect x="-3" y="-72" width="6" height="72" rx="2" fill="#072" />
            <circle cx="0" cy="0" r="7" fill="#042" />
          </g>
        </svg>
        <div className="gauge-labels">
          <span className="truth">TRUTH</span>
          <span className="lie">LIE</span>
        </div>
      </div>

      <div style={{ marginTop: 8 }}>
        <button onClick={handleClick}>Send message</button>
        <button style={{ marginLeft: 8 }} onClick={setRandom}>Random</button>
      </div>
    </div>
  )
}

const rootEl = document.getElementById('root')!
rootEl.style.height = '100%'
const root = createRoot(rootEl)
root.render(<App />)
