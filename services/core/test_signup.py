import os
import sys
import asyncio
from app.services.supabase import supabase

async def test_signup():
    print("Testing signup...")
    try:
        # We need the async client or just use the sync client from supabase
        res = supabase.auth.admin.create_user({
            "email": "test-admin-create@example.com",
            "password": "testpassword123",
            "email_confirm": True
        })
        print("Success:", res)
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    asyncio.run(test_signup())
