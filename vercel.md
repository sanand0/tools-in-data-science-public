## Serverless hosting: Vercel

<!--

Why Vercel? I evaluated from https://survey.stackoverflow.co/2024/technology#2-cloud-platforms

- AWS, Azure, Google Cloud are too complex for beginners
- Cloudflare (next most popular, widely admired) Python support is in beta
- Hetzner (most admired), Supabase (next most admired) do not have a serverless platform
- Fly.io (next most admired) does not have a free tier
- Heroku (used in previous terms) is the least admired
- Vercel is both popular, admired, growing, has a free plan, and a simple API

-->

Rather than writing a full program, serverless platforms let you write functions. These functions are called via HTTP requests. They run in a cloud environment and are scaled up and down automatically. But this means you write programs in a different style. For example:

- You can't `pip install` packages - you have to use `requirements.txt`
- You can't read or write files from the file system - you can only use APIs.
- You can't run commands (e.g. `subprocess.run()`)

[Vercel](https://vercel.com/) is a cloud platform optimized for frontend frameworks and serverless functions. Vercel is tightly integrated with GitHub. Pushing to your repository automatically triggers new deployments.

Here's a [quickstart](https://vercel.com/docs/functions/runtimes/python). [Sign-up with Vercel](https://vercel.com/signup). Create an empty `git` repo with this `api/index.py` file.

```python
# api/index.py
import json
from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type','application/json')
        self.end_headers()
        self.wfile.write(json.dumps({"message": "Hello!"}).encode('utf-8'))
        return
```

On the command line, run:

- `npx vercel` to deploy a test version
- `npx vercel --prod` to deploy to production

Best Practices:

1. **Project Structure**

   ```text
   my-app/
   ├── api/index.py   # Serverless functions
   ├── .env           # OPTIONAL: Environment variables
   ├── public/        # OPTIONAL: Static assets
   └── vercel.json    # OPTIONAL: Configuration
   ```

2. **Environment Variables**. Use `npx vercel env add` to add environment variables. In your code, use `os.environ.get('SECRET_KEY')` to access them.

[![Vercel Product Walkthrough](https://i.ytimg.com/vi_webp/sPmat30SE4k/sddefault.webp)](https://youtu.be/sPmat30SE4k)
