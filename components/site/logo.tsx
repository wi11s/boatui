// The Quiet Scenes mark: a little sailboat on a wave. Keep in sync with app/icon.svg (the favicon).
export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#1f5f80" />
      <circle cx="24.5" cy="8.5" r="2.6" fill="#ffd98a" />
      <path d="M15 6.5 V19 H8.5 Z" fill="#ffffff" />
      <path d="M16.6 9.5 V19 H21.5 Z" fill="#cfe8f3" />
      <path d="M6.5 20.5 H25.5 Q24 25 19.5 25 H12.5 Q8 25 6.5 20.5 Z" fill="#f07a5f" />
      <path d="M3.5 27.5 q3 -2 6 0 t6 0 t6 0 t6 0" fill="none" stroke="#7cc4e0" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
