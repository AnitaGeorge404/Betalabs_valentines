from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import RedirectResponse, JSONResponse
from urllib.parse import urlencode
import requests
import time

from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests
from jose import jwt

from config import (
    GOOGLE_OAUTH_CLIENT_ID,
    GOOGLE_OAUTH_CLIENT_SECRET,
    OAUTH_REDIRECT_URI,
    ALLOWED_DOMAIN,
    JWT_SECRET,
    JWT_ALGORITHM,
)

# import helper to create user record
from routes.users import create_or_get_user

router = APIRouter(prefix="/auth", tags=["auth"])

GOOGLE_AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token"


@router.get("/login")
def login():
    """Redirect the browser to Google's OAuth2 consent screen."""
    if not GOOGLE_OAUTH_CLIENT_ID or not OAUTH_REDIRECT_URI:
        raise HTTPException(status_code=500, detail="OAuth client not configured on server")

    params = {
        "client_id": GOOGLE_OAUTH_CLIENT_ID,
        "redirect_uri": OAUTH_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "include_granted_scopes": "true",
        "prompt": "select_account",
    }
    url = f"{GOOGLE_AUTH_ENDPOINT}?{urlencode(params)}"
    return RedirectResponse(url)


@router.get("/callback")
def callback(request: Request):
    """Handle OAuth2 callback from Google, exchange code for tokens, verify id_token,
    create user if needed and return a signed JWT for frontend use.
    """
    code = request.query_params.get("code")
    if not code:
        raise HTTPException(status_code=400, detail="Missing code in callback")

    # Exchange code for tokens
    data = {
        "code": code,
        "client_id": GOOGLE_OAUTH_CLIENT_ID,
        "client_secret": GOOGLE_OAUTH_CLIENT_SECRET,
        "redirect_uri": OAUTH_REDIRECT_URI,
        "grant_type": "authorization_code",
    }

    resp = requests.post(GOOGLE_TOKEN_ENDPOINT, data=data, headers={"Accept": "application/json"})
    if resp.status_code != 200:
        raise HTTPException(status_code=500, detail=f"Token exchange failed: {resp.text}")

    token_data = resp.json()
    id_token_str = token_data.get("id_token")
    if not id_token_str:
        raise HTTPException(status_code=500, detail="No id_token in token response")

    # Verify id_token signature and audience
    try:
        claims = google_id_token.verify_oauth2_token(id_token_str, google_requests.Request(), GOOGLE_OAUTH_CLIENT_ID)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid id_token: {e}")

    email = claims.get("email")
    name = claims.get("name") or f"{claims.get('given_name','')} {claims.get('family_name','')}".strip()

    if not email:
        raise HTTPException(status_code=400, detail="No email claim in id_token")

    # Optional hosted domain check
    hd = claims.get("hd")
    if ALLOWED_DOMAIN and hd and hd != ALLOWED_DOMAIN:
        raise HTTPException(status_code=403, detail="Email not in allowed hosted domain")

    # Create user record (or fetch existing)
    user_row = create_or_get_user(email, name)

    # Issue a JWT for frontend. Keep it short-lived.
    now = int(time.time())
    payload = {
        "sub": email,
        "name": name,
        "iat": now,
        "exp": now + 3600,  # 1 hour expiry
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

    # Redirect back to the frontend app with the token in the URL fragment to
    # avoid the token being sent to the backend in logs. Frontend will parse
    # the fragment and store the token.
    from config import FRONTEND_URL
    # include minimal user info
    user_info = {
        "email": user_row.get("email"),
        "name": user_row.get("name"),
    }
    fragment = urlencode({"token": token, "email": user_info["email"], "name": user_info["name"]})
    redirect_url = f"{FRONTEND_URL}/#auth?{fragment}"
    return RedirectResponse(redirect_url)
