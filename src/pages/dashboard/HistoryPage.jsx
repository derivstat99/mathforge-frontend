import { useEffect, useState } from 'react'
import { userApi } from '../../api/user.js'
import { History, ChevronLeft, ChevronRight } from 'lucide-react'

const MODULE_LABELS = {
  LINEAR_ALGEBRA: 'Linear Algebra',
  CALCULUS: 'Calculus',
  STATISTICS: 'Statistics',
  IMAGE_PARSE: 'Image',
}

const MODULE_COLORS = {
  LINEAR_ALGEBRA: { bg: 'rgba(168,85,247,0.15)', color: '#c084fc', border: 'rgba(168,85,247,0.2)' },
  CALCULUS: { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: 'rgba(59,130,246,0.2)' },
  STATISTICS: { bg: 'rgba(16,185,129,0.15)', color: '#34d399', border: 'rgba(16,185,129,0.2)' },
  IMAGE_PARSE: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: 'rgba(245,158,11,0.2)' },
}

export default function HistoryPage() {
  const [data, setData] = useState(null)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    userApi.getHistory(page, 15)
      .then((res) => setData(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page])

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <History style={{ color: '#6c63ff' }} size={22} />
        <h1 className="text-3xl" style={{ fontFamily: 'DM Serif Display, serif', color: '#e2e0ff' }}>History</h1>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#6c63ff', borderTopColor: 'transparent' }} />
        </div>
      )}

      {!loading && data?.content?.length === 0 && (
        <div className="forge-card text-center py-16">
          <p style={{ color: '#8884aa' }}>No calculations yet. Start exploring the modules!</p>
        </div>
      )}

      {!loading && data?.content?.length > 0 && (
        <>
          <div className="space-y-3">
            {data.content.map((item) => {
              const colors = MODULE_COLORS[item.module] || MODULE_COLORS.CALCULUS
              return (
                <div key={item.id} className="forge-card">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: colors.bg, color: colors.color, border: '1px solid ' + colors.border, fontFamily: 'JetBrains Mono, monospace' }}>
                          {MODULE_LABELS[item.module]}
                        </span>
                        <span className="text-xs" style={{ color: '#8884aa' }}>
                          {new Date(item.createdAt).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <p className="text-xs mb-1 truncate" style={{ color: '#8884aa', fontFamily: 'JetBrains Mono, monospace' }}>
                        Input: {item.input}
                      </p>
                      <p className="text-sm truncate" style={{ color: '#e2e0ff', fontFamily: 'JetBrains Mono, monospace' }}>
                        {item.result}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-between mt-6">
            <p className="text-sm" style={{ color: '#8884aa' }}>
              Page {data.number + 1} of {data.totalPages}
            </p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => p - 1)} disabled={data.first} className="forge-btn-ghost flex items-center gap-1" style={{ opacity: data.first ? 0.3 : 1 }}>
                <ChevronLeft size={14} /> Prev
              </button>
              <button onClick={() => setPage((p) => p + 1)} disabled={data.last} className="forge-btn-ghost flex items-center gap-1" style={{ opacity: data.last ? 0.3 : 1 }}>
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
