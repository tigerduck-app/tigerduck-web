interface DiscordCTAProps {
  className?: string;
}

export default function DiscordCTA({ className = "" }: DiscordCTAProps) {
  return (
    <a
      href="https://tigerduck.app/discord"
      target="_blank"
      rel="noopener noreferrer"
      data-testid="android-beta-cta"
      className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-accent-blue)] text-white font-semibold hover:opacity-90 transition-opacity ${className}`}
    >
      🤖 加入 Android 內測
    </a>
  );
}
