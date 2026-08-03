import styles from './Form.module.css'

const Form = ({ children, ...rest }) => (
  <form className={styles.form} {...rest}>{children}</form>
)

export default Form
