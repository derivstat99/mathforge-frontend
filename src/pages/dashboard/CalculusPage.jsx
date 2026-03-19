import { useState } from 'react'
import { FunctionSquare, Play, RotateCcw } from 'lucide-react'
import { mathApi } from '../../api/math.js'
import FunctionInput from '../../components/math/FunctionInput.jsx'
import ResultDisplay from '../../components/math/ResultDisplay.jsx'
import StepsPanel from '../../components/math/StepsPanel.jsx'
import toast from 'react-hot-toast'

const OPERATIONS = [
  { value: 'DIFFERENTIATE',        label: 'd/dx',              group: 'Differentiation' },
  { value: 'DIFFERENTIATE_NTH',    label: 'dⁿ/dxⁿ',           group: 'Differentiation' },
  { value: 'INTEGRATE_INDEFINITE', label: '∫ indefinite',      group: 'Integration'     },
  { value: 'INTEGRATE_DEFINITE',   label: '∫ definite',        group: 'Integration'     },
  { value: 'SERIES',               label: 'Taylor series',     group: 'Series'          },
  { value: 'SIMPLIFY',             label: 'Simplify',          group: 'Algebra'         },
  { value: 'EXPAND',               label: 'Expand',            group: 'Algebra'         },
  { value: 'FACTOR',               label: 'Factor',            group: 'Algebra'         },
]

const GROUPS = ['Differentiation', 'Integration', 'Series', 'Algebra']

const GROUP_COLORS = {
  Differentiation: '#60a5fa',
  Integration:     '#a78bfa',
  Series:          '#34d399',
  Algebra:         '#fbbf24',
}

export default function CalculusPage() {
  const [operation, setOperation]   = useState('DIFFERENTIATE')
  const [expression, setExpression] = useState('x^3 + 2*x^2 - 5*x + 1')
  const [variable, setVariable]     = useState('x')
  const [lowerBound, setLowerBound] = useState('0')
  const [upperBound, setUpperBound] = useState('1')
  const [nthOrder, setNthOrder]     = useState(2)
  const [seriesTerms, setSeriesTerms] = useState(5)
  const [seriesPoint, setSeriesPoint] = useState('0')
  const [result, setResult]         = useState(null)
  const [loading, setLoading]       = useState(false)

  const needsBounds  = operation === 'INTEGRATE_DEFINITE'
  const needsNth     = operation === 'DIFFERENTIATE_NTH'
  const needsSeries  = operation === 'SERIES'

  const handleCompute = async () => {
    if (!expression.trim()) { toast.error('Enter an expression first'); return }
    setLoading(true)
    setResult(null)
    try {
      const payload = {
        operation,
        expression,
        variable,
        lowerBound:  needsBounds ? lowerBound  : undefined,
        upperBound:  needsBounds ? upperBound  : undefined,
        seriesTerms: needsNth    ? nthOrder    : needsSeries ? seriesTerms : undefined,
        point:       needsSeries ? seriesPoint : undefined,
      }
      const { data } = await mathApi.calculus(payload)
      setResult(data.data)
      toast.success('Computed successfully')
    } catch (err) {
      const msg = err.response?.data?.message || 'Computation failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setExpression('')
    setResult(null)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <FunctionSquare style={{ color: '#60a5fa' }} size={22} />
        <h1 className="text-3xl" style={{ fontFamily: 'DM Serif Display, serif', color: '#e2e0ff' }}>Calculus I</h1>
      </div>

      <div className="forge-card mb-6">
        {GROUPS.map((group) => (
          <div key={group} className="mb-4 last:mb-0">
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: GROUP_COLORS[group] }}>{group}</p>
            <div className="flex flex-wrap gap-2">
              {OPERATIONS.filter((o) => o.group === group).map((op) => (
                <button
                  key={op.value}
                  onClick={() => { setOperation(op.value); setResult(null) }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontFamily: 'JetBrains Mono, monospace',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    background: operation === op.value ? 'rgba(96,165,250,0.15)' : 'transparent',
                    border: operation === op.value ? '1px solid rgba(96,165,250,0.4)' : '1px solid #1e1e2e',
                    color: operation === op.value ? '#60a5fa' : '#8884aa',
                  }}
                >
                  {op.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="forge-card mb-4">
        <FunctionInput
          value={expression}
          onChange={setExpression}
          operation={operation}
        />

        <div className="grid grid-cols-2 gap-4 mt-5">
          <div>
            <label className="forge-label">Variable</label>
            <input
              type="text"
              className="forge-input"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
              value={variable}
              onChange={(e) => setVariable(e.target.value || 'x')}
              placeholder="x"
              maxLength={2}
            />
          </div>

          {needsNth && (
            <div>
              <label className="forge-label">Order (n)</label>
              <input
                type="number"
                min={1}
                max={10}
                className="forge-input"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
                value={nthOrder}
                onChange={(e) => setNthOrder(parseInt(e.target.value) || 2)}
              />
            </div>
          )}

          {needsSeries && (
            <>
              <div>
                <label className="forge-label">Expand around point</label>
                <input
                  type="text"
                  className="forge-input"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  value={seriesPoint}
                  onChange={(e) => setSeriesPoint(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="forge-label">Number of terms</label>
                <input
                  type="number"
                  min={2}
                  max={10}
                  className="forge-input"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  value={seriesTerms}
                  onChange={(e) => setSeriesTerms(parseInt(e.target.value) || 5)}
                />
              </div>
            </>
          )}
        </div>

        {needsBounds && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="forge-label">Lower bound</label>
              <input
                type="text"
                className="forge-input"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
                value={lowerBound}
                onChange={(e) => setLowerBound(e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <label className="forge-label">Upper bound</label>
              <input
                type="text"
                className="forge-input"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
                value={upperBound}
                onChange={(e) => setUpperBound(e.target.value)}
                placeholder="1"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 mb-8">
        <button
          onClick={handleCompute}
          disabled={loading}
          className="flex items-center gap-2"
          style={{
            padding: '10px 24px',
            background: loading ? '#3a3a52' : '#6c63ff',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
            fontWeight: 500,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
          }}
        >
          <Play size={14} />
          {loading ? 'Computing…' : 'Compute'}
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2"
          style={{
            padding: '10px 20px',
            background: 'transparent',
            border: '1px solid #1e1e2e',
            borderRadius: '8px',
            color: '#8884aa',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>

      {result && (
        <div className="space-y-5">
          <ResultDisplay result={result.result} label={result.summary ? 'Result' : 'Output'} />

          <StepsPanel steps={result.steps} summary={result.summary} />

          {result.seriesTerms && result.seriesTerms.length > 0 && (
            <div className="forge-card">
              <p className="text-xs uppercase tracking-wider mb-4" style={{ color: '#8884aa' }}>Term breakdown</p>
              <div className="space-y-2">
                {result.seriesTerms.map((term) => (
                  <div
                    key={term.termIndex}
                    className="flex items-center justify-between"
                    style={{ padding: '8px 12px', background: '#0a0a0f', borderRadius: '6px', border: '1px solid #1e1e2e' }}
                  >
                    <div className="flex items-center gap-3">
                      <span style={{ fontSize: '11px', color: '#8884aa', fontFamily: 'JetBrains Mono, monospace', minWidth: '24px' }}>
                        n={term.termIndex}
                      </span>
                      <span style={{ fontSize: '13px', color: '#e2e0ff', fontFamily: 'JetBrains Mono, monospace' }}>
                        {term.expression}
                      </span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#6c63ff', fontFamily: 'JetBrains Mono, monospace' }}>
                      ≈ {term.numericalValue?.toFixed(6)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
