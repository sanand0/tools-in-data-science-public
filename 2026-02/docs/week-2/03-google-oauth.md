id: google-oauth

# Google OAuth 2.0

OAuth 2.0 lets users log in with their **existing Google account** — no passwords to store, no password resets to build, no security breaches from leaked hashes. Google handles the hard part; you just receive a verified identity.

?> **The Flow in Plain English**
?> 1. User clicks "Login with Google"
?> 2. You redirect them to Google's login page
?> 3. Google asks "Allow this app to see your email?"
?> 4. User clicks Allow → Google redirects back to your site with a `code`
?> 5. Your server exchanges that `code` for an **access token**
?> 6. You call Google's API with the access token to get the user's email/name
?> 7. You create a **JWT** (your own session token) and send it to the user
?> 8. User sends the JWT on future requests → you verify it and know who they are

---

## Setup: Google Cloud Console

Before writing any code, you need to register your app with Google:

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client IDs**
5. Application type: **Web application**
6. Add Authorized redirect URIs:
   - `http://localhost:8000/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)
7. Copy your **Client ID** and **Client Secret**

---

## Installation

```bash
uv add "authlib>=1.3" "httpx>=0.27" "python-jose[cryptography]>=3.3" "itsdangerous>=2.1"
```

---

## Environment Variables

```bash title=".env"
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
SECRET_KEY=your-random-secret-key-min-32-chars-long
REDIRECT_URI=http://localhost:8000/auth/callback
```

Generate a secret key:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

---

## Full OAuth Implementation

```python title="main.py"
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.responses import RedirectResponse, JSONResponse
from authlib.integrations.httpx_client import AsyncOAuth2Client
from jose import JWTError, jwt
from datetime import datetime, timedelta
from pydantic import BaseModel
from pydantic_settings import BaseSettings
import httpx

# --- Config ---
class Settings(BaseSettings):
    google_client_id: str
    google_client_secret: str
    secret_key: str
    redirect_uri: str = "http://localhost:8000/auth/callback"

    class Config:
        env_file = ".env"

settings = Settings()
app = FastAPI()

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"
ALGORITHM = "HS256"
TOKEN_EXPIRE_HOURS = 24

# --- Token Helpers ---
def create_jwt(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(hours=TOKEN_EXPIRE_HOURS)
    return jwt.encode(payload, settings.secret_key, algorithm=ALGORITHM)

def decode_jwt(token: str) -> dict:
    try:
        return jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# --- Auth Dependency ---
def get_current_user(request: Request) -> dict:
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing Bearer token")
    token = auth_header.split(" ")[1]
    return decode_jwt(token)

# --- Routes ---
@app.get("/auth/login")
def login():
    """Step 1: Redirect user to Google"""
    params = {
        "client_id": settings.google_client_id,
        "redirect_uri": settings.redirect_uri,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",    # get refresh token
    }
    query = "&".join(f"{k}={v}" for k, v in params.items())
    return RedirectResponse(f"{GOOGLE_AUTH_URL}?{query}")

@app.get("/auth/callback")
async def callback(code: str):
    """Step 2: Exchange code for tokens, get user info, return JWT"""
    async with httpx.AsyncClient() as client:
        # Exchange authorization code for access token
        token_response = await client.post(GOOGLE_TOKEN_URL, data={
            "client_id": settings.google_client_id,
            "client_secret": settings.google_client_secret,
            "code": code,
            "redirect_uri": settings.redirect_uri,
            "grant_type": "authorization_code",
        })
        token_data = token_response.json()

        if "error" in token_data:
            raise HTTPException(400, f"Token exchange failed: {token_data['error']}")

        # Get user info from Google
        user_response = await client.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {token_data['access_token']}"},
        )
        user_info = user_response.json()

    # Create our own JWT
    jwt_token = create_jwt({
        "sub": user_info["id"],
        "email": user_info["email"],
        "name": user_info.get("name", ""),
        "picture": user_info.get("picture", ""),
    })

    return {"access_token": jwt_token, "token_type": "bearer"}

@app.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    """Protected endpoint — requires valid JWT"""
    return {
        "email": current_user["email"],
        "name": current_user["name"],
    }

@app.get("/protected")
def protected_route(current_user: dict = Depends(get_current_user)):
    """Any route can be protected by adding the Depends"""
    return {"message": f"Hello, {current_user['name']}! This is a protected resource."}
```

---

## Testing the Flow

```bash
# 1. Start the server
uvicorn main:app --reload

# 2. Visit in browser: http://localhost:8000/auth/login
# → Redirects to Google login
# → After login, redirects back to /auth/callback
# → Returns {"access_token": "eyJ..."}

# 3. Call protected endpoint with the token
curl -H "Authorization: Bearer eyJ..." http://localhost:8000/me
```

---

## Restricting to Specific Domains

Only allow IIT Madras emails:

```python
def get_current_user(request: Request) -> dict:
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(401, "Missing token")
    
    user = decode_jwt(auth_header.split(" ")[1])
    
    # Domain restriction
    allowed_domains = ["ds.study.iitm.ac.in", "iitm.ac.in"]
    email_domain = user["email"].split("@")[1]
    if email_domain not in allowed_domains:
        raise HTTPException(403, f"Access restricted to {allowed_domains}")
    
    return user
```

---

## JWT vs Session Cookies

| | JWT (what we built) | Session Cookie |
|--|---------------------|----------------|
| Storage | Client (Authorization header) | Server (session DB) |
| Stateless | ✅ Yes | ❌ No |
| Revocation | Hard (wait for expiry) | Easy (delete from DB) |
| Scaling | ✅ No shared state needed | Needs session store (Redis) |
| Best for | APIs, mobile apps | Traditional web apps |

---

## Video Reference

[![OAuth 2.0 Explained](https://img.youtube.com/vi/5GxQ1rLTwaU/0.jpg)](https://youtu.be/5GxQ1rLTwaU "OAuth 2.0 Explained")

---

## Key Takeaways

- Google handles password/2FA — you just get a verified email
- Exchange the authorization `code` for an access token (server-side only!)
- Use the access token to fetch user info from Google
- Issue your own JWT for subsequent requests — don't use Google's token directly
- Always validate the JWT on every protected request using `Depends`