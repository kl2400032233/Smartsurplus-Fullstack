"use client";
import { useEffect, useState } from "react";
import { apiRequest, getStoredUser } from "../../../../lib/api";

export default function BrowsePage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestingId, setRequestingId] = useState(null);

  async function loadDonations() {
    try {
      const all = await apiRequest("/api/donations");
      setDonations((all || []).filter((d) => (d.status || "Pending").toLowerCase() === "pending"));
    } catch (err) {
      setError(err.message || "Could not load donations.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadDonations(); }, []);

  const handleRequest = async (donation) => {
    const user = getStoredUser();
    if (!user) return setError("Please sign in again.");
    setRequestingId(donation.id);
    setError("");
    try {
      await apiRequest("/api/requests", {
        method: "POST",
        body: JSON.stringify({
          donationId: donation.id,
          foodName: donation.foodName,
          quantity: String(donation.quantity),
          requesterName: user.name,
          requesterEmail: user.email,
        }),
      });
      alert("Request sent successfully!");
    } catch (err) {
      setError(err.message || "Could not send request.");
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <div className="space-y-6 text-white">
      <h1 className="text-3xl font-bold">Browse Available Donations</h1>
      {error && <p className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-red-300">{error}</p>}
      {loading ? <p className="text-slate-400">Loading available donations...</p> : donations.length === 0 ? (
        <p className="text-slate-400">No pending donations are available right now.</p>
      ) : donations.map((item) => (
        <div key={item.id} className="p-4 bg-gray-800 rounded-xl flex justify-between items-center gap-4">
          <div>
            <p className="font-semibold">{item.foodName}</p>
            <p className="text-sm text-gray-400">Quantity: {item.quantity} · Donor: {item.donorName}</p>
          </div>
          <button disabled={requestingId === item.id} onClick={() => handleRequest(item)} className="bg-blue-600 px-4 py-2 rounded-lg disabled:opacity-60">
            {requestingId === item.id ? "Sending..." : "Request"}
          </button>
        </div>
      ))}
    </div>
  );
}
