/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'
import ToastList from './ToastList'

const ToastContext = createContext(null)

export const ToastProvider = ({ children }) => {
  const [ toasts, setToasts ] = useState([])


  const addToast = (message) => {
    let id = crypto.randomUUID()
    const newToast = ({ id, message })
    setToasts((prev) => [...prev, newToast])
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ addToast, toasts, removeToast }}>
      {children}
      <ToastList />
    </ToastContext.Provider>
  )

}


export const useToast = () => useContext(ToastContext)

