import { useToast } from "./ToastProvider";
import styles from './ToastList.module.css'
import Button from "./Button";
import { X } from 'lucide-react'


const ToastList = () => {

  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className={styles.list}>
      {toasts.map((toast) => (
        <div key={toast.id} className={styles.toast}>
          <span className={`label-14 ${styles.message}`}>
            {toast.message}
          </span>
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            iconLeft={<X/>}
            aria-label="Dismiss"
            onClick={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  )

}

export default ToastList
