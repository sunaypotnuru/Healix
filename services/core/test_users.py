from app.services.supabase import supabase

users = supabase.auth.admin.list_users()
for u in users:
    confirmed = u.email_confirmed_at is not None
    role = (u.user_metadata or {}).get('role', 'unknown')
    print(f"  {u.email}  |  role={role}  |  confirmed={confirmed}  |  id={u.id}")
