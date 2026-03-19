import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function ResultDisplay({ result, label = 'Result' }) {
  const [copied, setCopied] = useState(false)

  if (!result) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ border: '1px solid rgba(108,99,255,0.25)', borderRadius: '10px', overflow: 'hidden' }}>
      <div className="flex items-center justify-between" style={{ padding: '10px 16px', background: 'rgba(108,99,255,0.08)', borderBottom: '1px solid rgba(108,99,255,0.15)' }}>
        <span style={{ fontSize: '11px', color: '#8884aa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1"
          style={{ fontSize: '11px', color: copied ? '#34d399' : '#8884aa', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div style={{ padding: '16px' }}>
        <p style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '16px',
          color: '#e2e0ff',
          margin: 0,
          wordBreak: 'break-all',
          lineHeight: '1.6',
        }}>
          {result}
        </p>
      </div>
    </div>
  )
}
