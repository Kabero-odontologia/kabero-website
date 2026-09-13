#!/bin/sh
# Render's Web Service filesystem is ephemeral except for the persistent disk
# mounted at $RENDER_DISK_PATH — everything else (including public/uploads as
# checked into git) is rebuilt fresh on every deploy. This script runs once at
# container start (before `next start`) to:
#   1. Move the SQLite database onto the persistent disk so it survives
#      restarts/redeploys, then apply any pending migrations.
#   2. Redirect new admin uploads onto the persistent disk too, seeding it
#      from the repo's checked-in photos on the very first boot only (so a
#      later redeploy never overwrites uploads added after that).
set -e

DISK_PATH="${RENDER_DISK_PATH:-/var/data}"
mkdir -p "$DISK_PATH/uploads"

if [ -z "$(ls -A "$DISK_PATH/uploads" 2>/dev/null)" ]; then
  cp -a public/uploads/. "$DISK_PATH/uploads/"
fi
rm -rf public/uploads
ln -s "$DISK_PATH/uploads" public/uploads

npx prisma migrate deploy
exec npm run start
