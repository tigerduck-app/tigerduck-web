interface M3CardProps {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
}

export default function M3Card({ children, className = "", elevated = false }: M3CardProps) {
  return (
    <div
      data-m3-card
      className={`rounded-2xl p-4 transition-all duration-200 ${
        elevated
          ? "bg-[var(--color-surface)] shadow-lg hover:shadow-xl"
          : "bg-[var(--color-surface)] border border-[var(--color-border)]"
      } ${className}`}
    >
      {children}
    </div>
  );
}
