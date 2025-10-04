#!/usr/bin/env python3
"""
Ocean Hazard Social Media Scraper
Scrapes Instagram and Twitter/X for ocean hazard related posts
"""
import asyncio
import os
from datetime import datetime
from db_utils import DatabaseManager
from instagram_scraper import InstagramScraper
from twitter_scraper import TwitterScraper
import config

async def main():
    print("\n" + "="*60)
    print("🌊 OCEAN HAZARD SOCIAL MEDIA SCRAPER")
    print("="*60 + "\n")
    
    # Verify auth files exist
    if not os.path.exists(config.IG_AUTH_FILE):
        print(f"✗ Error: {config.IG_AUTH_FILE} not found!")
        print("  Please run Instagram authentication setup first.")
        return
    
    if not os.path.exists(config.X_AUTH_FILE):
        print(f"✗ Error: {config.X_AUTH_FILE} not found!")
        print("  Please run Twitter/X authentication setup first.")
        return
    
    # Initialize database
    db = DatabaseManager()
    await db.connect()
    
    try:
        # Initialize keywords if needed
        await db.initialize_keywords()
        
        # Get active keywords
        keywords = await db.get_active_keywords()
        print(f"\n📋 Found {len(keywords)} active keywords to scrape\n")
        
        if not keywords:
            print("✗ No active keywords found in database!")
            return
        
        # Initialize scrapers
        ig_scraper = InstagramScraper(db)
        tw_scraper = TwitterScraper(db)
        
        # Statistics
        total_ig_posts = 0
        total_tw_posts = 0
        start_time = datetime.now()
        
        # Scrape each keyword
        for idx, keyword_data in enumerate(keywords, 1):
            keyword = keyword_data["text"]
            keyword_id = keyword_data["id"]
            
            print(f"\n[{idx}/{len(keywords)}] Processing keyword: '{keyword}'")
            print("-" * 60)
            
            # Scrape Instagram
            print("📷 Scraping Instagram...")
            try:
                ig_count = await ig_scraper.scrape_keyword(keyword, keyword_id)
                total_ig_posts += ig_count
                print(f"  ✓ Instagram: {ig_count} posts saved")
            except Exception as e:
                print(f"  ✗ Instagram scraping failed: {e}")
            
            # Small delay between platforms
            await asyncio.sleep(3)
            
            # Scrape Twitter/X
            print("🐦 Scraping Twitter/X...")
            try:
                tw_count = await tw_scraper.scrape_keyword(keyword, keyword_id)
                total_tw_posts += tw_count
                print(f"  ✓ Twitter: {tw_count} posts saved")
            except Exception as e:
                print(f"  ✗ Twitter scraping failed: {e}")
            
            # Delay between keywords to avoid rate limits
            if idx < len(keywords):
                print(f"\n⏳ Waiting {config.REQUEST_DELAY}s before next keyword...")
                await asyncio.sleep(config.REQUEST_DELAY)
        
        # Final statistics
        elapsed = (datetime.now() - start_time).total_seconds()
        print("\n" + "="*60)
        print("📊 SCRAPING COMPLETE")
        print("="*60)
        print(f"Instagram posts saved: {total_ig_posts}")
        print(f"Twitter posts saved:   {total_tw_posts}")
        print(f"Total posts saved:     {total_ig_posts + total_tw_posts}")
        print(f"Time elapsed:          {elapsed:.1f} seconds")
        print(f"Keywords processed:    {len(keywords)}")
        print("="*60 + "\n")
    
    finally:
        await db.close()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\n⚠️  Scraping interrupted by user")
    except Exception as e:
        print(f"\n\n✗ Fatal error: {e}")
        import traceback
        traceback.print_exc()