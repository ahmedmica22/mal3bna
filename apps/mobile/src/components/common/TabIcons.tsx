import Svg, { Circle, Path, Rect } from 'react-native-svg';

export interface TabIconProps {
  color?: string;
  size?: number;
}

export function ExploreTabIcon({ color = '#10b981', size = 22 }: TabIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <Path d="M16.5 16.5L21 21" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </Svg>
  );
}

export function BookingsTabIcon({ color = '#10b981', size = 22 }: TabIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3.5" y="4.5" width="17" height="16" rx="3" stroke={color} strokeWidth="2.2" />
      <Path d="M3.5 9.5H20.5" stroke={color} strokeWidth="2" />
      <Path d="M8 2.5V5.5" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <Path d="M16 2.5V5.5" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <Circle cx="8" cy="14" r="1.2" fill={color} />
      <Circle cx="12" cy="14" r="1.2" fill={color} />
      <Circle cx="16" cy="14" r="1.2" fill={color} />
    </Svg>
  );
}

export function ProfileTabIcon({ color = '#10b981', size = 22 }: TabIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="7.5" r="4.2" stroke={color} strokeWidth="2.2" />
      <Path
        d="M4.5 20.5C4.5 16.91 7.86 14 12 14C16.14 14 19.5 16.91 19.5 20.5"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function InboxTabIcon({ color = '#10b981', size = 22 }: TabIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="5.5" width="18" height="13.5" rx="2.5" stroke={color} strokeWidth="2.2" />
      <Path
        d="M3.5 7.5L12 13.5L20.5 7.5"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function SignOutIcon({ color = '#f87171', size = 18 }: TabIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16 17L21 12L16 7"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21 12H9"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
