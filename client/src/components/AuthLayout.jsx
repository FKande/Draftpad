import styles from './AuthLayout.module.css'

const AuthLayout = ({ children }) => (
  <div className={styles.page}>
    <main className={styles.card}>{children}</main>
  </div>
)

export default AuthLayout
