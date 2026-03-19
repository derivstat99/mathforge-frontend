import { useState } from 'react'
import { Grid2x2, Play, RotateCcw } from 'lucide-react'
import { mathApi } from '../../api/math.js'
import MatrixInput from '../../components/math/MatrixInput.jsx'
import MatrixDisplay from '../../components/math/MatrixDisplay.jsx'
import DimensionPicker from '../../components/math/DimensionPicker.jsx'
import StepsPanel from '../../components/math/StepsPanel.jsx'
import toast from 'react-hot-toast'

const OPERATIONS = [
  { value: 'ADD',            label: 'Addition',           needsB: true,  needsScalar: false, needsSquare: false },
  { value: 'SUBTRACT',       label: 'Subtraction',        needsB: true,  needsScalar: false, needsSquare: false },
  { value: 'MULTIPLY',       label: 'Multiplication',     needsB: true,  needsScalar: false, needsSquare: false },
  { value: 'SCALAR_MULTIPLY',label: 'Scalar Multiply',    needsB: false, needsScalar: true,  needsSquare: false },
  { value: 'TRANSPOSE',      label: 'Transpose',          needsB: false, needsScalar: false, needsSquare: false },
  { value: 'DETERMINANT',    label: 'Determinant',        needsB: false, needsScalar: false, needsSquare: true  },
  { value: 'INVERSE',        label: 'Inverse',            needsB: false, needsScalar: false, needsSquare: true  },
  { value: 'EIGENVALUES',    label: 'Eigenvalues',        needsB: false, needsScalar: false, needsSquare: true  },
  { value: 'LU',             label: 'LU Decomposition',   needsB: false, needsScalar: false, needsSquare: true  },
  { value: 'RANK',           label: 'Rank',               needsB: false, needsScalar: false, needsSquare: false },
]

const emptyMatrix = (r, c) => Array.from({ length: r }, () => Array(c).fill(0))

export default function LinearAlgebraPage() {
  const [operation, setOperation] = useState('ADD')
  const [rowsA, setRowsA] = useState(2)
  const [colsA, setColsA] = useState(2)
  const [rowsB, setRowsB] = useState(2)
  const [colsB, setColsB] = useState(2)
  const [matrixA, setMatrixA] = useState(emptyMatrix(2, 2))
  const [matrixB, setMatrixB] = useState(emptyMatrix(2, 2))
  const [scalar, setScalar] = useState(2)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const currentOp = OPERATIONS.find((o) => o.value === operation)

  const handleCompute = async () => {
    setLoading(true)
    setResult(null)
    try {
      const payload = {
        operation,
        matrixA,
        matrixB: currentOp.needsB ? matrixB : undefined,
        scalar: currentOp.needsScalar ? scalar : undefined,
      }
      const { data } = await mathApi.linearAlgebra(payload)
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
    setMatrixA(emptyMatrix(rowsA, colsA))
    setMatrixB(emptyMatrix(rowsB, colsB))
    setScalar(2)
    setResult(null)
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Grid2x2 style={{ color: '#c084fc' }} size={22} />
        <h1 className="text-3xl" style={{ fontFamily: 'DM Serif Display, serif', color: '#e2e0ff' }}>Linear Algebra</h1>
      </div>

      <div className="forge-card mb-6">
        <p className="text-xs uppercase tracking-wider mb-3" style={{ color: '#8884aa' }}>Operation</p>
        <div className="flex flex-wrap gap-2">
          {OPERATIONS.map((op) => (
            <button
              key={op.value}
              onClick={() => { setOperation(op.value); setResult(null) }}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '13px',
                fontFamily: 'DM Sans, sans-serif',
                cursor: 'pointer',
                transition: 'all 0.15s',
                background: operation === op.value ? 'rgba(108,99,255,0.2)' : 'transparent',
                border: operation === op.value ? '1px solid rgba(108,99,255,0.5)' : '1px solid #1e1e2e',
                color: operation === op.value ? '#a78bfa' : '#8884aa',
              }}
            >
              {op.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: currentOp.needsB ? '1fr 1fr' : '1fr' }}>
        <div className="forge-card">
          <div className="mb-4">
            <DimensionPicker
              label="Matrix A"
              rows={rowsA}
              cols={colsA}
              onRowsChange={(r) => { setRowsA(r); if (currentOp.needsSquare) setColsA(r) }}
              onColsChange={(c) => { setColsA(c); if (currentOp.needsSquare) setRowsA(c) }}
            />
          </div>
          <MatrixInput
            label="Matrix A"
            rows={rowsA}
            cols={colsA}
            values={matrixA}
            onChange={setMatrixA}
          />
        </div>

        {currentOp.needsB && (
          <div className="forge-card">
            <div className="mb-4">
              <DimensionPicker
                label="Matrix B"
                rows={rowsB}
                cols={colsB}
                onRowsChange={setRowsB}
                onColsChange={setColsB}
              />
            </div>
            <MatrixInput
              label="Matrix B"
              rows={rowsB}
              cols={colsB}
              values={matrixB}
              onChange={setMatrixB}
            />
          </div>
        )}
      </div>

      {currentOp.needsScalar && (
        <div className="forge-card mt-6">
          <label className="forge-label">Scalar value</label>
          <input
            type="number"
            value={scalar}
            onChange={(e) => setScalar(parseFloat(e.target.value) || 0)}
            className="forge-input"
            style={{ maxWidth: '160px' }}
          />
        </div>
      )}

      <div className="flex gap-3 mt-6">
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
        <div className="mt-8 space-y-6">
          <StepsPanel steps={result.steps} summary={result.summary} />

          {result.scalarResult !== null && result.scalarResult !== undefined && (
            <div className="forge-card">
              <p className="text-xs uppercase tracking-wider mb-3" style={{ color: '#8884aa' }}>Result</p>
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '28px', color: '#6c63ff' }}>
                {result.scalarResult}
              </p>
            </div>
          )}

          {result.resultMatrix && (
            <div className="forge-card">
              <MatrixDisplay label="Result Matrix" matrix={result.resultMatrix} />
            </div>
          )}

          {result.lowerMatrix && result.upperMatrix && (
            <div className="grid grid-cols-2 gap-6">
              <div className="forge-card">
                <MatrixDisplay label="L — Lower Triangular" matrix={result.lowerMatrix} />
              </div>
              <div className="forge-card">
                <MatrixDisplay label="U — Upper Triangular" matrix={result.upperMatrix} />
              </div>
            </div>
          )}

          {result.eigenvalues && result.eigenvalues.length > 0 && (
            <div className="forge-card">
              <p className="text-xs uppercase tracking-wider mb-3" style={{ color: '#8884aa' }}>Eigenvalues</p>
              <div className="flex flex-wrap gap-3">
                {result.eigenvalues.map((val, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '8px 16px',
                      background: 'rgba(108,99,255,0.1)',
                      border: '1px solid rgba(108,99,255,0.25)',
                      borderRadius: '8px',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '14px',
                      color: '#a78bfa',
                    }}
                  >
                    λ{i + 1} = {typeof val === 'number' ? val.toFixed(6) : val}
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.eigenvectors && (
            <div className="forge-card">
              <MatrixDisplay label="Eigenvector Matrix (columns are eigenvectors)" matrix={result.eigenvectors} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
