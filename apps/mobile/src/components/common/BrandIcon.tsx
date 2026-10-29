import Svg, {
  Rect,
  Line,
  Path,
  Circle,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import type { BrandIconProps } from '../../types/components';

export function BrandIcon({ size = 32 }: BrandIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Defs>
        <LinearGradient id="mIconBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#0e2a22" />
          <Stop offset="50%" stopColor="#071b15" />
          <Stop offset="100%" stopColor="#040f0c" />
        </LinearGradient>
        <LinearGradient id="mPitchStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#bef264" />
          <Stop offset="100%" stopColor="#10b981" />
        </LinearGradient>
        <LinearGradient id="mBallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#facc15" />
          <Stop offset="40%" stopColor="#a3e635" />
          <Stop offset="100%" stopColor="#10b981" />
        </LinearGradient>
      </Defs>

      {/* Rounded Stadium Shield Background */}
      <Rect
        x="4"
        y="4"
        width="92"
        height="92"
        rx="26"
        fill="url(#mIconBg)"
        stroke="url(#mPitchStroke)"
        strokeWidth="3.5"
      />

      {/* Outer Court Pitch Boundary */}
      <Rect
        x="16"
        y="20"
        width="68"
        height="60"
        rx="12"
        stroke="#a3e635"
        strokeWidth="3"
        strokeOpacity={0.9}
      />

      {/* Pitch Halfway Line */}
      <Line
        x1="50"
        y1="20"
        x2="50"
        y2="80"
        stroke="#a3e635"
        strokeWidth="2.5"
        strokeOpacity={0.8}
      />

      {/* Goal Areas */}
      <Path
        d="M 16 34 H 28 V 66 H 16"
        stroke="#4ade80"
        strokeWidth="2.5"
        strokeOpacity={0.75}
      />
      <Path
        d="M 84 34 H 72 V 66 H 84"
        stroke="#4ade80"
        strokeWidth="2.5"
        strokeOpacity={0.75}
      />

      {/* Center Circle */}
      <Circle
        cx="50"
        cy="50"
        r="14"
        stroke="#a3e635"
        strokeWidth="2.5"
        strokeOpacity={0.9}
      />

      {/* Glowing Kinetic Sports Ball at Center */}
      <Circle cx="50" cy="50" r="7.5" fill="url(#mBallGrad)" />
      <Circle cx="48" cy="48" r="2.2" fill="#ffffff" fillOpacity={0.9} />
    </Svg>
  );
}
