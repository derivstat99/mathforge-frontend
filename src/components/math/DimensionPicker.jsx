export default function DimensionPicker({ label, rows, cols, onRowsChange, onColsChange, maxSize = 6 }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider mb-2" style={{ color: '#8884aa' }}>{label} dimensions</p>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: '#8884aa' }}>Rows</span>
          <select
            value={rows}
            onChange={(e) => onRowsChange(parseInt(e.target.value))}
            style={{
              background: '#12121a',
              border: '1px solid #1e1e2e',
              borderRadius: '6px',
              color: '#e2e0ff',
              padding: '4px 8px',
              fontSize: '13px',
              fontFamily: 'JetBrains Mono, monospace',
              cursor: 'pointer',
            }}
          >
            {Array.from({ length: maxSize }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <span style={{ color: '#3a3a52' }}>×</span>
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: '#8884aa' }}>Cols</span>
          <select
            value={cols}
            onChange={(e) => onColsChange(parseInt(e.target.value))}
            style={{
              background: '#12121a',
              border: '1px solid #1e1e2e',
              borderRadius: '6px',
              color: '#e2e0ff',
              padding: '4px 8px',
              fontSize: '13px',
              fontFamily: 'JetBrains Mono, monospace',
              cursor: 'pointer',
            }}
          >
            {Array.from({ length: maxSize }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
