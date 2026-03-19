import {
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Legend
} from 'recharts'

const COLORS = {
  primary:    '#6c63ff',
  secondary:  '#34d399',
  regression: '#fbbf24',
  grid:       '#1e1e2e',
  text:       '#8884aa',
  axis:       '#3a3a52',
}

const tooltipStyle = {
  backgroundColor: '#12121a',
  border: '1px solid #1e1e2e',
  borderRadius: '8px',
  color: '#e2e0ff',
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: '12px',
}

export default function StatsChart({ graphType, graphPoints, regressionLine, xLabel, yLabel }) {
  if (!graphPoints || graphPoints.length === 0) return null

  const chartHeight = 300

  if (graphType === 'LINE') {
    return (
      <div>
        <p className="text-xs uppercase tracking-wider mb-4" style={{ color: '#8884aa' }}>Distribution curve</p>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <LineChart data={graphPoints} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
            <XAxis dataKey="x" stroke={COLORS.axis} tick={{ fill: COLORS.text, fontSize: 11 }} label={{ value: xLabel, position: 'insideBottom', offset: -10, fill: COLORS.text, fontSize: 11 }} />
            <YAxis stroke={COLORS.axis} tick={{ fill: COLORS.text, fontSize: 11 }} label={{ value: yLabel, angle: -90, position: 'insideLeft', fill: COLORS.text, fontSize: 11 }} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [v?.toFixed(6), 'f(x)']} />
            <Line type="monotone" dataKey="y" stroke={COLORS.primary} dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (graphType === 'BAR') {
    return (
      <div>
        <p className="text-xs uppercase tracking-wider mb-4" style={{ color: '#8884aa' }}>Histogram</p>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart data={graphPoints} margin={{ top: 10, right: 20, bottom: 30, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
            <XAxis dataKey="x" stroke={COLORS.axis} tick={{ fill: COLORS.text, fontSize: 10 }} label={{ value: xLabel, position: 'insideBottom', offset: -15, fill: COLORS.text, fontSize: 11 }} />
            <YAxis stroke={COLORS.axis} tick={{ fill: COLORS.text, fontSize: 11 }} label={{ value: 'Frequency', angle: -90, position: 'insideLeft', fill: COLORS.text, fontSize: 11 }} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [v, 'Count']} labelFormatter={(l) => 'Center: ' + l} />
            <Bar dataKey="y" fill={COLORS.primary} fillOpacity={0.8} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (graphType === 'SCATTER') {
    const combined = graphPoints.map((p) => ({ x: p.x, y: p.y }))
    const regData = regressionLine ? regressionLine.map((p) => ({ x: p.x, reg: p.y })) : null

    return (
      <div>
        <p className="text-xs uppercase tracking-wider mb-4" style={{ color: '#8884aa' }}>Scatter plot</p>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
            <XAxis type="number" dataKey="x" name={xLabel} stroke={COLORS.axis} tick={{ fill: COLORS.text, fontSize: 11 }} label={{ value: xLabel, position: 'insideBottom', offset: -10, fill: COLORS.text, fontSize: 11 }} />
            <YAxis type="number" dataKey="y" name={yLabel} stroke={COLORS.axis} tick={{ fill: COLORS.text, fontSize: 11 }} label={{ value: yLabel, angle: -90, position: 'insideLeft', fill: COLORS.text, fontSize: 11 }} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: '3 3', stroke: COLORS.axis }} formatter={(v, name) => [v, name]} />
            <Scatter data={combined} fill={COLORS.primary} fillOpacity={0.8} />
          </ScatterChart>
        </ResponsiveContainer>

        {regData && (
          <div style={{ marginTop: '12px' }}>
            <p className="text-xs uppercase tracking-wider mb-4" style={{ color: '#8884aa' }}>Regression line overlay</p>
            <ResponsiveContainer width="100%" height={chartHeight}>
              <LineChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
                <XAxis type="number" dataKey="x" stroke={COLORS.axis} tick={{ fill: COLORS.text, fontSize: 11 }} />
                <YAxis stroke={COLORS.axis} tick={{ fill: COLORS.text, fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ color: COLORS.text, fontSize: 12 }} />
                <Line data={combined} type="scatter" dataKey="y" stroke={COLORS.primary} dot={{ fill: COLORS.primary, r: 4 }} name="Data" strokeWidth={0} />
                <Line data={regData} type="linear" dataKey="reg" stroke={COLORS.regression} dot={false} strokeWidth={2} name="Regression line" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    )
  }

  if (graphType === 'BOX_PLOT') {
    return (
      <div>
        <p className="text-xs uppercase tracking-wider mb-4" style={{ color: '#8884aa' }}>Five-number summary</p>
        <div className="flex items-end justify-center gap-4" style={{ height: '120px', padding: '0 20px' }}>
          {graphPoints.map((p) => (
            <div key={p.label} className="flex flex-col items-center gap-1">
              <span style={{ fontSize: '12px', color: '#6c63ff', fontFamily: 'JetBrains Mono, monospace' }}>
                {p.y}
              </span>
              <div style={{ width: '48px', height: '32px', background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: '4px' }} />
              <span style={{ fontSize: '11px', color: '#8884aa' }}>{p.label}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}
