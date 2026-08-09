import styles from './DialogFooter.module.css'

const DialogFooter = ({ children, ...rest }) => {
  return (
    <div className={styles.footer} {...rest}>
      {children}
    </div>
  )
}

export default DialogFooter
