#!/usr/bin/env python3
"""
Generate a test JWT token for Samudra Prahari API testing
Run this script to get a valid token for your local development
"""

import jwt
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
import uuid

load_dotenv()

# Your Supabase JWT Secret
JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")

if not JWT_SECRET:
    print("❌ ERROR: SUPABASE_JWT_SECRET not found in .env")
    exit(1)

# Create a test payload that mimics Supabase JWT structure
payload = {
    "sub": "ac633484-1e8a-4221-8697-afc5dddaee22",  # Mock user UUID
    "email": "test@example.com",
    "role": "authenticated",
    "user_role": "PUBLIC",  # Your custom claim for app role
    "iat": datetime.utcnow(),
    "exp": datetime.utcnow() + timedelta(hours=24)  # Valid for 24 hours
}

# Generate the token
token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")

print("\n" + "="*70)
print("🔑 TEST JWT TOKEN GENERATED")
print("="*70)
print(f"\nToken: {token}")
print(f"\nUser ID: {payload['sub']}")
print(f"Role: {payload['user_role']}")
print(f"Expires: {payload['exp'].strftime('%Y-%m-%d %H:%M:%S UTC')}")
print("\n" + "="*70)
print("\n📋 CURL COMMAND:")
print("="*70)
print(f"""
curl -X 'GET' \\
  'http://127.0.0.1:8000/test-auth' \\
  -H 'accept: application/json' \\
  -H 'Authorization: Bearer {token}'
""")
print("="*70)
print("\n📝 For Swagger UI:")
print("="*70)
print("1. Click the 'Authorize' 🔓 button at the top")
print("2. Enter this token (without 'Bearer '):")
print(f"\n   {token}")
print("\n3. Click 'Authorize' and close the dialog")
print("4. Now try your /test-auth endpoint")
print("="*70 + "\n")

# Generate tokens for different roles
print("\n🎭 TOKENS FOR DIFFERENT ROLES:")
print("="*70)

roles = ["PUBLIC", "VERIFIED_VOLUNTEER", "OFFICIAL"]
for role in roles:
    role_payload = payload.copy()
    role_payload["user_role"] = role
    role_payload["sub"] = str(uuid.uuid4())  # generate valid UUID
    role_token = jwt.encode(role_payload, JWT_SECRET, algorithm="HS256")
    print(f"\n{role}:")
    print(f"{role_token}")

print("\n" + "="*70 + "\n")