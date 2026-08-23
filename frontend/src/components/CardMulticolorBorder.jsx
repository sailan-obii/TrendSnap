import { getCardBorderStyle } from '../utils/cardBorderStyle'

export function CardMulticolorBorder({
  seed,
  className = '',
  innerClassName = '',
  innerStyle,
  style,
  children,
}) {
  return (
    <div
      className={`card-multicolor-border ${className}`.trim()}
      style={{ ...getCardBorderStyle(seed), ...style }}
    >
      <div className={`card-multicolor-border__inner ${innerClassName}`.trim()} style={innerStyle}>
        {children}
      </div>
    </div>
  )
}
