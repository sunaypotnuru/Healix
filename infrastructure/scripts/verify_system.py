import httpx
import asyncio
import sys
from typing import Dict, List

# Configuration
BASE_URL = "http://localhost:8000"
ANEMIA_URL = "http://localhost:8001"
TRANSLATOR_URL = "http://localhost:5000"

async def check_health(name: str, url: str) -> bool:
    print(f"Checking {name} health at {url}...")
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(f"{url}/health")
            if resp.status_code == 200:
                print(f"✅ {name} is UP")
                return True
            else:
                print(f"❌ {name} returned {resp.status_code}")
                return False
    except Exception as e:
        print(f"❌ {name} is DOWN: {e}")
        return False

async def verify_endpoints():
    print("\n" + "="*50)
    print("NETRA AI - SYSTEM VERIFICATION")
    print("="*50 + "\n")

    services = [
        ("Core Backend", BASE_URL),
        ("Anemia Service", ANEMIA_URL),
        ("LibreTranslate", TRANSLATOR_URL),
    ]

    all_up = True
    for name, url in services:
        if not await check_health(name, url):
            all_up = False

    if not all_up:
        print("\n⚠️ WARNING: Some services are unreachable. Verification will be partial.\n")

    print("Verifying Core API Routes...")
    routes = [
        ("/health", "GET"),
        ("/api/v1/patient/dashboard", "GET"),
        ("/api/v1/doctor/dashboard", "GET"),
        ("/api/v1/admin/stats", "GET"),
        ("/api/v1/video/token?room=test&identity=test", "GET"),
    ]

    async with httpx.AsyncClient(timeout=10.0) as client:
        for route, method in routes:
            try:
                if method == "GET":
                    resp = await client.get(f"{BASE_URL}{route}")
                
                # We expect 401 if unauthenticated, which confirms the route exists and is protected
                if resp.status_code in [200, 401]:
                    print(f"✅ {method} {route} -> {resp.status_code} (Active)")
                else:
                    print(f"❌ {method} {route} -> {resp.status_code} (Unexpected)")
            except Exception as e:
                print(f"❌ {method} {route} -> Failed: {e}")

    print("\nVerification Complete.")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--run":
        asyncio.run(verify_endpoints())
    else:
        print("Verification script ready. Run with '--run' to execute tests against a live local stack.")
