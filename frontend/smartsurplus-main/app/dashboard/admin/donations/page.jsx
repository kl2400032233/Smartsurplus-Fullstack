'use client'
import { useEffect, useState } from 'react'
import { apiRequest } from '../../../../lib/api'

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadDonations() {
    try {
      const data = await apiRequest('/api/donations')
      setDonations(data || [])
    } catch (err) {
      setError(err.message || 'Could not load donations.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadDonations() }, [])

  async function updateStatus(id, status) {
    try {
      await apiRequest(`/api/donations/${id}/status?status=${encodeURIComponent(status)}`, { method: 'PUT' })
      await loadDonations()
    } catch (err) {
      setError(err.message || 'Could not update status.')
    }
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display font-800 text-3xl text-white">Donation Management</h1>
        <p className="text-slate-500 mt-1">Manage donations stored in the backend database.</p>
      </div>
      {error && <p className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-red-300">{error}</p>}
      {loading ? <p className="text-slate-400">Loading donations...</p> : (
        <div className="glass rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="text-xs text-slate-500 border-b border-white/5">
                {['ID', 'Food Item', 'Donor', 'Organization', 'Qty', 'Status', 'Update status'].map(h => <th key={h} className="text-left px-6 py-3 font-medium">{h}</th>)}
              </tr></thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d.id} className="border-b border-white/5">
                    <td className="px-6 py-4 text-xs text-slate-500">{d.id}</td>
                    <td className="px-6 py-4 text-sm text-white">{d.foodName}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{d.donorName}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{d.organizationName}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{d.quantity}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{d.status}</td>
                    <td className="px-6 py-4">
                      <select value={d.status || 'Pending'} onChange={(e) => updateStatus(d.id, e.target.value)} className="bg-slate-800 text-white rounded-lg p-2 text-xs">
                        <option>Pending</option><option>Approved</option><option>In Transit</option><option>Completed</option><option>Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {donations.length === 0 && <tr><td colSpan="7" className="px-6 py-5 text-slate-400">No donations have been created yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
