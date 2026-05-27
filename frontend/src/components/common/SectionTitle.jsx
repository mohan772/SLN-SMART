const SectionTitle = ({ eyebrow, title, description }) => {
  return (
    <div className="space-y-3">
      <p className="text-sm uppercase tracking-[0.35em] text-emerald-800">{eyebrow}</p>
      <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">{title}</h2>
      {description && <p className="max-w-3xl text-slate-600">{description}</p>}
    </div>
  )
}

export default SectionTitle
