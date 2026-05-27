import SectionTitle from '../components/common/SectionTitle'

const Profile = () => {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <SectionTitle
        eyebrow="My profile"
        title="Your account details and order history"
        description="Keep your profile up to date and review every purchase from your SLN account."
      />
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Account summary</h3>
          <p className="mt-4 text-slate-600">User profile info will appear here after login, including email, membership status, and shipping preferences.</p>
        </section>
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Saved preferences</h3>
          <p className="mt-4 text-slate-600">This panel will become your control center for addresses, favorites, and payment methods.</p>
        </section>
      </div>
    </div>
  )
}

export default Profile
