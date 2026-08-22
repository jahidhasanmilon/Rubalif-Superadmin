"use client";

type IconProps = { className?: string };

const base = "none";

export function IconChartBar({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill={base} stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 20V10M12 20V4M20 20v-7" />
    </svg>
  );
}

export function IconClock({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill={base} stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function IconCheckCircle({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill={base} stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12.3l2.4 2.4 4.6-5" />
    </svg>
  );
}

export function IconPlus({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill={base} stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconSettings({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill={base} stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 13.5a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.56V19.5a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.04-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.04H4.5a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.56-1.04 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h0A1.7 1.7 0 0 0 11.56 3H11.5a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1.04 1.56h0a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v0a1.7 1.7 0 0 0 1.56 1.04h.1a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.56 1.04z" />
    </svg>
  );
}

export function IconLogOut({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill={base} stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}

export function IconSun({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill={base} stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2.5v2M12 19.5v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2.5 12h2M19.5 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

export function IconMoon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill={base} stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
    </svg>
  );
}

export function IconMenu({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill={base} stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function IconChevronLeft({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill={base} stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

export function IconZap({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill={base} stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
    </svg>
  );
}

export function IconCalendar({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill={base} stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3.5" y="5" width="17" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
    </svg>
  );
}

export function IconPencil({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill={base} stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
}

export function IconTrash({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill={base} stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 7h16M9 7V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V7M18 7l-.8 12.1A2 2 0 0 1 15.2 21H8.8a2 2 0 0 1-2-1.9L6 7" />
    </svg>
  );
}

export function IconX({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill={base} stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function IconCheck({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill={base} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function IconSearch({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill={base} stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
