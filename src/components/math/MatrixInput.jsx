import { useEffect } from 'react'

export default function MatrixInput({ label, rows, cols, values, onChange }) {
  useEffect(() => {
    const newValues = Array.from({ length: rows }, (_, i) =>
      Array.from({ length: cols }, (_, j) =>
        values?.[i]?.[j] !== undefined ? values[i][j] : 0
      )
    )
    onChange(newValues)
  }, [rows, cols])

  const handleCell = (i, j, val) => {
    const updated = values.map((row) => [...row])
    updated[i][j] = val === '' ? '' : parseFloat(val) || 0
    onChange(updated)
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-wider mb-3" style={{ color: '#8884aa' }}>{label}</p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'separate', borderSpacing: '4px' }}>
          <tbody>
            {Array.from({ length: rows }, (_, i) => (
              <tr key={i}>
                {Array.from({ length: cols }, (_, j) => (
                  <td key={j}>
                    <input
                      type="number"
                      value={values?.[i]?.[j] ?? 0}
                      onChange={(e) => handleCell(i, j, e.target.value)}
                      style={{
                        width: '56px',
                        height: '40px',
                        textAlign: 'center',
                        background: '#0a0a0f',
                        border: '1px solid #1e1e2e',
                        borderRadius: '6px',
                        color: '#e2e0ff',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '13px',
                        outline: 'none',
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#6c63ff'}
                      onBlur={(e) => e.target.style.borderColor = '#1e1e2e'}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
