interface ShipIconProps {
  mirrored?: boolean;
}

export function ShipIcon({ mirrored }: ShipIconProps) {
  return (
    <svg
      width="20"
      height="16"
      viewBox="0 0 20 16"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      style={mirrored ? { transform: 'scaleX(-1)' } : undefined}
    >
      <line x1="9" y1="1" x2="9" y2="10" strokeWidth="1.5" />
      <path d="M9 1 L16 9 L9 9 Z" fill="currentColor" stroke="none" />
      <path d="M3 10 Q9 14 15 10" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
