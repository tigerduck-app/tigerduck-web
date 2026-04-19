export default function HeroFallback() {
  return (
    <div
      data-testid="hero-fallback"
      className="w-full h-full flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #F05138 0%, #4a90d9 100%)" }}
    >
      <div className="text-center text-white">
        <div className="text-8xl mb-4">🐯🦆</div>
        <p className="text-xl opacity-80">TigerDuck</p>
      </div>
    </div>
  );
}
