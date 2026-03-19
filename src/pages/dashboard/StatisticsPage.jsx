import { useState } from 'react'
import { BarChart3, Play, RotateCcw } from 'lucide-react'
import { mathApi } from '../../api/math.js'
import DataInput from '../../components/math/DataInput.jsx'
import StatsChart from '../../components/math/StatsChart.jsx'
import StepsPanel from '../../components/math/StepsPanel.jsx'
import toast from 'react-hot-toast'

const OPERATIONS = [
  { value: 'DESCRIPTIVE',  label: 'Descriptive stats',   needsY: false },
  { value: 'HISTOGRAM',    label: 'Histogram',            needsY: false },
  { value: 'DISTRIBUTION', label: 'Distribution',         needsY: false, noData: true },
  { value: 'REGRESSION',   label: 'Linear regression',   needsY: true  },
  { value: 'CORRELATION',  label: 'Correlation',          needsY: true  },
  { value: 'HYPOTHESIS',   label: 'Hypothesis test',      needsY: false },
]

const DISTRIBUTIONS = ['NORMAL', 'BINOMIAL', 'POISSON', 'EXPONENTIAL']

const DIST_PARAM_LABELS = {
  NORMAL:      { p1: 'Mean (μ)',        p2: 'Std Dev (σ)' },
  BINOMIAL:    { p1: 'Trials (n)',      p2: 'Probability (p)' },
  POISSON:     { p1: 'Lambda (λ)',      p2: null },
  EXPONENTIAL: { p1: 'Rate (λ)',        p2: null },
}

export default function StatisticsPage() {
  const [operation, setOperation]     = useState('DESCRIPTIVE')
  const [dataX, setDataX]             = useState([])
  const [dataY, setDataY]             = useState([])
  const [distribution, setDistribution] = useState('NORMAL')
  const [param1, setParam1]           = useState(0)
  const [param2, setParam2]           = useState(1)
  const [bins, setBins]               = useState(10)
  const [testValue, setTestValue]     = useState(0)
  const [alpha, setAlpha]             = useState(0.05)
  const [hypothesisType, setHypothesisType] = useState('TWO_TAILED')
  const [result, setResult]           = useState(null)
  const [loading, setLoading]         = useState(false)

  const currentOp = OPERATIONS.find((o) => o.value === operation)

  const handleCompute = async () => {
    setLoading(true)
    setResult(null)
    try {
      const payload = {
        operation,
        dataX:          currentOp.noData ? undefined : dataX,
        dataY:          currentOp.needsY ? dataY : undefined,
        distribution:   operation === 'DISTRIBUTION' ? distribution : undefined,
        param1:         operation === 'DISTRIBUTION' ? param1 : operation === 'HISTOGRAM' ? bins : undefined,
        param2:         operation === 'DISTRIBUTION' ? param2 : undefined,
        testValue:      operation === 'HYPOTHESIS' ? testValue : undefined,
        alpha:          operation === 'HYPOTHESIS' ? alpha : undefined,
        hypothesisType: operation === 'HYPOTHESIS' ? hypothesisType : undefined,
      }
      const { data } = await mathApi.statistics(payload)
      setResult(data.data)
      toast.success('Computed successfully')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Computation failed')
    } finally {
      setLoading(false)
    }
  }

  const paramLabels = DIST_PARAM_LABELS[distribution]

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <BarChart3 style={{ color: '#34d399' }} size={22} />
        <h1 className="text-3xl" style={{ fontFamily: 'DM Serif Display, serif', color: '#e2e0ff' }}>Statistics</h1>
      </div>

      <div className="forge-card mb-6">
        <p className="text-xs uppercase tracking-wider mb-3" style={{ color: '#8884aa' }}>Operation</p>
        <div className="flex flex-wrap gap-2">
          {OPERATIONS.map((op) => (
            <button
              key={op.value}
              onClick={() => { setOperation(op.value); setResult(null) }}
              style={{
                padding: '6px 14px', borderRadius: '6px', fontSize: '13px',
                fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', transition: 'all 0.15s',
                background: operation === op.value ? 'rgba(52,211,153,0.15)' : 'transparent',
                border: operation === op.value ? '1px solid rgba(52,211,153,0.4)' : '1px solid #1e1e2e',
                color: operation === op.value ? '#34d399' : '#8884aa',
              }}
            >
              {op.label}
            </button>
          ))}
        </div>
      </div>

      <div className="forge-card mb-4 space-y-5">
        {operation === 'DISTRIBUTION' ? (
          <>
            <div>
              <label className="forge-label">Distribution type</label>
              <div className="flex flex-wrap gap-2">
                {DISTRIBUTIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDistribution(d)}
                    style={{
                      padding: '6px 14px', borderRadius: '6px', fontSize: '12px',
                      fontFamily: 'JetBrains Mono, monospace', cursor: 'pointer',
                      background: distribution === d ? 'rgba(167,139,250,0.15)' : 'transparent',
                      border: distribution === d ? '1px solid rgba(167,139,250,0.4)' : '1px solid #1e1e2e',
                      color: distribution === d ? '#a78bfa' : '#8884aa',
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="forge-label">{paramLabels.p1}</label>
                <input type="number" className="forge-input" style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  value={param1} onChange={(e) => setParam1(parseFloat(e.target.value) || 0)} />
              </div>
              {paramLabels.p2 && (
                <div>
                  <label className="forge-label">{paramLabels.p2}</label>
                  <input type="number" className="forge-input" style={{ fontFamily: 'JetBrains Mono, monospace' }}
                    value={param2} onChange={(e) => setParam2(parseFloat(e.target.value) || 1)} />
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <DataInput
              labelX={currentOp.needsY ? 'X values' : 'Data values'}
              labelY="Y values"
              valueX={dataX}
              valueY={dataY}
              onChangeX={setDataX}
              onChangeY={currentOp.needsY ? setDataY : undefined}
            />

            {operation === 'HISTOGRAM' && (
              <div>
                <label className="forge-label">Number of bins</label>
                <input type="number" min={2} max={50} className="forge-input"
                  style={{ maxWidth: '120px', fontFamily: 'JetBrains Mono, monospace' }}
                  value={bins} onChange={(e) => setBins(parseInt(e.target.value) || 10)} />
              </div>
            )}

            {operation === 'HYPOTHESIS' && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="forge-label">Null hypothesis μ₀</label>
                  <input type="number" className="forge-input" style={{ fontFamily: 'JetBrains Mono, monospace' }}
                    value={testValue} onChange={(e) => setTestValue(parseFloat(e.target.value) || 0)} />
                </div>
                <div>
                  <label className="forge-label">Significance (α)</label>
                  <input type="number" step="0.01" min="0.01" max="0.1" className="forge-input"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                    value={alpha} onChange={(e) => setAlpha(parseFloat(e.target.value) || 0.05)} />
                </div>
                <div>
                  <label className="forge-label">Test type</label>
                  <select className="forge-input" style={{ fontFamily: 'JetBrains Mono, monospace' }}
                    value={hypothesisType} onChange={(e) => setHypothesisType(e.target.value)}>
                    <option value="TWO_TAILED">Two-tailed</option>
                    <option value="LEFT_TAILED">Left-tailed</option>
                    <option value="RIGHT_TAILED">Right-tailed</option>
                  </select>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex gap-3 mb-8">
        <button onClick={handleCompute} disabled={loading} className="flex items-center gap-2"
          style={{
            padding: '10px 24px', background: loading ? '#3a3a52' : '#6c63ff',
            border: 'none', borderRadius: '8px', color: '#fff',
            fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 500,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}>
          <Play size={14} />
          {loading ? 'Computing…' : 'Compute'}
        </button>
        <button onClick={() => { setResult(null); setDataX([]); setDataY([]) }}
          className="flex items-center gap-2"
          style={{
            padding: '10px 20px', background: 'transparent', border: '1px solid #1e1e2e',
            borderRadius: '8px', color: '#8884aa', fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px', cursor: 'pointer',
          }}>
          <RotateCcw size={14} />
          Reset
        </button>
      </div>

      {result && (
        <div className="space-y-6">
          <StepsPanel steps={result.steps} summary={result.summary} />

          {result.descriptiveStats && (
            <div className="forge-card">
              <p className="text-xs uppercase tracking-wider mb-4" style={{ color: '#8884aa' }}>Statistics</p>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(result.descriptiveStats).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center"
                    style={{ padding: '8px 12px', background: '#0a0a0f', borderRadius: '6px', border: '1px solid #1e1e2e' }}>
                    <span style={{ fontSize: '12px', color: '#8884aa', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{key}</span>
                    <span style={{ fontSize: '14px', color: '#e2e0ff', fontFamily: 'JetBrains Mono, monospace' }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.regressionSlope !== undefined && result.regressionSlope !== null && (
            <div className="forge-card">
              <p className="text-xs uppercase tracking-wider mb-4" style={{ color: '#8884aa' }}>Regression results</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Slope (b₁)', value: result.regressionSlope },
                  { label: 'Intercept (b₀)', value: result.regressionIntercept },
                  { label: 'R²', value: result.rSquared },
                ].map(({ label, value }) => (
                  <div key={label} style={{ padding: '12px', background: '#0a0a0f', borderRadius: '8px', border: '1px solid #1e1e2e' }}>
                    <p style={{ fontSize: '11px', color: '#8884aa', marginBottom: '4px' }}>{label}</p>
                    <p style={{ fontSize: '18px', color: '#6c63ff', fontFamily: 'JetBrains Mono, monospace' }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.testStatistic !== undefined && result.testStatistic !== null && (
            <div className="forge-card" style={{ border: result.rejectNull ? '1px solid rgba(248,113,113,0.3)' : '1px solid rgba(52,211,153,0.3)' }}>
              <p className="text-xs uppercase tracking-wider mb-4" style={{ color: '#8884aa' }}>Hypothesis test result</p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 't-statistic', value: result.testStatistic },
                  { label: 'p-value', value: result.pValue },
                  { label: 'α', value: result.criticalValue },
                ].map(({ label, value }) => (
                  <div key={label} style={{ padding: '12px', background: '#0a0a0f', borderRadius: '8px', border: '1px solid #1e1e2e' }}>
                    <p style={{ fontSize: '11px', color: '#8884aa', marginBottom: '4px' }}>{label}</p>
                    <p style={{ fontSize: '18px', fontFamily: 'JetBrains Mono, monospace', color: '#e2e0ff' }}>{value}</p>
                  </div>
                ))}
              </div>
              <div style={{
                padding: '12px 16px', borderRadius: '8px',
                background: result.rejectNull ? 'rgba(248,113,113,0.1)' : 'rgba(52,211,153,0.1)',
                border: result.rejectNull ? '1px solid rgba(248,113,113,0.25)' : '1px solid rgba(52,211,153,0.25)',
              }}>
                <p style={{ fontSize: '14px', color: result.rejectNull ? '#f87171' : '#34d399', fontWeight: 500 }}>
                  {result.rejectNull ? '✗ Reject H₀' : '✓ Fail to reject H₀'}
                </p>
                <p style={{ fontSize: '13px', color: '#8884aa', marginTop: '4px' }}>{result.conclusion}</p>
              </div>
            </div>
          )}

          {result.graphPoints && result.graphPoints.length > 0 && (
            <div className="forge-card">
              <StatsChart
                graphType={result.graphType}
                graphPoints={result.graphPoints}
                regressionLine={result.regressionLine}
                xLabel={result.xLabel}
                yLabel={result.yLabel}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
