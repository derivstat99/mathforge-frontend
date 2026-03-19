import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const EXAMPLES = {
  DIFFERENTIATE:        ['x^3 + 2*x^2 - 5*x + 1', 'Sin[x]*Cos[x]', 'E^(2*x)', 'Log[x^2 + 1]'],
  DIFFERENTIATE_NTH:    ['x^5 - 3*x^3 + x', 'Sin[x]', 'E^x * x^2'],
  INTEGRATE_INDEFINITE: ['x^3 + 2*x - 1', 'Sin[x]^2', '1/(x^2 + 1)', 'E^x * Sin[x]'],
  INTEGRATE_DEFINITE:   ['x^2', 'Sin[x]', 'E^(-x^2)', 'Sqrt[1 - x^2]'],
  SERIES:               ['Sin[x]', 'E^x', 'Cos[x]', '1/(1-x)'],
  SIMPLIFY:             ['(x^2 - 1)/(x - 1)', 'Sin[x]^2 + Cos[x]^2', '(x+1)^2 - x^2'],
  EXPAND:               ['(x + 1)^4', '(x - 2)*(x + 3)*(x - 1)', '(2*x + y)^3'],
  FACTOR:               ['x^2 - 5*x + 6', 'x^3 - x', 'x^4 - 16'],
}

const SYNTAX = [
  { input: 'x^2',       meaning: 'x squared' },
  { input: 'Sin[x]',    meaning: 'sin(x) — use capital S, brackets' },
  { input: 'Cos[x]',    meaning: 'cos(x)' },
  { input: 'E^x',       meaning: 'eˣ' },
  { input: 'Log[x]',    meaning: 'ln(x) natural log' },
  { input: 'Sqrt[x]',   meaning: '√x' },
  { input: '2*x',       meaning: 'multiplication — always use *' },
  { input: 'Pi',        meaning: 'π' },
]

export default function FunctionInput({ value, onChange, operation }) {
  const [showGuide, setShowGuide] = useState(false)
  const examples = EXAMPLES[operation] || EXAMPLES.DIFFERENTIATE

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="forge-label" style={{ marginBottom: 0 }}>Expression</label>
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="flex items-center gap-1"
          style={{ fontSize: '11px', color: '#6c63ff', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Syntax guide {showGuide ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      <input
        type="text"
        className="forge-input"
        style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '15px' }}
        placeholder="e.g. x^3 + 2*x - Sin[x]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      {showGuide && (
        <div style={{ marginTop: '10px', padding: '12px', background: '#0a0a0f', border: '1px solid #1e1e2e', borderRadius: '8px' }}>
          <p className="text-xs uppercase tracking-wider mb-2" style={{ color: '#8884aa' }}>Syntax reference</p>
          <div className="grid grid-cols-2 gap-1">
            {SYNTAX.map(({ input, meaning }) => (
              <div key={input} className="flex items-center gap-2">
                <code style={{ fontSize: '12px', color: '#a78bfa', fontFamily: 'JetBrains Mono, monospace' }}>{input}</code>
                <span style={{ fontSize: '11px', color: '#8884aa' }}>→ {meaning}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-3">
        <span style={{ fontSize: '11px', color: '#8884aa' }}>Try:</span>
        {examples.map((ex) => (
          <button
            key={ex}
            onClick={() => onChange(ex)}
            style={{
              fontSize: '11px',
              padding: '3px 8px',
              background: 'rgba(108,99,255,0.08)',
              border: '1px solid rgba(108,99,255,0.2)',
              borderRadius: '4px',
              color: '#a78bfa',
              fontFamily: 'JetBrains Mono, monospace',
              cursor: 'pointer',
            }}
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  )
}
