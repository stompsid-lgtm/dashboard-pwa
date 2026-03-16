#!/bin/bash
# dashboard-pwa deploy：commit + push + CF Pages deploy
cd "$(dirname "$0")"
git add -A && git commit -m "${1:-chore: update}" && git push
npx wrangler pages deploy . --project-name=dashboard-pwa --commit-dirty=true
