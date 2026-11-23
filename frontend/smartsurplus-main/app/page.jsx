'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">

      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg"
          alt="Volunteers distributing food"
          className="w-full h-full object-cover"
        />

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black/95" />
      </div>

      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-5 border-b border-white/10 backdrop-blur-md bg-black/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-lg shadow-lg">
            🌱
          </div>
          <span className="font-bold text-xl tracking-wide">
            SmartSurplus
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="border border-white/30 px-5 py-2 rounded-xl hover:bg-white/10 transition duration-300"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="bg-emerald-600 px-5 py-2 rounded-xl hover:bg-emerald-500 transition duration-300 shadow-md"
          >
            Start for Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-40 pb-32">

        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          <span className="text-emerald-400">Reduce Food Waste.</span><br />
          <span className="text-white">Feed Communities.</span>
        </h1>

        <p className="text-slate-300 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          SmartSurplus connects restaurants, retailers, and farms with NGOs
          and communities — transforming surplus food into sustainability,
          opportunity, and hope.
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          <Link
            href="/register"
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl font-semibold hover:scale-105 transition duration-300 shadow-xl"
          >
            🌾 Join the Movement
          </Link>

          <Link
            href="/select-role"
            className="px-8 py-4 border border-white/30 rounded-2xl hover:bg-white/10 transition duration-300"
          >
            View Dashboard →
          </Link>
        </div>

      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-slate-400 border-t border-white/10 backdrop-blur-sm bg-black/30">
        © 2025 SmartSurplus — Reducing Food Waste 🌱
      </footer>

    </div>
  )
}