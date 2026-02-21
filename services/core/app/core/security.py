import os
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional, Dict, Any
import jwt  # PyJWT

from app.core.config import settings
from app.models.schemas import TokenPayload, UserRole

security = HTTPBearer(auto_error=False)

def verify_supabase_jwt(token: str) -> Dict[str, Any]:
    """
    Manually verify a Supabase JWT.
    Note: In production, verify the signature using Supabase's JWT secret!
    For Supabase GoTrue tokens, we can decode without complete signature 
    validation locally IF we only extract data the API trusts, but best 
    practice is to verify the algorithm and secret.
    Here we do an unverified decode to trust the proxy/gateway, 
    but you should set your JWT_SECRET to strictly verify.
    """
    try:
        # Decode the JWT without signature verification for now, 
        # as the auth comes via Supabase Edge directly.
        # Production: jwt.decode(token, YOUR_JWT_SECRET, algorithms=["HS256"], audience="authenticated")
        payload = jwt.decode(token, options={"verify_signature": False})
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> TokenPayload:
    if settings.BYPASS_AUTH:
        return TokenPayload(
            sub="00000000-0000-0000-0000-000000000000",
            email="test@netraai.com",
            role=UserRole.PATIENT
        )

    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = credentials.credentials
    payload = verify_supabase_jwt(token)
    
    # Supabase user_metadata usually contains custom role logic
    user_metadata = payload.get("user_metadata", {})
    role_str = user_metadata.get("role", "patient") # Default patient
    
    try:
        role = UserRole(role_str)
    except ValueError:
        role = UserRole.PATIENT

    token_data = TokenPayload(
        sub=payload.get("sub"),
        email=payload.get("email"),
        role=role
    )
    return token_data

def get_current_patient(current_user: TokenPayload = Depends(get_current_user)) -> TokenPayload:
    # A patient (or admin) can access patient routes
    if current_user.role not in [UserRole.PATIENT, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user

def get_current_doctor(current_user: TokenPayload = Depends(get_current_user)) -> TokenPayload:
    # A doctor (or admin) can access doctor routes
    if current_user.role not in [UserRole.DOCTOR, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user

def get_current_admin(current_user: TokenPayload = Depends(get_current_user)) -> TokenPayload:
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user
