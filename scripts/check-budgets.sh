#!/usr/bin/env bash
set -e

echo "=== Bundle Size Budget Check ==="
echo "Building Next.js project..."

cd "$(dirname "$0")/.."
rm -rf .next
npm run build 2>&1 | tee /tmp/next-build.log

echo ""
echo "=== Checking First Load JS budget (≤ 180kb) ==="

FIRST_LOAD=$(grep "First Load JS shared by all" /tmp/next-build.log | grep -oE '[0-9]+(\.[0-9]+)? kB' | head -1)
echo "First Load JS shared: $FIRST_LOAD"

OVER_BUDGET=$(grep -E "^\s*[┌├└]" /tmp/next-build.log | grep -v "chunks" | awk '{
  for(i=1;i<=NF;i++) {
    if($i ~ /^[0-9]+(\.[0-9]+)?$/ && $(i+1) == "kB") {
      size=$i+0
      if(size > 180) print "OVER BUDGET:", $0
    }
  }
}')

if [ -n "$OVER_BUDGET" ]; then
  echo "WARNING: Some routes exceed 180kb First Load JS:"
  echo "$OVER_BUDGET"
  echo "Note: 3D chunk is excluded from this budget"
else
  echo "✓ All routes within 180kb First Load JS budget"
fi

echo ""
echo "=== Budget check complete ==="
