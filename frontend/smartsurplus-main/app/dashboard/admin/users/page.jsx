'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../../../../lib/api'

const roleColors = { donor: 'text-emerald-400 bg-emerald-500/10', organization: 'text-blue-400 bg-blue-500/10', analyst: 'text-purple-400 bg-purple-500/10', admin: 'text-orange-400 bg-orange-500/10' }
const statusColors = { Active: 'text-emerald-400 bg-emerald-500/10', Suspended: 'text-red-400 bg-red-500/10', Pending: 'text-yellow-400 bg-yellow-500/10' }

export default function AdminUsersPage() {
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState([])
  const [showInvite, setShowInvite] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', role: 'donor' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const loadUsers = useCallback(async () => {
    setLoading(true); setError('')
    try { setUsers(await apiRequest('/api/users')) }
    catch (e) { setError(e.message || 'Could not load users.') }
    finally { setLoading(false) }
  }, [])
  useEffect(() => { loadUsers() }, [loadUsers])
  const filtered = useMemo(() => users.filter(u => (u.name || '').toLowerCase().includes(search.toLowerCase()) || (u.email || '').toLowerCase().includes(search.toLowerCase())), [users, search])

  async function inviteUser(e) {
    e.preventDefault(); setSaving(true); setError(''); setMessage('')
    try {
      await apiRequest('/api/users/invite', { method: 'POST', body: JSON.stringify(form) })
      setForm({ name: '', email: '', role: 'donor' }); setShowInvite(false)
      setMessage('Invitation record created. No email was sent; email delivery is not configured yet.')
      await loadUsers()
    } catch (e) { setError(e.message || 'Could not create invitation.') }
    finally { setSaving(false) }
  }

  return <div className="space-y-6 animate-fade-up">
    <div className="flex items-center justify-between gap-3"><div><h1 className="font-display font-800 text-3xl text-white">User Management</h1><p className="text-slate-500 mt-1">View registered users and create invitation records.</p></div><button onClick={()=>{setShowInvite(v=>!v);setError('')}} className="btn-primary px-5 py-2.5 rounded-xl text-white font-medium text-sm">{showInvite ? 'Close' : '+ Invite User'}</button></div>
    {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
    {message && <p role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">{message}</p>}
    {showInvite && <form onSubmit={inviteUser} className="glass rounded-2xl border border-white/10 p-5 grid gap-4 md:grid-cols-3">
      <label className="text-sm text-slate-300">Full name *<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="input-field mt-1" placeholder="Full name" /></label>
      <label className="text-sm text-slate-300">Email address *<input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="input-field mt-1" placeholder="name@example.com" /></label>
      <label className="text-sm text-slate-300">Role<select value={form.role} onChange={e=>setForm({...form,role:e.target.value})} className="input-field mt-1"><option value="donor">Donor</option><option value="organization">Organization</option><option value="analyst">Analyst</option></select></label>
      <div className="md:col-span-3"><button disabled={saving} className="btn-primary rounded-xl px-5 py-2.5 text-white disabled:opacity-60">{saving ? 'Creating...' : 'Create Invitation'}</button><p className="text-xs text-slate-500 mt-2">This creates a pending user record. It does not send an email invitation.</p></div>
    </form>}
    <div className="glass rounded-2xl border border-white/10 overflow-hidden"><div className="px-6 py-4 border-b border-white/5"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search users..." className="input-field max-w-xs" /></div><div className="overflow-x-auto"><table className="w-full"><thead><tr className="text-xs text-slate-500 border-b border-white/5">{['Name','Email','Role','Status'].map(h=><th key={h} className="text-left px-6 py-3 font-medium">{h}</th>)}</tr></thead><tbody>
      {loading ? <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-400">Loading users...</td></tr> : filtered.length===0 ? <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-400">No users found.</td></tr> : filtered.map(u=><tr key={u.id} className="border-b border-white/5"><td className="px-6 py-4 text-sm text-white font-medium">{u.name}</td><td className="px-6 py-4 text-sm text-slate-400">{u.email}</td><td className="px-6 py-4"><span className={`text-xs font-semibold px-2 py-1 rounded-full ${roleColors[(u.role || '').toLowerCase()] || ''}`}>{u.role}</span></td><td className="px-6 py-4"><span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[u.status] || statusColors.Active}`}>{u.status || 'Active'}</span></td></tr>)}
    </tbody></table></div></div>
  </div>
}
