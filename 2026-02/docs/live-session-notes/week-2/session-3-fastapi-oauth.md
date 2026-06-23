# Session 3: Security & Google OAuth

<div class="live-session-note" data-deck-id="week-2-session-3-fastapi-oauth" data-week="Week 2" data-session="Session 3" data-title="Security & Google OAuth">
<textarea data-live-session-slides>
# Security & Google OAuth
## Week 2 Session 3

- Understanding Google OAuth2 Flow
- Integrating auth in FastAPI using Authlib/Starlette
- Protecting routes and checking credentials
- Restricting access using a local whitelist database
---
## Google OAuth2 Flow

1. User clicks **"Login with Google"**.
2. App redirects user to Google Consent screen.
3. User logs in; Google redirects back with an authorization `code`.
4. App trades the `code` for an access token and user info.
5. App verifies the token and issues a session/JWT.
---
## FastAPI Auth Routes

Implementing the login and callback routes:

```python
from authlib.integrations.starlette_client import OAuth

oauth = OAuth()
oauth.register(
    name='google',
    client_id='GOOGLE_CLIENT_ID',
    client_secret='GOOGLE_CLIENT_SECRET',
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

@app.get('/login')
async def login(request: Request):
    redirect_uri = request.url_for('auth')
    return await oauth.google.authorize_redirect(request, redirect_uri)
```
---
## The Callback Handler

Handle the callback, retrieve user details, and check against database:

```python
@app.get('/auth')
async def auth(request: Request):
    token = await oauth.google.authorize_access_token(request)
    user_info = token.get('userinfo')
    email = user_info.get('email')

    if not is_email_allowed(email):
        raise HTTPException(status_code=403, detail="Unauthorized Email")

    request.session['user'] = email
    return {"message": "Logged in", "email": email}
```
---
## Whitelist Database

Restricting logins using a local SQLite table:

```python
import sqlite3

def is_email_allowed(email: str) -> bool:
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    cursor.execute("SELECT 1 FROM whitelist WHERE email = ?", (email,))
    row = cursor.fetchone()
    conn.close()
    return row is not None
```
---
## Protected Route

Check for session credentials before serving content:

```python
@app.get('/dashboard')
def dashboard(request: Request):
    user = request.session.get('user')
    if not user:
        raise HTTPException(status_code=401, detail="Please login first")
    return {"message": f"Welcome back {user}"}
```
---
## Annotation Exercise

- Highlight where the Google Client ID is configured
- Circle the check that checks if the email is in the whitelist database
- Mark the database query fetching matching emails
- Write down the status code returned to unauthorized users
</textarea>
</div>
