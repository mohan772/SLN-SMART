import { createContext, useContext, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const ToastContext = createContext(null)

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const createToast = (message, type = 'success') => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 3500)
  }

  const value = useMemo(() => ({ createToast }), [])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-24 z-50 flex flex-col gap-3 sm:right-6">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.25 }}
              className={`rounded-3xl border px-5 py-4 shadow-2xl backdrop-blur-xl text-sm font-medium text-white ${
                toast.type === 'success'
                  ? 'bg-emerald-500/95 border-emerald-400/40'
                  : 'bg-rose-500/95 border-rose-400/40'
              }`}
            >
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
