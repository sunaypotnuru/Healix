import asyncio
import httpx
import jwt
from app.services.supabase import supabase

async def test():
    # Get latest registered user
    users = supabase.auth.admin.list_users()
    if not users:
        print("No auth users exist")
        return
        
    auth_user = users[0]
    print(f"Forging JWT for {auth_user.email} ({auth_user.id})")
    
    # Forge a token similar to Supabase
    payload = {
        "sub": auth_user.id,
        "email": auth_user.email,
        "user_metadata": auth_user.user_metadata or {},
        "app_metadata": auth_user.app_metadata or {},
        "role": auth_user.role or "authenticated"
    }
    
    token = jwt.encode(payload, "dummy_secret_of_sufficient_length_for_hs256_which_is_32_bytes_long", algorithm="HS256")
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "http://localhost:8000/api/v1/patient/dashboard",
            headers={"Authorization": f"Bearer {token}"}
        )
        print("HTTP Status:", response.status_code)
        print("HTTP Body:", response.text[:400])

if __name__ == "__main__":
    asyncio.run(test())
