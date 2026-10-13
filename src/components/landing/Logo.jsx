// The RoomCraft3D logo: a small floor plan mark next to the name.
// It is its own component because the navbar and the footer both show it.

const Logo = () => {
  return (
    <a href="#top" className="flex items-center gap-2 text-lg font-bold text-white">
      {/* an outer wall with one inner wall */}
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="5" width="18" height="14" rx="1" />
        <path d="M12 5v8M3 13h5" />
      </svg>
      RoomCraft3D
    </a>
  )
}

export default Logo
