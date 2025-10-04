import asyncpg
from supabase import create_client, Client
from datetime import datetime
from typing import Optional, List, Dict
import config
import io
import json 

class DatabaseManager:
    def __init__(self):
        self.supabase: Client = create_client(config.SUPABASE_URL, config.SUPABASE_SERVICE_KEY)
        self.db_pool = None
    
    async def connect(self):
        """Create database connection pool"""
        self.db_pool = await asyncpg.create_pool(config.DATABASE_URL, min_size=2, max_size=10, statement_cache_size=0)
        print("✓ Database connection pool created")
    
    async def close(self):
        """Close database connection pool"""
        if self.db_pool:
            await self.db_pool.close()
            print("✓ Database connection pool closed")
    
    async def initialize_keywords(self):
        """Add initial ocean hazard keywords if table is empty"""
        async with self.db_pool.acquire() as conn:
            count = await conn.fetchval("SELECT COUNT(*) FROM scraping_keywords")
            
            if count == 0:
                print("Initializing keywords in database...")
                for keyword in config.INITIAL_KEYWORDS:
                    await conn.execute("""
                        INSERT INTO scraping_keywords (keyword_text, status, source)
                        VALUES ($1, 'ACTIVE', 'MANUAL')
                    """, keyword)
                print(f"✓ Added {len(config.INITIAL_KEYWORDS)} initial keywords")
            else:
                print(f"✓ Found {count} existing keywords")
    
    async def get_active_keywords(self) -> List[Dict]:
        """Fetch all active keywords"""
        async with self.db_pool.acquire() as conn:
            rows = await conn.fetch("""
                SELECT id, keyword_text 
                FROM scraping_keywords 
                WHERE status = 'ACTIVE'
                ORDER BY effectiveness_score DESC
            """)
            return [{"id": str(row["id"]), "text": row["keyword_text"]} for row in rows]
    
    async def post_exists(self, original_id: str, platform: str) -> bool:
        """Check if a post already exists in database"""
        async with self.db_pool.acquire() as conn:
            result = await conn.fetchval("""
                SELECT EXISTS(
                    SELECT 1 FROM social_posts 
                    WHERE original_id = $1 AND source_platform = $2
                )
            """, original_id, platform)
            return result
    
    async def insert_post(self, post_data: Dict) -> Optional[str]:
        """Insert a new social media post"""
        async with self.db_pool.acquire() as conn:
            try:
                row = await conn.fetchrow("""
                    INSERT INTO social_posts (
                        source_platform, original_id, post_url, author_id,
                        content_text, posted_at, media_urls, raw_data,
                        status, found_by_keyword_id
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                    RETURNING id
                """,
                    post_data["source_platform"],
                    post_data["original_id"],
                    post_data["post_url"],
                    post_data.get("author_id"),
                    post_data.get("content_text"),
                    post_data["posted_at"],
                    post_data.get("media_urls", []),
                    json.dumps(post_data.get("raw_data", {})),
                    "PENDING",
                    post_data.get("found_by_keyword_id")
                )
                return str(row["id"])
            except Exception as e:
                print(f"✗ Failed to insert post {post_data.get('original_id')}: {e}")
                return None
    
    async def upload_media_to_storage(self, file_content: bytes, filename: str, folder: str) -> Optional[str]:
        """Upload media file to Supabase storage"""
        try:
            # Ensure bucket exists
            try:
                buckets = self.supabase.storage.list_buckets()
                bucket_exists = any(b.name == config.STORAGE_BUCKET for b in buckets)
                
                if not bucket_exists:
                    print(f"  → Creating storage bucket: {config.STORAGE_BUCKET}")
                    # Correct format for bucket creation
                    self.supabase.storage.create_bucket(
                        id=config.STORAGE_BUCKET,
                        options={"public": True}
                    )
                    print(f"  ✓ Bucket created successfully")
            except Exception as bucket_err:
                error_msg = str(bucket_err)
                # If bucket already exists, that's fine
                if "already exists" in error_msg.lower() or "duplicate" in error_msg.lower():
                    print(f"  → Bucket already exists, continuing...")
                else:
                    print(f"  ⚠ Bucket check/create warning: {bucket_err}")
                    # Continue anyway - bucket might already exist
            
            # Upload file with path
            path = f"{folder}/{filename}"
            
            # Try to remove existing file first (in case of retry)
            try:
                self.supabase.storage.from_(config.STORAGE_BUCKET).remove([path])
            except:
                pass  # File doesn't exist, that's fine
            
            # Upload the file - try with raw bytes first
            print(f"      → Uploading {filename} to {path}")
            
            try:
                upload_response = self.supabase.storage.from_(config.STORAGE_BUCKET).upload(
                    path=path,
                    file=file_content,
                    file_options={"content-type": "image/jpeg", "upsert": "true"}
                )
            except Exception as upload_err:
                # If raw bytes don't work, try with BytesIO
                print(f"      → First attempt failed, trying with BytesIO...")
                file_obj = io.BytesIO(file_content)
                upload_response = self.supabase.storage.from_(config.STORAGE_BUCKET).upload(
                    path=path,
                    file=file_obj.read(),  # Read bytes from BytesIO
                    file_options={"content-type": "image/jpeg", "upsert": "true"}
                )
            
            # Get public URL
            public_url = self.supabase.storage.from_(config.STORAGE_BUCKET).get_public_url(path)
            print(f"      ✓ Uploaded successfully: {public_url}")
            return public_url
            
        except Exception as e:
            print(f"      ✗ Upload failed for {filename}: {type(e).__name__}: {e}")
            return None