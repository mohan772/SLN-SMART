import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const { user } = useAuth()

  return (
    <section className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Dashboard</h2>
      <p className="mt-3 text-slate-600">Your account details are shown below.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-slate-50 border border-slate-200 p-5">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">Name</h3>
          <p className="mt-2 text-slate-900">{user?.name}</p>
        </div>
        <div className="rounded-3xl bg-slate-50 border border-slate-200 p-5">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">Email</h3>
          <p className="mt-2 text-slate-900">{user?.email}</p>
        </div>
        <div className="rounded-3xl bg-slate-50 border border-slate-200 p-5">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">Role</h3>
          <p className="mt-2 text-slate-900 capitalize">{user?.role}</p>
        </div>
      </div>
    </section>
  )
}

export default Dashboard
