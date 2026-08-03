import styles from './Fieldset.module.css'

const Fieldset = ({ children, ...rest }) => (
  <fieldset className={styles.fieldset} {...rest}>{children}</fieldset>
)

export default Fieldset
