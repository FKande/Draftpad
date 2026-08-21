import styles from './Form.module.css'

type FormProps = React.FormHTMLAttributes<HTMLFormElement>

const Form = ({ children, ...rest }: FormProps) => (
  <form className={styles.form} {...rest}>{children}</form>
)

export default Form
