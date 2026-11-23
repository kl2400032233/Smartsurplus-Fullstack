'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { apiRequest } from '../../lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) return setError('Please fill in all fields.')

    setLoading(true)
    try {
      const user = await apiRequest('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ email: form.email, password: form.password }),
      })

      // Do not keep the password in browser storage.
      const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
      localStorage.setItem('smartSurplusUser', JSON.stringify(safeUser))
      localStorage.setItem('isLoggedIn', 'true')
      router.push('/select-role')
    } catch (err) {
      setError(err.message || 'Unable to sign in. Check the backend and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="orb w-80 h-80 bg-blue-600 -top-20 -right-20" />
      <div className="orb w-64 h-64 bg-emerald-500 bottom-0 -left-10" />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl btn-primary flex items-center justify-center text-lg">🌱</div>
            <span className="font-display font-700 text-xl text-white">SmartSurplus</span>
          </Link>
          <h1 className="font-display font-700 text-3xl text-white">Welcome back</h1>
          <p className="text-slate-500 mt-2 text-sm">Sign in to your SmartSurplus account</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 border border-white/10 space-y-4">
          <div>
            <label className="text-xs text-slate-400 font-medium mb-1.5 block">Email Address</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="input-field" />
          </div>
          <div>
            <label className="text-xs text-slate-400 font-medium mb-1.5 block">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Your password" className="input-field" />
          </div>
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-xs text-slate-500 hover:text-emerald-400 transition-colors">Forgot password?</Link>
          </div>
          {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}
          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 rounded-xl text-white font-semibold text-base disabled:opacity-60">
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>
        <div className="mt-4 glass rounded-2xl p-4 border border-white/5 text-center">
          <p className="text-xs text-slate-500">New here? <Link href="/register" className="text-emerald-400 font-medium hover:text-emerald-300">Create a free account</Link> to get started.</p>
        </div>
      </div>
    </div>
  )
}
