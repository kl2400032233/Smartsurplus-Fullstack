"use client";
import { useEffect, useState } from "react";
import { apiRequest, getStoredUser } from "../../../../lib/api";

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRequests() {
      try {
        const user = getStoredUser();
        const all = await apiRequest("/api/requests");
        setRequests((all || []).filter((r) => !user?.email || r.requesterEmail === user.email));
      } catch (err) {
        setError(err.message || "Could not load requests.");
      } finally {
        setLoading(false);
      }
    }
    loadRequests();
  }, []);

  return (
    <div className="space-y-6 text-white">
      <h1 className="text-3xl font-bold">My Requests</h1>
      {error && <p className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-red-300">{error}</p>}
      {loading ? <p className="text-slate-400">Loading requests...</p> : requests.length === 0 ? (
        <p>No requests yet.</p>
      ) : requests.map((r) => (
        <div key={r.id} className="p-4 bg-gray-800 rounded-xl">
          <p className="font-semibold">{r.foodName}</p>
          <p>Quantity: {r.quantity}</p>
          <p>Status: {r.status}</p>
        </div>
      ))}
    </div>
  );
}
