import jwt

def test():
    # Create a dummy token
    payload = {"sub": "123", "role": "patient", "user_metadata": {"role": "patient"}}
    token = jwt.encode(payload, "secret", algorithm="HS256")
    
    # Try decoding it exactly as security.py does
    try:
        decoded = jwt.decode(token, options={"verify_signature": False})
        print("Decode SUCCESS:", decoded)
    except Exception as e:
        print("Decode FAILED:", type(e).__name__, "-", str(e))

if __name__ == "__main__":
    test()
