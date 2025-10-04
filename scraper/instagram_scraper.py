import asyncio
import aiohttp
import re
from datetime import datetime
from urllib.parse import urljoin
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError
from typing import List, Dict, Optional
import config

class InstagramScraper:
    def __init__(self, db_manager):
        self.db = db_manager
        self.session = None
    
    def extract_location(self, text: str) -> bool:
        """Check if text mentions any Indian coastal city"""
        if not text:
            return False
        text_lower = text.lower()
        return any(city in text_lower for city in config.INDIAN_COASTAL_CITIES)
    
    def extract_post_id(self, url: str) -> Optional[str]:
        """Extract Instagram post ID from URL"""
        match = re.search(r'/p/([A-Za-z0-9_-]+)', url)
        return match.group(1) if match else None
    
    async def scrape_keyword(self, keyword: str, keyword_id: str) -> int:
        """Scrape Instagram for a specific keyword"""
        posts_saved = 0
        
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=False)
            context = await browser.new_context(storage_state=config.IG_AUTH_FILE)
            page = await context.new_page()
            
            try:
                # Navigate to hashtag or profile
                if keyword.startswith("#"):
                    url = f"https://www.instagram.com/explore/tags/{keyword.strip('#')}/"
                elif keyword.startswith("@"):
                    url = f"https://www.instagram.com/{keyword.strip('@')}/"
                else:
                    url = f"https://www.instagram.com/explore/tags/{keyword}/"
                
                print(f"  → Navigating to {url}")
                await page.goto(url, wait_until="domcontentloaded", timeout=90000)
                await page.wait_for_selector("main[role='main']", timeout=30000)
                
                # Dismiss login prompts
                try:
                    not_now = page.get_by_role("button", name="Not now")
                    if await not_now.is_visible(timeout=5000):
                        await not_now.click()
                        await asyncio.sleep(2)
                except:
                    pass
                
                # Scroll to load posts
                for i in range(config.SCROLL_ATTEMPTS):
                    await page.mouse.wheel(0, 2000)
                    await asyncio.sleep(config.REQUEST_DELAY)
                
                # Find post links
                post_links = await page.locator("a[href*='/p/']").all()
                print(f"  → Found {len(post_links)} posts")
                
                async with aiohttp.ClientSession() as session:
                    self.session = session
                    
                    for i, link in enumerate(post_links[:config.MAX_POSTS_PER_KEYWORD]):
                        try:
                            href = await link.get_attribute('href')
                            if not href:
                                continue
                            
                            post_url = urljoin("https://www.instagram.com", href)
                            post_id = self.extract_post_id(post_url)
                            
                            if not post_id:
                                continue
                            
                            # Check if already exists
                            if await self.db.post_exists(post_id, "INSTAGRAM"):
                                print(f"    ↷ Post {post_id} already exists, skipping")
                                continue
                            
                            # Open post dialog
                            await link.click()
                            await asyncio.sleep(2)
                            
                            dialog = page.locator("div[role='dialog']").first
                            await dialog.wait_for(timeout=15000)
                            
                            # Extract post data
                            caption = ""
                            try:
                                caption_el = await dialog.locator("h1").first.element_handle(timeout=5000)
                                if caption_el:
                                    caption = (await caption_el.inner_text()).strip()
                            except:
                                pass
                            
                            # Check if relevant to Indian coastal regions
                            has_location = self.extract_location(caption)
                            
                            author = "Unknown"
                            try:
                                author_link = dialog.locator("header a[role='link']").first
                                author_href = await author_link.get_attribute("href")
                                if author_href:
                                    author = author_href.strip('/')
                            except:
                                pass
                            
                            # Get media URLs
                            media_urls = []
                            try:
                                images = await dialog.locator("article img[srcset]").all()
                                print(f"    → Found {len(images)} images for post {post_id}")
                                
                                for img_idx, img in enumerate(images[:3]):  # Max 3 images
                                    try:
                                        src = await img.get_attribute("src")
                                        if src:
                                            print(f"      → Processing image {img_idx + 1}/{min(len(images), 3)}")
                                            filename = f"ig_{post_id}_{img_idx}.jpg"
                                            uploaded_url = await self.download_and_upload_media(
                                                src, filename, config.INSTAGRAM_FOLDER
                                            )
                                            if uploaded_url:
                                                media_urls.append(uploaded_url)
                                                print(f"      ✓ Image {img_idx + 1} uploaded successfully")
                                            else:
                                                print(f"      ✗ Image {img_idx + 1} upload failed")
                                    except Exception as img_err:
                                        print(f"      ✗ Error processing image {img_idx + 1}: {img_err}")
                                        continue
                                        
                            except Exception as media_err:
                                print(f"    ✗ Error extracting media: {media_err}")
                            
                            print(f"    → Total media URLs collected: {len(media_urls)}")
                            
                            # Save to database
                            post_data = {
                                "source_platform": "INSTAGRAM",
                                "original_id": post_id,
                                "post_url": post_url,
                                "author_id": author,
                                "content_text": caption,
                                "posted_at": datetime.now(),
                                "media_urls": media_urls,
                                "raw_data": {
                                    "scraped_at": datetime.now().isoformat(),
                                    "has_coastal_location": has_location,
                                    "keyword": keyword,
                                    "media_count": len(media_urls)
                                },
                                "found_by_keyword_id": keyword_id
                            }
                            
                            inserted_id = await self.db.insert_post(post_data)
                            if inserted_id:
                                posts_saved += 1
                                print(f"    ✓ Saved post {post_id} with {len(media_urls)} media (coastal: {has_location})")
                            else:
                                print(f"    ✗ Failed to save post {post_id}")
                            
                            # Close dialog
                            try:
                                close_btn = page.locator("svg[aria-label='Close']")
                                if await close_btn.count() > 0:
                                    await close_btn.click()
                                await asyncio.sleep(1)
                            except:
                                pass
                        
                        except Exception as e:
                            print(f"    ✗ Error scraping post {i+1}: {e}")
                            import traceback
                            traceback.print_exc()
                            continue
                
            except Exception as e:
                print(f"  ✗ Error scraping keyword '{keyword}': {e}")
                import traceback
                traceback.print_exc()
            finally:
                await browser.close()
        
        return posts_saved
    
    async def download_and_upload_media(self, url: str, filename: str, folder: str) -> Optional[str]:
        """Download image and upload to Supabase storage"""
        try:
            print(f"      → Downloading from: {url[:100]}...")
            async with self.session.get(url, timeout=aiohttp.ClientTimeout(total=30)) as resp:
                if resp.status == 200:
                    content = await resp.read()
                    print(f"      → Downloaded {len(content)} bytes")
                    
                    if len(content) == 0:
                        print(f"      ✗ Downloaded file is empty")
                        return None
                    
                    uploaded_url = await self.db.upload_media_to_storage(content, filename, folder)
                    return uploaded_url
                else:
                    print(f"      ✗ Download failed with status {resp.status}")
                    return None
        except asyncio.TimeoutError:
            print(f"      ✗ Download timeout for {filename}")
            return None
        except Exception as e:
            print(f"      ✗ Media download failed: {type(e).__name__}: {e}")
            return None