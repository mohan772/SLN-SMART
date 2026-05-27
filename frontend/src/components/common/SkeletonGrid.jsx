const SkeletonGrid = ({ columns = 3, rows = 2 }) => {
  return (
    <div className={`grid gap-6 ${columns === 3 ? 'lg:grid-cols-3' : columns === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}>
      {Array.from({ length: rows * columns }).map((_, index) => (
        <div key={index} className="animate-pulse rounded-[2rem] border border-slate-200 bg-slate-100 p-6" />
      ))}
    </div>
  )
}

export default SkeletonGrid
