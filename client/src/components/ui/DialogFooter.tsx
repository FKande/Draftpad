import styles from './DialogFooter.module.css'

type DialogFooterProps = React.HTMLAttributes<HTMLDivElement>

const DialogFooter = ({ children, ...rest }: DialogFooterProps) => {
  return (
    <div className={styles.footer} {...rest}>
      {children}
    </div>
  )
}

export default DialogFooter
