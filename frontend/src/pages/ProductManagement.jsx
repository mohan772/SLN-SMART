import SectionTitle from '../components/common/SectionTitle'

const ProductManagement = () => {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <SectionTitle
        eyebrow="Product management"
        title="Update your catalog and keep inventory fresh"
        description="Product management tools will let admins add, edit, and remove items with supplier-grade precision."
      />
      <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-slate-600">The product management screen is ready for the backend CRUD integration.</p>
      </div>
    </div>
  )
}

export default ProductManagement
