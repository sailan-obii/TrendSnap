import { getCardTemplate } from '../templates/cardTemplates'
import { RankNumber } from '../templates/RankNumber'
import { CardMulticolorBorder } from './CardMulticolorBorder'

export function MovieCard({ movie, number, template = 'cinema', cardWidth, onSelect }) {
  const { config, CardInfo } = getCardTemplate(template)
  const width = cardWidth ?? config.cardWidth
  const aspectClass = config.posterAspect === '16/9' ? 'aspect-video' : 'aspect-[2/3]'
  const showNumber = config.showNumber && number != null
  const rankInsetClass = showNumber
    ? (String(number).length > 1 ? 'md:ml-[2.75rem]' : 'md:ml-8')
    : ''

  const handleSelect = (event) => {
    if (event.button !== 0) return
    event.preventDefault()
    onSelect?.(movie, template)
  }

  const handleContextMenu = (event) => {
    event.preventDefault()
    event.stopPropagation()
  }

  return (
    <div className="relative overflow-visible" style={{ width: `${width}px` }}>
      {showNumber && (
        <RankNumber
          number={number}
          variant={config.rankNumberVariant}
          size={config.numberSize}
          className="hidden md:flex"
        />
      )}
      <CardMulticolorBorder
        seed={`${movie.title}-${template}`}
        className={`z-10 md:hover:scale-105 transition-transform duration-300 ${rankInsetClass}`}
        innerClassName="bg-zinc-900"
      >
        <div
          className="relative cursor-pointer"
          onClick={handleSelect}
          onContextMenu={handleContextMenu}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              onSelect?.(movie, template)
            }
          }}
        >
          {showNumber && (
            <RankNumber
              number={number}
              variant={config.rankNumberVariant}
              placement="overlay"
              className="md:hidden"
            />
          )}
          <img
            src={movie.poster}
            alt={movie.title}
            draggable={false}
            className={`w-full ${aspectClass} object-cover select-none`}
          />
          <CardInfo movie={movie} />
        </div>
      </CardMulticolorBorder>
    </div>
  )
}
