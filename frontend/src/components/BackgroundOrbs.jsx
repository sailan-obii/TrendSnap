const ORBS = [
  {
    id: 'red-right',
    left: '81.56%',
    top: '33.16%',
    size: '13.02vw',
    color: 'rgb(226, 0, 0, 0.4)',
    orbit: 'near',
    dir: 'cw',
    duration: '12s',
    delay: '-4s',
    blur: '2.6vw',
  },
  {
    id: 'blue-right',
    left: '74.8%',
    top: '45.13%',
    size: '10.42vw',
    color: 'rgb(92 252 235 / 0.4)',
    orbit: 'far',
    dir: 'ccw',
    duration: '19s',
    delay: '-11s',
    blur: '2.2vw',
  },
  {
    id: 'peach-left',
    left: '14.98%',
    top: '60.45%',
    size: '10.42vw',
    color: 'rgb(255 198 163 / 0.3)',
    orbit: 'near',
    dir: 'ccw',
    duration: '15s',
    delay: '-7s',
    blur: '2.2vw',
  },
  {
    id: 'purple-left',
    left: '21.24%',
    top: '75.18%',
    size: '7.81vw',
    color: 'rgb(187 107 240 / 0.25)',
    orbit: 'far',
    dir: 'cw',
    duration: '11s',
    delay: '-18s',
    blur: '2vw',
  },
  {
    id: 'pink-left',
    left: '25.76%',
    top: '72.42%',
    size: '11.46vw',
    color: 'rgb(225 102 182 / 0.32)',
    orbit: 'near',
    dir: 'cw',
    duration: '15s',
    delay: '-2s',
    blur: '2.4vw',
  },
]

/**
 * Pastilles de bg-rond.svg en calque fixe, en orbite autour de leur position.
 */
export function BackgroundOrbs() {
  return (
    <div className="app-orbs" aria-hidden="true">
      {ORBS.map((orb) => (
        <div
          key={orb.id}
          className={`app-orb app-orb--${orb.orbit} app-orb--${orb.dir}`}
          style={{
            '--orb-left': orb.left,
            '--orb-top': orb.top,
            '--orb-size': orb.size,
            '--orb-color': orb.color,
            '--orb-duration': orb.duration,
            '--orb-delay': orb.delay,
            '--orb-blur': orb.blur,
          }}
        >
          <span className="app-orb__blob" />
        </div>
      ))}
    </div>
  )
}
