import { useId } from 'react'
import styles from './FormField.module.css'

type FormFieldProps = {
  label: string,
  error?: string | null
} & React.InputHTMLAttributes<HTMLInputElement>

const FormField = ({ label, error, ...rest }: FormFieldProps) => {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div className={styles.field}>
      <div className={styles.control}>
        <label htmlFor={id} className="label-14">{label}</label>
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`label-16 ${styles.input}`}
          {...rest}
        />
      </div>
      {error && <p id={errorId} className="label-14 text-danger">{error}</p>}
    </div>
  )
}

export default FormField
