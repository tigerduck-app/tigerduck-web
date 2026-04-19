interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function GlassCard({ children, className = "" }: GlassCardProps) {
  return (
    <div
      data-glass-card
      className={`backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 rounded-3xl shadow-xl ${className}`}
    >
      {children}
    </div>
  );
}
