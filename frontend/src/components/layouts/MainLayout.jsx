import { Outlet } from 'react-router-dom'
import NavBar from '../navbar/NavBar'
import Footer from '../footer/Footer'

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#eef7e8,_#f8f2e6_35%,_#ffffff)] text-slate-900">
      <NavBar />
      <main className="mx-auto w-full max-w-7xl px-5 pb-16 pt-24 sm:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
