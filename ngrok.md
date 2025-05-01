## Tunneling: ngrok

[Ngrok](https://ngrok.com/) is a tool that creates secure tunnels to your localhost, making your local development server accessible to the internet. It's essential for testing webhooks, sharing work in progress, or debugging applications in production-like environments.

[![ngrok in 60 seconds](https://i.ytimg.com/vi_webp/dfMdLGZLXSg/sddefault.webp)](https://youtu.be/dfMdLGZLXSg)

Run the command `uvx ngrok http 8000` to create a tunnel to your local server on port 8000. This generates a public URL that you can share with others.

To get started, log into `ngrok.com` and [get an authtoken from the dashboard](https://dashboard.ngrok.com/get-started/your-authtoken). Copy it. Then run:

```bash
ngrok config add-authtoken $YOUR_AUTHTOKEN
```

Now you can forward any local port to the internet. For example:

```bash
# Start a local server on port 8000
uv run -m http.server 8000

# Start HTTP tunnel
uvx ngrok http 8000
```

Here are useful things you can do with `ngrok http`:

- `ngrok http file://.` to serve local files
- `--response-header-add "Access-Control-Allow-Origin: *"` to enable CORS
- `--oauth google --oauth-client-id $CLIENT_ID --oauth-client-secret $SECRET --oauth-allow-domain example.com --oauth-allow-email user@example.org` to restrict users to @example.com and user@example.org using Google Auth
- `--ua-filter-deny ".*bot$"` to reject user agents ending with `bot`
