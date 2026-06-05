type IconProps = { size?: number; className?: string };
const d = (size = 16, cls = '') => ({ width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, className: cls });

export function ZapIcon({ size = 16, className = '' }: IconProps) {
  return <svg {...d(size, className)}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
}
export function BellIcon({ size = 16, className = '' }: IconProps) {
  return <svg {...d(size, className)}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
}
export function ClockIcon({ size = 16, className = '' }: IconProps) {
  return <svg {...d(size, className)}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}
export function BarChartIcon({ size = 16, className = '' }: IconProps) {
  return <svg {...d(size, className)}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>;
}
export function TrendingUpIcon({ size = 16, className = '' }: IconProps) {
  return <svg {...d(size, className)}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
}
export function LightbulbIcon({ size = 16, className = '' }: IconProps) {
  return <svg {...d(size, className)}><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>;
}
export function CheckCircleIcon({ size = 16, className = '' }: IconProps) {
  return <svg {...d(size, className)}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
}
export function TargetIcon({ size = 16, className = '' }: IconProps) {
  return <svg {...d(size, className)}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
}
export function MailIcon({ size = 16, className = '' }: IconProps) {
  return <svg {...d(size, className)}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
}
export function LinkIcon({ size = 16, className = '' }: IconProps) {
  return <svg {...d(size, className)}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
}
export function MessageIcon({ size = 16, className = '' }: IconProps) {
  return <svg {...d(size, className)}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
}
export function GlobeIcon({ size = 16, className = '' }: IconProps) {
  return <svg {...d(size, className)}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
}
export function MapPinIcon({ size = 16, className = '' }: IconProps) {
  return <svg {...d(size, className)}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
}
export function DollarIcon({ size = 16, className = '' }: IconProps) {
  return <svg {...d(size, className)}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
}
export function HeartIcon({ size = 16, className = '' }: IconProps) {
  return <svg {...d(size, className)}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
}
export function EditIcon({ size = 16, className = '' }: IconProps) {
  return <svg {...d(size, className)}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
}
export function ClipboardIcon({ size = 16, className = '' }: IconProps) {
  return <svg {...d(size, className)}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>;
}
export function SearchIcon({ size = 16, className = '' }: IconProps) {
  return <svg {...d(size, className)}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
}
export function BriefcaseIcon({ size = 16, className = '' }: IconProps) {
  return <svg {...d(size, className)}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="12"/></svg>;
}
export function AddIcon({ size = 16, className = '' }: IconProps) {
  return <svg {...d(size, className)}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
}
export function NewsFileIcon({ size = 16, className = '' }: IconProps) {
  return <svg {...d(size, className)}><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2z"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6z"/></svg>;
}
export function UserIcon({ size = 16, className = '' }: IconProps) {
  return <svg {...d(size, className)}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}
export function SunIcon({ size = 16, className = '' }: IconProps) {
  return <svg {...d(size, className)}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
}
export function MoonIcon({ size = 16, className = '' }: IconProps) {
  return <svg {...d(size, className)}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
}
