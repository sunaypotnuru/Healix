from app.services.supabase import supabase

# Auto-confirm all unconfirmed users
users = supabase.auth.admin.list_users()
for u in users:
    if not u.email_confirmed_at:
        print(f"Confirming {u.email}...")
        supabase.auth.admin.update_user_by_id(u.id, {"email_confirm": True})
        print(f"  Done!")

print("\nAll users confirmed!")

# Verify
users2 = supabase.auth.admin.list_users()
for u in users2:
    confirmed = u.email_confirmed_at is not None
    print(f"  {u.email}  |  confirmed={confirmed}")
