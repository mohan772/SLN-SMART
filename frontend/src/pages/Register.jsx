import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const { registerUser, error, loading, setError } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    await registerUser(name, email, password)
  }

  return (
    <section className="max-w-2xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Register</h2>
      <p className="mt-2 text-slate-600">Create your account to start ordering fresh vegetables.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
            required
            minLength={6}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
    </section>
  )
}

export default Register
