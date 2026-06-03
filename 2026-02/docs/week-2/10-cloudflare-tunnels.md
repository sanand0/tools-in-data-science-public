id: cloudflare-tunnels
# CloudFlare Tunnels

CloudFlare Tunnels (`cloudflared`) create a secure, encrypted tunnel from your localhost to CloudFlare's global network — giving your local development server a public HTTPS URL instantly.

**Use cases:**
- Share your local API with teammates for testing
- Test OAuth callbacks (Google requires HTTPS)
- Demo an app to a client without deploying
- Connect to a webhook that needs a public URL

---

## Installation

```bash
# macOS
brew install cloudflare/cloudflare/cloudflared

# Linux
curl -L --output cloudflared.deb \
  https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb

# Windows (winget)
winget install --id Cloudflare.cloudflared
```

---

## Quick Start (No Account Needed)

```bash
# Start your FastAPI app
uvicorn main:app --reload --port 8000

# In another terminal — create a tunnel
cloudflared tunnel --url http://localhost:8000
```

Output:
```
Your quick Tunnel has been created! Visit it at:
https://example-random-name.trycloudflare.com
```

That URL is publicly accessible, HTTPS, no account needed. **Temporary** — lasts as long as the process runs.

---

## Named Tunnels (Persistent URL)

For a stable URL that survives restarts:

```bash
# 1. Login
cloudflared tunnel login

# 2. Create a named tunnel
cloudflared tunnel create tds-api

# 3. Route a domain to it (requires a domain on CloudFlare)
cloudflared tunnel route dns tds-api api.yourdomain.com

# 4. Create config
cat > ~/.cloudflared/config.yml << EOF
tunnel: tds-api
credentials-file: ~/.cloudflared/<tunnel-id>.json

ingress:
  - hostname: api.yourdomain.com
    service: http://localhost:8000
  - service: http_status:404
EOF

# 5. Run it
cloudflared tunnel run tds-api
```

---

## Run as a System Service

```bash
# Install as a service (runs on boot)
sudo cloudflared service install

# Start
sudo systemctl start cloudflared

# Check status
sudo systemctl status cloudflared
```

---

## OAuth with CloudFlare Tunnels

Google OAuth requires HTTPS redirect URIs. With a tunnel:

1. Get your tunnel URL (e.g., `https://abc123.trycloudflare.com`)
2. Add to Google Console: `https://abc123.trycloudflare.com/auth/callback`
3. Update your `.env`:
   ```
   REDIRECT_URI=https://abc123.trycloudflare.com/auth/callback
   ```
4. Now OAuth works locally!

---

## Summary

| Mode | URL | Persistent? | Requires Account? |
|------|-----|-------------|-------------------|
| Quick tunnel | `*.trycloudflare.com` | ❌ | ❌ |
| Named tunnel | Your domain | ✅ | ✅ |
| Service | Your domain | ✅ (on boot) | ✅ |

---

