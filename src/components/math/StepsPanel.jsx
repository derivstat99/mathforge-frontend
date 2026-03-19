import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function StepsPanel({ steps, summary }) {
  const [open, setOpen] = useState(false)

  if (!steps && !summary) return null

  return (
    <div style={{ border: '1px solid #1e1e2e', borderRadius: '10px', overflow: 'hidden' }}>
      {summary && (
        <div style={{ padding: '14px 16px', background: 'rgba(108,99,255,0.08)', borderBottom: open ? '1px solid #1e1e2e' : 'none' }}>
          <p style={{ color: '#e2e0ff', fontSize: '14px', margin: 0 }}>{summary}</p>
        </div>
      )}
      {steps && (
        <>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center justify-between w-full"
            style={{ padding: '10px 16px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#8884aa' }}
          >
            <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {open ? 'Hide steps' : 'Show steps'}
            </span>
            {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {open && (
            <div style={{ padding: '0 16px 16px' }}>
              <pre style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '12px',
                color: '#8884aa',
                whiteSpace: 'pre-wrap',
                margin: 0,
                lineHeight: '1.8',
              }}>
                {steps}
              </pre>
            </div>
          )}
        </>
      )}
    </div>
  )
}
