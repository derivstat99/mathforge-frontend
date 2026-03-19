import { ImageUp } from 'lucide-react'

export default function ImageParserPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <ImageUp style={{ color: '#fbbf24' }} size={22} />
        <h1 className="text-3xl" style={{ fontFamily: 'DM Serif Display, serif', color: '#e2e0ff' }}>Image Parser</h1>
      </div>
      <div className="forge-card text-center py-20">
        <p style={{ color: '#8884aa' }}>Coming in Milestone 5 — AI image parser being built.</p>
      </div>
    </div>
  )
}
