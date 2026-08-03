import styles from './AuthLayout.module.css'
import Wordmark from './Wordmark'
import { Link } from 'react-router-dom'

const AuthLayout = ({ children }) => (
  <div className={styles.page}>
    <header>
      <Link to="/" className="link-plain">
        <Wordmark size={24} />
      </Link>
    </header>
    <div className={styles.center}>
      <main className={styles.card}>{children}</main>
    </div>
  </div>
)

export default AuthLayout
