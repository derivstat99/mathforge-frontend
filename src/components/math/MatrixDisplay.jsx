export default function MatrixDisplay({ label, matrix }) {
  if (!matrix || matrix.length === 0) return null

  return (
    <div>
      {label && (
        <p className="text-xs uppercase tracking-wider mb-3" style={{ color: '#8884aa' }}>{label}</p>
      )}
      <div style={{ overflowX: 'auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '28px', color: '#6c63ff', lineHeight: 1 }}>[</span>
          <table style={{ borderCollapse: 'separate', borderSpacing: '4px' }}>
            <tbody>
              {matrix.map((row, i) => (
                <tr key={i}>
                  {row.map((val, j) => (
                    <td key={j}>
                      <div
                        style={{
                          width: '64px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(108,99,255,0.08)',
                          border: '1px solid rgba(108,99,255,0.2)',
                          borderRadius: '6px',
                          color: '#e2e0ff',
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '13px',
                        }}
                      >
                        {typeof val === 'number' ? (Number.isInteger(val) ? val : val.toFixed(4)) : val}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <span style={{ fontSize: '28px', color: '#6c63ff', lineHeight: 1 }}>]</span>
        </div>
      </div>
    </div>
  )
}
