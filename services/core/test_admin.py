import sys
import os

from app.services.supabase import supabase

print(dir(supabase.auth.admin))
