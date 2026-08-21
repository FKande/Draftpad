type WordmarkProps = {
  size?: number
} & React.HTMLAttributes<HTMLSpanElement>

const Wordmark = ({ size = 20, ...rest }: WordmarkProps) => (
  <span className={`logo-${size}`} {...rest}>Draftpad</span>
)

export default Wordmark
