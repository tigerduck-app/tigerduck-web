interface TestFlightCTAProps {
  className?: string;
}

export default function TestFlightCTA({ className = "" }: TestFlightCTAProps) {
  return (
    <a
      href="https://testflight.apple.com/join/eVt9Gjkw"
      target="_blank"
      rel="noopener noreferrer"
      data-testid="ios-beta-cta"
      className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-brand-tiger)] text-white font-semibold hover:opacity-90 transition-opacity ${className}`}
    >
      🍎 加入 iOS 內測
    </a>
  );
}
