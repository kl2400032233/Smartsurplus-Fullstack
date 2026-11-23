"use client";
import { useEffect, useState } from "react";
import { apiRequest, getStoredUser } from "../../../../lib/api";

export default function DonorDonationsPage() {
  const [donations, setDonations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [newDonation, setNewDonation] = useState({ foodName: "", quantity: "", organizationName: "" });

  async function loadDonations() {
    setError("");
    try {
      const user = getStoredUser();
      const all = await apiRequest("/api/donations");
      setDonations((all || []).filter((d) => !user?.name || d.donorName === user.name));
    } catch (err) {
      setError(err.message || "Could not load donations.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadDonations(); }, []);

  const handleAddDonation = async (e) => {
    e.preventDefault();
    const user = getStoredUser();
    if (!user) return setError("Please sign in again.");
    if (!newDonation.foodName || !newDonation.quantity) return setError("Enter food name and quantity.");

    setSaving(true);
    setError("");
    try {
      await apiRequest("/api/donations", {
        method: "POST",
        body: JSON.stringify({
          foodName: newDonation.foodName,
          quantity: Number(newDonation.quantity),
          donorName: user.name,
          organizationName: newDonation.organizationName || "Available to all organizations",
          status: "Pending",
        }),
      });
      setNewDonation({ foodName: "", quantity: "", organizationName: "" });
      setShowModal(false);
      await loadDonations();
    } catch (err) {
      setError(err.message || "Could not save donation.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 space-y-6 text-white">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Donations</h1>
        <button onClick={() => setShowModal(true)} className="bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-2 rounded-xl shadow-lg">
          + New Donation
        </button>
      </div>

      {error && <p className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-red-300">{error}</p>}
      {loading ? <p className="text-slate-400">Loading donations...</p> : (
        <div className="bg-gray-900/60 rounded-2xl shadow-xl p-6 border border-gray-800 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-gray-400 border-b border-gray-700">
              <tr><th className="py-3">Item</th><th>Quantity</th><th>Organization</th><th>Status</th></tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d.id} className="border-b border-gray-800">
                  <td className="py-4">{d.foodName}</td>
                  <td>{d.quantity}</td>
                  <td>{d.organizationName}</td>
                  <td><span className="px-3 py-1 rounded-full text-sm bg-orange-500">{d.status}</span></td>
                </tr>
              ))}
              {donations.length === 0 && <tr><td colSpan="4" className="py-5 text-slate-400">No donations yet. Add your first donation.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <form onSubmit={handleAddDonation} className="bg-gray-900 p-6 rounded-2xl w-full max-w-md space-y-4 border border-gray-700">
            <h2 className="text-xl font-semibold">Add New Donation</h2>
            <input required type="text" placeholder="Food name" value={newDonation.foodName} onChange={(e) => setNewDonation({ ...newDonation, foodName: e.target.value })} className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700" />
            <input required min="1" type="number" placeholder="Quantity (number)" value={newDonation.quantity} onChange={(e) => setNewDonation({ ...newDonation, quantity: e.target.value })} className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700" />
            <input type="text" placeholder="Organization (optional)" value={newDonation.organizationName} onChange={(e) => setNewDonation({ ...newDonation, organizationName: e.target.value })} className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700" />
            <div className="flex justify-between">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-700 rounded-lg">Cancel</button>
              <button disabled={saving} type="submit" className="px-4 py-2 bg-emerald-600 rounded-lg disabled:opacity-60">{saving ? "Saving..." : "Add Donation"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
