// One small component for every icon in the app.
//
// Each icon is a single SVG path drawn on a 24x24 grid. Keeping the paths in
// one object means a component only writes <Icon name="sun" /> and we avoid
// installing an icon library for a dozen icons.
// The icon takes the text colour of its parent (stroke="currentColor"),
// so it is coloured with normal Tailwind text classes.

const paths = {
  pencil: 'M4 20l4-1L19 8l-3-3L5 16l-1 4z',
  sofa: 'M5 11V8a2 2 0 012-2h10a2 2 0 012 2v3M3 12a2 2 0 014 0v3h10v-3a2 2 0 014 0v5H3v-5zM6 17v2M18 17v2',
  cube: 'M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zM12 12l8-4.5M12 12v9M12 12L4 7.5',
  sync: 'M4 12a8 8 0 0114-5l2 2M20 5v4h-4M20 12a8 8 0 01-14 5l-2-2M4 19v-4h4',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  drop: 'M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z',
  sun: 'M12 8a4 4 0 100 8 4 4 0 000-8zM12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19',
  share: 'M12 15V4M8 8l4-4 4 4M5 13v6h14v-6',
  download: 'M12 4v11M8 11l4 4 4-4M5 19h14',
  check: 'M5 12l4 4 10-10',
  play: 'M8 5v14l11-7z',
  arrow: 'M5 12h14M13 6l6 6-6 6',

  // editor workspace
  chevronLeft: 'M15 6l-6 6 6 6',
  chevronRight: 'M9 6l6 6-6 6',
  chevronDown: 'M6 9l6 6 6-6',
  undo: 'M9 14L4 9l5-5M4 9h10a6 6 0 010 12h-3',
  redo: 'M15 14l5-5-5-5M20 9H10a6 6 0 000 12h3',
  moon: 'M20 14a8 8 0 01-10-10 8 8 0 1010 10z',
  cloud: 'M7 18a4 4 0 010-8 5 5 0 019.6-1.5A4.5 4.5 0 0117 18H7z',
  home: 'M3 11l9-7 9 7M5 10v9h14v-9',
  minus: 'M5 12h14',
  plus: 'M12 5v14M5 12h14',
  fit: 'M4 9V5h4M20 9V5h-4M4 15v4h4M20 15v4h-4',
  compass: 'M12 7a2 2 0 100-4 2 2 0 000 4zM11 7L6 20M13 7l5 13',
  wall: 'M3 6h18v12H3zM3 12h18M9 6v6M15 12v6',
  door: 'M6 21V3h12v18M4 21h16M14 12v1',
  window: 'M4 4h16v16H4zM12 4v16M4 12h16',
}

const Icon = ({ name, className = 'h-5 w-5' }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[name]} />
    </svg>
  )
}

export default Icon
