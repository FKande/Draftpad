import styles from './Button.module.css'

// size picks a global text style, since a text style is a bundle
// and shouldn't be re-declared inside a module
const textStyles = {
  sm: 'button-12',
  md: 'button-14',
  lg: 'button-16',
}

const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  iconLeft,
  iconRight,
  iconOnly,
  children,
  className,
  ...rest
}) => {
  const classNames = [
    textStyles[size],
    styles.base,
    styles[variant],
    styles[size],
    className,
    fullWidth && styles.fullWidth,
    iconOnly && styles.iconOnly
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classNames} disabled={disabled || loading} {...rest}>
      {loading ? (
        <span className={styles.spinner} />
      ) : (
        iconLeft && <span className={styles.icon}>{iconLeft}</span>
      )}
      {children}
      {iconRight && <span className={styles.icon}>{iconRight}</span>}
    </button>
  )
}

export default Button
