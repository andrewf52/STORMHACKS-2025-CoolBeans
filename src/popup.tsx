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
      <h1>MindFeed</h1>
      <div className="gauge-wrap">
        <svg className="gauge" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid meet" overflow="visible" role="img" aria-label="truth lie gauge">
          <defs>
            <linearGradient id="g1" x1="0%" x2="100%">
              {/* left: red */}
              <stop offset="0%" stopColor="#ef5350" />
              <stop offset="33.333%" stopColor="#ef5350" />
              {/* middle: grey */}
              <stop offset="33.333%" stopColor="#9e9e9e" />
              <stop offset="66.666%" stopColor="#9e9e9e" />
              {/* right: green */}
              <stop offset="66.666%" stopColor="#6fe51a" />
              <stop offset="100%" stopColor="#6fe51a" />
            </linearGradient>
          </defs>
          {/** programmatically generate arc path so it's centered precisely */}
          {
            (() => {
              const cx = 96
              const cy = 100
              const r = 90
              const startAngle = Math.PI // 180deg
              const endAngle = 0 // 0deg
              const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInRadians: number) => {
                return {
                  x: centerX + radius * Math.cos(angleInRadians),
                  y: centerY + radius * Math.sin(angleInRadians)
                }
              }
              const start = polarToCartesian(cx, cy, r, startAngle)
              const end = polarToCartesian(cx, cy, r, endAngle)
              const largeArcFlag = endAngle - startAngle <= Math.PI ? '0' : '1'
              const d = `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`
              return (
                <g>
                  <path d={d} fill="none" stroke="url(#g1)" strokeWidth="16" strokeLinecap="round" />
                  {/* pointer pivot uses same center - use CSS transform so transition animates */}
                  {
                    (() => {
                      const deg = (value - 50) * 0.9
                      // translate the group so pivot is at (0,0), then rotate the inner group via CSS
                      const innerStyle: React.CSSProperties = {
                        transform: `rotate(${deg}deg)`,
                        transformOrigin: '0 0'
                      }
                      return (
                        <g transform={`translate(${cx},${cy})`}>
                          <g className="gauge-pointer" style={innerStyle as any}>
                            <rect x="-3" y="-72" width="6" height="72" rx="2" fill="#072" />
                            <circle cx="0" cy="0" r="7" fill="#042" />
                          </g>
                        </g>
                      )
                    })()
                  }
                </g>
              )
            })()
          }
        </svg>
        {/* sentiment text will appear here based on value */}
        <div className="gauge-sentiment" aria-live="polite">
          {value <= 33.333 ? (
            <span className="sentiment negative">negative</span>
          ) : value <= 66.666 ? (
            <span className="sentiment neutral">neutral</span>
          ) : (
            <span className="sentiment positive">positive</span>
          )}
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
