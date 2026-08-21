import styles from './Fieldset.module.css'

type FieldsetProps = React.FieldsetHTMLAttributes<HTMLFieldSetElement>

const Fieldset = ({ children, ...rest }: FieldsetProps) => (
  <fieldset className={styles.fieldset} {...rest}>{children}</fieldset>
)

export default Fieldset
