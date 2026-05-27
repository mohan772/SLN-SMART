import SectionTitle from '../components/common/SectionTitle'

const AnalyticsDashboard = () => {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <SectionTitle
        eyebrow="Analytics"
        title="Measure growth and customer demand"
        description="Analytics insights will show top-selling produce, conversion trends, and inventory health."
      />
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {['Top products', 'Conversion rate', 'Stock velocity'].map((metric) => (
          <article key={metric} className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">{metric}</h3>
            <p className="mt-3 text-slate-600">Metrics will populate after hook and API wiring.</p>
          </article>
        ))}
      </div>
    </div>
  )
}

export default AnalyticsDashboard
