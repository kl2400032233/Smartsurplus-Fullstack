'use client'
import { useEffect, useState } from "react"
import Link from "next/link"
import { apiRequest, getStoredUser } from "../../../lib/api"

export default function DonorDashboard() {
  const [donations, setDonations] = useState([])
  const [error, setError] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const user = getStoredUser()
        const all = await apiRequest("/api/donations")
        setDonations((all || []).filter((d) => !user?.name || d.donorName === user.name))
      } catch (err) {
        setError(err.message || "Could not load donations.")
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-4xl font-bold text-white">Donor Dashboard</h1>
        <Link href="/dashboard/donor/donations" className="bg-gradient-to-r from-cyan-500 to-indigo-500 px-6 py-2 rounded-xl text-white font-medium">Manage Donations</Link>
      </div>
      {error && <p className="text-red-300">{error}</p>}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-slate-300">
          <thead className="bg-white/5"><tr><th className="p-4">Item</th><th className="p-4">Quantity</th><th className="p-4">Organization</th><th className="p-4">Status</th></tr></thead>
          <tbody>
            {donations.map((d) => (
              <tr key={d.id} className="border-t border-white/5">
                <td className="p-4">{d.foodName}</td><td className="p-4">{d.quantity}</td><td className="p-4">{d.organizationName}</td><td className="p-4">{d.status}</td>
              </tr>
            ))}
            {donations.length === 0 && <tr><td colSpan="4" className="p-4 text-slate-400">No donations yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
