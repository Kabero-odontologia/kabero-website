#!/bin/sh
# Render's Web Service filesystem is ephemeral except for the persistent disk
# mounted at $RENDER_DISK_PATH — everything else (including public/uploads as
# checked into git) is rebuilt fresh on every deploy. This script runs once at
# container start (before `next start`) to:
#   1. Move the SQLite database onto the persistent disk so it survives
#      restarts/redeploys, then apply any pending migrations.
#   2. Seed the persistent disk with the repo's checked-in photos on the very
#      first boot only (so a later redeploy never overwrites uploads added
#      after that). Uploaded files are served by app/uploads/[filename]/
#      instead of Next's `public/` static serving — that only picks up
#      whatever existed at build time, so a real admin upload (added while
#      the server is already running) would otherwise 404 forever.
#   3. Kick every statically-generated public page into regenerating itself
#      once the server is actually up — `next build` ran against an empty
#      database (the disk isn't mounted during the build step), so without
#      this every deploy would otherwise show an empty site for up to an
#      hour until the page's own ISR interval happens to expire.
set -e

DISK_PATH="${RENDER_DISK_PATH:-/var/data}"
mkdir -p "$DISK_PATH/uploads"

if [ -z "$(ls -A "$DISK_PATH/uploads" 2>/dev/null)" ]; then
  cp -a public/uploads/. "$DISK_PATH/uploads/"
fi

npx prisma migrate deploy

npm run start &
SERVER_PID=$!

node -e "
const port = process.env.PORT || 3000;
const secret = process.env.SESSION_SECRET;
(async () => {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch('http://localhost:' + port + '/');
      if (res.status < 500) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 1000));
  }
  try {
    const res = await fetch('http://localhost:' + port + '/api/admin/revalidate-all', {
      method: 'POST',
      headers: { 'x-internal-secret': secret },
    });
    console.log('post-deploy revalidate-all:', res.status);
  } catch (e) {
    console.error('post-deploy revalidate-all failed:', e.message);
  }
})();
" &

wait "$SERVER_PID"
