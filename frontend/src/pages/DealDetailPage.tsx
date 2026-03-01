import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { dealService, type Deal } from '../services'

export function DealDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [deal, setDeal] = useState<Deal | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    async function loadDeal() {
      try {
        const data = await dealService.getById(id!)
        setDeal(data)
      } catch (err) {
        setError('Failed to load deal. It may not exist or you may not have access.')
        console.error('Failed to load deal:', err)
      } finally {
        setLoading(false)
      }
    }

    loadDeal()
  }, [id])

  if (loading) {
    return <div className="text-slate-500">Loading...</div>
  }

  if (error || !deal) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate('/deals')}
          className="text-indigo-600 hover:text-indigo-500 font-medium text-sm"
        >
          &larr; Back to Deals
        </button>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
          {error || 'Deal not found.'}
        </div>
      </div>
    )
  }

  const statusClasses: Record<string, string> = {
    won: 'bg-green-100 text-green-700',
    lost: 'bg-red-100 text-red-700',
    open: 'bg-slate-100 text-slate-700',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/deals')}
          className="text-indigo-600 hover:text-indigo-500 font-medium text-sm"
        >
          &larr; Back to Deals
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-900">{deal.title}</h1>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium shrink-0 ${
              statusClasses[deal.status] ?? statusClasses.open
            }`}
          >
            {deal.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <p className="text-sm font-medium text-slate-500">Value</p>
            <p className="text-xl font-semibold text-slate-900 mt-1">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(deal.value)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Stage</p>
            <p className="text-slate-900 mt-1">{deal.stageId ?? 'No stage assigned'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Created</p>
            <p className="text-slate-900 mt-1">
              {new Date(deal.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Stage History</h2>
        {/* TODO [Challenge 7]: Fetch stage history from GET /api/deals/:id/history */}
        {/* Display a timeline of stage transitions with timestamps and user info */}
        <p className="text-slate-500">Stage history not yet implemented.</p>
      </div>
    </div>
  )
}
