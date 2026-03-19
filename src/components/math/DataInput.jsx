import { useState } from 'react'

const PRESETS = {
  small:      [12, 15, 18, 14, 20, 11, 16, 19, 13, 17],
  grades:     [78, 85, 92, 88, 71, 95, 82, 79, 90, 84, 87, 76],
  regression: { x: [1,2,3,4,5,6,7,8,9,10], y: [2.1, 3.9, 6.2, 7.8, 10.1, 12.3, 14.0, 15.8, 18.2, 20.1] },
}

export default function DataInput({ labelX = 'Data (X)', labelY, valueX, valueY, onChangeX, onChangeY }) {
  const [rawX, setRawX] = useState(valueX ? valueX.join(', ') : '')
  const [rawY, setRawY] = useState(valueY ? valueY.join(', ') : '')

  const parse = (str) => {
    return str.split(/[,\s]+/).map(Number).filter((n) => !isNaN(n))
  }

  const handleX = (val) => {
    setRawX(val)
    onChangeX(parse(val))
  }

  const handleY = (val) => {
    setRawY(val)
    if (onChangeY) onChangeY(parse(val))
  }

  const loadPreset = (key) => {
    if (key === 'regression') {
      const p = PRESETS.regression
      setRawX(p.x.join(', '))
      setRawY(p.y.join(', '))
      onChangeX(p.x)
      if (onChangeY) onChangeY(p.y)
    } else {
      setRawX(PRESETS[key].join(', '))
      onChangeX(PRESETS[key])
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="forge-label" style={{ marginBottom: 0 }}>{labelX}</label>
          <div className="flex gap-2">
            <span style={{ fontSize: '11px', color: '#8884aa' }}>Presets:</span>
            {['small', 'grades', ...(onChangeY ? ['regression'] : [])].map((k) => (
              <button
                key={k}
                onClick={() => loadPreset(k)}
                style={{
                  fontSize: '11px', padding: '2px 8px',
                  background: 'rgba(108,99,255,0.08)',
                  border: '1px solid rgba(108,99,255,0.2)',
                  borderRadius: '4px', color: '#a78bfa',
                  cursor: 'pointer',
                }}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
        <textarea
          className="forge-input"
          style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', resize: 'vertical', minHeight: '60px' }}
          placeholder="Enter numbers separated by commas: 12, 15, 18, 14, 20"
          value={rawX}
          onChange={(e) => handleX(e.target.value)}
        />
        <p style={{ fontSize: '11px', color: '#8884aa', marginTop: '4px' }}>
          {parse(rawX).length} values entered
        </p>
      </div>

      {onChangeY && (
        <div>
          <label className="forge-label">{labelY || 'Data (Y)'}</label>
          <textarea
            className="forge-input"
            style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', resize: 'vertical', minHeight: '60px' }}
            placeholder="Y values (must match X count)"
            value={rawY}
            onChange={(e) => handleY(e.target.value)}
          />
          <p style={{ fontSize: '11px', color: '#8884aa', marginTop: '4px' }}>
            {parse(rawY).length} values entered
          </p>
        </div>
      )}
    </div>
  )
}
