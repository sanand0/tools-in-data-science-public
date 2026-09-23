# VMs & SSH

> **Sometimes you just need a machine. Rent one, reach it safely with keys, and keep your work alive after you disconnect.**

⏱ ~9 min read · ~20 min hands-on
🔗 needs: [Bash Scripting](/2026-05/week-1/03-bash-scripting/) · [Deployment Platforms](/2026-05/week-2/07-deployment-platforms/)

Serverless covers most workloads, but some jobs want a persistent box: a long scrape, a GPU fine-tune, a database you control. That means a VM — and SSH is how you live on it.

## Try it in 5 minutes — keys, not passwords

Generate a modern key pair and copy the **public** half to the server:

```bash
ssh-keygen -t ed25519 -C "you@example.com"     # ed25519: short, fast, secure
ssh-copy-id user@203.0.113.10                  # installs the PUBLIC key
ssh user@203.0.113.10
```

✅ You're in, with no password. The private key (`~/.ssh/id_ed25519`) **never leaves your machine** — treat it like a password and give it a passphrase.

Make it pleasant with `~/.ssh/config`:

```
Host scraper
    HostName 203.0.113.10
    User ubuntu
    IdentityFile ~/.ssh/id_ed25519
    ServerAliveInterval 60
```

Now it's just `ssh scraper`.

## Harden the box before you use it

A fresh VM with a public IP starts getting password-guessing attempts within minutes. Three changes remove most of that risk — in `/etc/ssh/sshd_config`:

```
PasswordAuthentication no      # keys only
PermitRootLogin no             # no direct root
```

then `sudo systemctl restart ssh`. Plus a firewall:

```bash
sudo ufw allow OpenSSH && sudo ufw enable
```

> ⚠️ **Keep your current session open** while testing a new SSH config. If you lock yourself out with the only session closed, you need console access to recover.

## Work that survives disconnection

Close your laptop and a plain SSH job dies with the connection. Use a terminal multiplexer:

```bash
tmux new -s scrape      # start a named session
# run your long job…
# Ctrl-B then D          detach — the job keeps running
tmux attach -t scrape   # come back later, from anywhere
```

For a job that must restart on boot or after a crash, make it a **systemd** service instead:

```ini
# /etc/systemd/system/scraper.service
[Unit]
Description=Scheduled scraper
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/app
ExecStart=/home/ubuntu/.local/bin/uv run scraper.py
Restart=on-failure
RestartSec=30

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable --now scraper && journalctl -u scraper -f
```

## Moving files, and tunnelling

```bash
scp data.parquet scraper:/home/ubuntu/            # one file
rsync -avz --progress ./data/ scraper:~/data/     # resumable, only changed files
ssh -L 8080:localhost:8000 scraper                # local:8080 → the VM's port 8000
```

That last one is a **local port forward** — reach a service bound to the VM's localhost without exposing it publicly. It's the safe way to check an internal dashboard. ([Cloudflare Tunnels](/2026-05/week-2/10-cloudflare-tunnels/) solves the same problem without a public IP at all.)

## When it fails

| Symptom | Cause | Fix |
|---|---|---|
| `Permission denied (publickey)` | Key not installed, or wrong user | `ssh-copy-id`; check the image's default user |
| `WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED` | Server rebuilt, or a real MITM | Verify, then remove the old `known_hosts` entry |
| Locked out after editing sshd_config | Broke auth with no open session | Use the provider's web console; test before closing |
| Job dies when laptop sleeps | Ran in a bare SSH session | `tmux`, or a systemd service |
| Connection drops when idle | NAT/firewall timeout | `ServerAliveInterval 60` |
| Disk full mid-run | Logs/scrape output filled it | `df -h`, log rotation, mount a volume |

## Your turn (≈20 min)

1. Create the smallest VM your provider offers; connect with an ed25519 key.
2. Add a `~/.ssh/config` entry and connect with a one-word host alias.
3. Disable password auth and confirm keys still work — **keep a session open**.
4. Start a long job in `tmux`, disconnect, reconnect, and confirm it survived.
5. Convert it to a systemd service with `Restart=on-failure`; reboot and verify it comes back.

## Checklist

- [ ] I use ed25519 keys and never share a private key.
- [ ] I disable password auth and root login on public VMs.
- [ ] I keep a session open while changing SSH config.
- [ ] I use tmux or systemd so long jobs survive disconnection.
- [ ] I can port-forward to reach an internal service safely.

## Go deeper

- [OpenSSH manual](https://www.openssh.com/manual.html) — `ssh`, `sshd_config`, `ssh_config`.
- [tmux cheat sheet](https://tmuxcheatsheet.com/) — the handful of bindings you actually need.
- [systemd service units](https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html) — restarts, dependencies, logging.

<!-- SOURCES: https://www.openssh.com/manual.html , https://tmuxcheatsheet.com/ , https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html -->
