import asyncio
import aiohttp
import re
from datetime import datetime
from urllib.parse import urljoin, quote
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError
from typing import List, Dict, Optional
import config

class TwitterScraper:
    def __init__(self, db_manager):
        self.db = db_manager
        self.session = None
    
    def extract_location(self, text: str) -> bool:
        """Check if text mentions any Indian coastal city"""
        if not text:
            return False
        text_lower = text.lower()
        return any(city in text_lower for city in config.INDIAN_COASTAL_CITIES)
    
    def extract_tweet_id(self, url: str) -> Optional[str]:
        """Extract tweet ID from URL"""
        match = re.search(r'/status/(\d+)', url)
        return match.group(1) if match else None
    
    async def scrape_keyword(self, keyword: str, keyword_id: str) -> int:
        """Scrape Twitter/X for a specific keyword"""
        posts_saved = 0
        
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=False)
            context = await browser.new_context(storage_state=config.X_AUTH_FILE)
            page = await context.new_page()
            
            try:
                # Navigate to search
                encoded_query = quote(keyword)
                url = f"https://x.com/search?q={encoded_query}&src=typed_query&f=live"
                
                print(f"  → Navigating to {url}")
                await page.goto(url, wait_until="domcontentloaded", timeout=60000)
                await page.locator('article[data-testid="tweet"]').first.wait_for(timeout=45000)
                
                # Scroll to load more tweets
                for i in range(config.SCROLL_ATTEMPTS):
                    await page.mouse.wheel(0, 1500)
                    await asyncio.sleep(config.REQUEST_DELAY)
                
                # Find tweets
                tweets = await page.locator('article[data-testid="tweet"]').all()
                print(f"  → Found {len(tweets)} tweets")
                
                async with aiohttp.ClientSession() as session:
                    self.session = session
                    
                    for i, tweet in enumerate(tweets[:config.MAX_POSTS_PER_KEYWORD]):
                        try:
                            # Extract tweet URL
                            tweet_url = None
                            try:
                                link = await tweet.locator('a[href*="/status/"]').first.get_attribute('href')
                                if link:
                                    tweet_url = urljoin("https://x.com", link)
                            except:
                                continue
                            
                            if not tweet_url:
                                continue
                            
                            tweet_id = self.extract_tweet_id(tweet_url)
                            if not tweet_id:
                                continue
                            
                            # Check if already exists
                            if await self.db.post_exists(tweet_id, "TWITTER"):
                                print(f"    ↷ Tweet {tweet_id} already exists, skipping")
                                continue
                            
                            # Extract tweet text
                            tweet_text = ""
                            try:
                                text_el = tweet.locator('div[data-testid="tweetText"]').first
                                tweet_text = (await text_el.text_content()).strip() if text_el else ""
                            except:
                                pass
                            
                            # Check if relevant to Indian coastal regions
                            has_location = self.extract_location(tweet_text)
                            
                            # Extract author
                            author = "Unknown"
                            try:
                                author_el = tweet.locator('span').filter(has_text=re.compile(r'^@'))
                                author_text = await author_el.first.text_content()
                                if author_text:
                                    author = author_text.strip()
                            except:
                                pass
                            
                            # Extract media
                            media_urls = []
                            try:
                                images = await tweet.locator('img[alt="Image"]').all()
                                for idx, img in enumerate(images[:3]):  # Max 3 images
                                    src = await img.get_attribute('src')
                                    if src and 'profile_images' not in src:  # Skip profile pics
                                        filename = f"tw_{tweet_id}_{idx}.jpg"
                                        uploaded_url = await self.download_and_upload_media(
                                            src, filename, config.TWITTER_FOLDER
                                        )
                                        if uploaded_url:
                                            media_urls.append(uploaded_url)
                            except:
                                pass
                            
                            # Save to database
                            post_data = {
                                "source_platform": "X",
                                #"source_platform": "twitter",
                                "original_id": tweet_id,
                                "post_url": tweet_url,
                                "author_id": author,
                                "content_text": tweet_text,
                                "posted_at": datetime.now(),
                                "media_urls": media_urls,
                                "raw_data": {
                                    "scraped_at": datetime.now().isoformat(),
                                    "has_coastal_location": has_location,
                                    "keyword": keyword
                                },
                                "found_by_keyword_id": keyword_id
                            }
                            
                            inserted_id = await self.db.insert_post(post_data)
                            if inserted_id:
                                posts_saved += 1
                                print(f"    ✓ Saved tweet {tweet_id} (coastal: {has_location})")
                        
                        except Exception as e:
                            print(f"    ✗ Error scraping tweet {i+1}: {e}")
                            continue
                
            except Exception as e:
                print(f"  ✗ Error scraping keyword '{keyword}': {e}")
            finally:
                await browser.close()
        
        return posts_saved
    
    async def download_and_upload_media(self, url: str, filename: str, folder: str) -> Optional[str]:
        """Download image and upload to Supabase storage"""
        try:
            # Convert Twitter image URL to high quality
            if 'pbs.twimg.com' in url:
                url = re.sub(r'\?.*$', '', url) + '?format=jpg&name=large'
            
            async with self.session.get(url) as resp:
                if resp.status == 200:
                    content = await resp.read()
                    return await self.db.upload_media_to_storage(content, filename, folder)
        except Exception as e:
            print(f"      ✗ Media upload failed: {e}")
        return None