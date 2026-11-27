// The small picture that pops up next to a furniture row while the mouse is
// over it, so the user can see what a piece looks like before placing it.
//
// The pictures are ready-made images in public/thumbnails, one per item,
// made by `npm run thumbnails` (see tools/saveThumbnails.js).
//
// The card is position: fixed, placed from the row's position on screen.
// It cannot be absolute inside the sidebar, because the sidebar scrolls and
// would cut off anything that sticks out past its right edge.

import { useState } from 'react'

const CARD_HEIGHT = 240 // about the card's real height, to keep it on screen

const FurniturePreview = ({ item, row }) => {
  // an item whose picture is missing shows no card instead of a broken image
  const [failed, setFailed] = useState(false)
  if (failed) return null

  // next to the row, level with its middle, but never past the bottom or top
  const top = Math.min(
    Math.max(row.top + row.height / 2 - CARD_HEIGHT / 2, 8),
    window.innerHeight - CARD_HEIGHT - 8
  )

  return (
    // pointer-events-none: the card must never take the hover away from the row
    <div
      style={{ top, left: row.right + 12 }}
      className="pointer-events-none fixed z-50 w-48 rounded-lg border border-slate-700 bg-slate-900 p-2 shadow-2xl"
    >
      {/* a light background, so dark pieces like the black sofa stay visible */}
      <div className="rounded-md bg-gradient-to-b from-slate-100 to-slate-300 p-2">
        <img
          src={`/thumbnails/${item.id}.webp`}
          alt={item.name}
          width={160}
          height={160}
          onError={() => setFailed(true)}
          className="mx-auto h-40 w-40 object-contain"
        />
      </div>
      <p className="mt-2 truncate text-sm text-slate-200">{item.name}</p>
      <p className="font-mono text-xs text-slate-500">
        {item.width} × {item.depth} × {item.height} m
      </p>
    </div>
  )
}

export default FurniturePreview
