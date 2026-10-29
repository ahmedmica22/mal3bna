import type { BrandIconProps } from '../../types/ui';

export function BrandIcon({ size = 36, className = '' }: BrandIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="webIconBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0e2a22" />
          <stop offset="50%" stopColor="#071b15" />
          <stop offset="100%" stopColor="#040f0c" />
        </linearGradient>
        <linearGradient id="webPitchStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#bef264" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        <linearGradient id="webBallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#facc15" />
          <stop offset="40%" stopColor="#a3e635" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>

      {/* Rounded Stadium Shield Background */}
      <rect
        x="4"
        y="4"
        width="92"
        height="92"
        rx="26"
        fill="url(#webIconBg)"
        stroke="url(#webPitchStroke)"
        strokeWidth="3.5"
      />

      {/* Outer Court Pitch Boundary */}
      <rect
        x="16"
        y="20"
        width="68"
        height="60"
        rx="12"
        stroke="#a3e635"
        strokeWidth="3"
        strokeOpacity="0.9"
      />

      {/* Pitch Halfway Line */}
      <line
        x1="50"
        y1="20"
        x2="50"
        y2="80"
        stroke="#a3e635"
        strokeWidth="2.5"
        strokeOpacity="0.8"
      />

      {/* Goal Areas */}
      <path
        d="M 16 34 H 28 V 66 H 16"
        stroke="#4ade80"
        strokeWidth="2.5"
        strokeOpacity="0.75"
      />
      <path
        d="M 84 34 H 72 V 66 H 84"
        stroke="#4ade80"
        strokeWidth="2.5"
        strokeOpacity="0.75"
      />

      {/* Center Circle */}
      <circle
        cx="50"
        cy="50"
        r="14"
        stroke="#a3e635"
        strokeWidth="2.5"
        strokeOpacity="0.9"
      />

      {/* Glowing Kinetic Sports Ball at Center */}
      <circle cx="50" cy="50" r="7.5" fill="url(#webBallGrad)" />
      <circle cx="48" cy="48" r="2.2" fill="#ffffff" fillOpacity="0.9" />
    </svg>
  );
}
