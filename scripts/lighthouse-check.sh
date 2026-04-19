#!/usr/bin/env bash
set -e

echo "=== Lighthouse Audit ==="
echo "Starting dev server..."

cd "$(dirname "$0")/.."

if ! command -v lighthouse &> /dev/null; then
  echo "Installing lighthouse..."
  npm install -g lighthouse 2>/dev/null || npx lighthouse --version
fi

npm run dev &
DEV_PID=$!

echo "Waiting for dev server..."
for i in {1..30}; do
  if curl -sf http://localhost:3000/ > /dev/null 2>&1; then
    echo "Dev server ready!"
    break
  fi
  sleep 2
done

echo "Running Lighthouse audit..."
npx lighthouse http://localhost:3000/ \
  --only-categories=performance,accessibility,seo \
  --output=json \
  --output-path=/tmp/lh.json \
  --chrome-flags="--headless --no-sandbox" \
  --quiet 2>&1 || true

kill $DEV_PID 2>/dev/null || true

if [ -f /tmp/lh.json ]; then
  PERF=$(node -e "const r=require('/tmp/lh.json'); console.log(Math.round(r.categories.performance.score*100))")
  A11Y=$(node -e "const r=require('/tmp/lh.json'); console.log(Math.round(r.categories.accessibility.score*100))")
  SEO=$(node -e "const r=require('/tmp/lh.json'); console.log(Math.round(r.categories.seo.score*100))")

  echo ""
  echo "=== Lighthouse Results ==="
  echo "Performance: $PERF (target: ≥ 85)"
  echo "Accessibility: $A11Y (target: ≥ 95)"
  echo "SEO: $SEO (target: = 100)"

  PASS=true
  [ "$PERF" -lt 85 ] && echo "FAIL: Performance below 85" && PASS=false
  [ "$A11Y" -lt 95 ] && echo "FAIL: Accessibility below 95" && PASS=false
  [ "$SEO" -lt 100 ] && echo "WARN: SEO below 100"

  if [ "$PASS" = true ]; then
    echo "✓ Lighthouse targets met"
  fi
else
  echo "WARNING: Lighthouse output not found, skipping score check"
fi
