'use client'
import { useCallback, useEffect, useState } from 'react'
import { apiRequest } from '../../../../lib/api'

const emptyForm = { name: '', type: 'Food Bank', location: '', capacity: '' }
const statusColors = { Verified: 'text-emerald-400 bg-emerald-500/10', Pending: 'text-yellow-400 bg-yellow-500/10', 'Under Review': 'text-orange-400 bg-orange-500/10' }

export default function AdminOrganizationsPage() {
  const [organizations, setOrganizations] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const loadOrganizations = useCallback(async () => {
    setLoading(true); setError('')
    try { setOrganizations(await apiRequest('/api/organizations')) }
    catch (e) { setError(e.message || 'Could not load organizations.') }
    finally { setLoading(false) }
  }, [])
  useEffect(() => { loadOrganizations() }, [loadOrganizations])

  async function handleSubmit(e) {
    e.preventDefault(); setSaving(true); setError(''); setMessage('')
    try {
      await apiRequest('/api/organizations', { method: 'POST', body: JSON.stringify({ ...form, status: 'Pending' }) })
      setForm(emptyForm); setShowForm(false); setMessage('Organization added successfully.')
      await loadOrganizations()
    } catch (e) { setError(e.message || 'Could not add organization.') }
    finally { setSaving(false) }
  }

  async function changeStatus(id, status) {
    setError(''); setMessage('')
    try {
      await apiRequest(`/api/organizations/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) })
      setMessage(`Organization marked ${status.toLowerCase()}.`); await loadOrganizations()
    } catch (e) { setError(e.message || 'Could not update organization.') }
  }

  return <div className="space-y-6 animate-fade-up">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="font-display font-800 text-3xl text-white">Organizations</h1><p className="text-slate-500 mt-1">Add, review, and manage recipient organizations.</p></div>
      <button onClick={() => { setShowForm(v => !v); setError('') }} className="btn-primary px-5 py-2.5 rounded-xl text-white font-medium text-sm">{showForm ? 'Close form' : '+ Add Organization'}</button></div>
    {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
    {message && <p role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">{message}</p>}
    {showForm && <form onSubmit={handleSubmit} className="glass rounded-2xl border border-white/10 p-5 grid gap-4 md:grid-cols-2">
      <label className="text-sm text-slate-300">Organization name *<input required value={form.name} onChange={e => setForm({...form,name:e.target.value})} className="input-field mt-1" placeholder="Organization name" /></label>
      <label className="text-sm text-slate-300">Organization type<select value={form.type} onChange={e => setForm({...form,type:e.target.value})} className="input-field mt-1"><option>Food Bank</option><option>Homeless Shelter</option><option>Community Kitchen</option><option>NGO</option><option>Other</option></select></label>
      <label className="text-sm text-slate-300">Location<input value={form.location} onChange={e => setForm({...form,location:e.target.value})} className="input-field mt-1" placeholder="City, State" /></label>
      <label className="text-sm text-slate-300">Daily capacity<input value={form.capacity} onChange={e => setForm({...form,capacity:e.target.value})} className="input-field mt-1" placeholder="e.g. 200 kg/day" /></label>
      <div className="md:col-span-2"><button disabled={saving} className="btn-primary rounded-xl px-5 py-2.5 text-white disabled:opacity-60">{saving ? 'Saving...' : 'Save Organization'}</button></div>
    </form>}
    <div className="glass rounded-2xl border border-white/10 overflow-hidden"><div className="overflow-x-auto"><table className="w-full"><thead><tr className="text-xs text-slate-500 border-b border-white/5">{['Organization','Type','Location','Capacity','Status','Actions'].map(h=><th key={h} className="text-left px-5 py-3 font-medium">{h}</th>)}</tr></thead>
      <tbody>{loading ? <tr><td colSpan="6" className="px-5 py-8 text-center text-slate-400">Loading organizations...</td></tr> : organizations.length === 0 ? <tr><td colSpan="6" className="px-5 py-8 text-center text-slate-400">No organizations yet. Add your first organization.</td></tr> : organizations.map(o=><tr key={o.id} className="border-b border-white/5"><td className="px-5 py-4 text-sm text-white font-semibold">{o.name}</td><td className="px-5 py-4 text-sm text-slate-400">{o.type || '—'}</td><td className="px-5 py-4 text-sm text-slate-400">{o.location || '—'}</td><td className="px-5 py-4 text-sm text-slate-400">{o.capacity || '—'}</td><td className="px-5 py-4"><span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[o.status] || statusColors.Pending}`}>{o.status || 'Pending'}</span></td><td className="px-5 py-4"><select aria-label={`Update status for ${o.name}`} value={o.status || 'Pending'} onChange={e=>changeStatus(o.id,e.target.value)} className="input-field text-xs py-1"><option>Pending</option><option>Under Review</option><option>Verified</option></select></td></tr>)}</tbody>
    </table></div></div>
  </div>
}
