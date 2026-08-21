/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'
import ToastList from './ToastList'

export interface Toast {
  id: string
  message: string
}

interface ToastContextValue {
  toasts: Toast[]
  addToast: (message: string) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [ toasts, setToasts ] = useState<Toast[]>([])


  const addToast = (message: string) => {
    const id = crypto.randomUUID()
    const newToast = ({ id, message })
    setToasts((prev) => [...prev, newToast])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ addToast, toasts, removeToast }}>
      {children}
      <ToastList />
    </ToastContext.Provider>
  )

}


export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within a ToastProvider')
  return context
}
