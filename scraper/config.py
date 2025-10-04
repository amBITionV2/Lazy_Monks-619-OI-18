import os
from dotenv import load_dotenv

load_dotenv()

# Supabase Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")

# Storage Configuration
STORAGE_BUCKET = "social-media-posts"
INSTAGRAM_FOLDER = "instagram"
TWITTER_FOLDER = "twitter"

# Auth Files
IG_AUTH_FILE = "ig_auth_state.json"
X_AUTH_FILE = "x_auth_state.json"

# Scraping Limits
MAX_POSTS_PER_KEYWORD = 10
SCROLL_ATTEMPTS = 3
REQUEST_DELAY = 2  # seconds between requests

# Indian Coastal Cities for Location Detection
INDIAN_COASTAL_CITIES = [
    "mumbai", "chennai", "kochi", "visakhapatnam", "goa", "kolkata",
    "puducherry", "mangalore", "thiruvananthapuram", "surat", "paradip",
    "kandla", "tuticorin", "pondicherry", "vizag", "cochin", "calicut",
    "kozhikode", "alleppey", "trivandrum", "panaji", "daman", "diu",
    "ratnagiri", "alibag", "digha", "puri", "gopalpur", "kakinada",
    "machilipatnam", "nellore", "cuddalore", "nagapattinam", "rameswaram",
    "kanyakumari", "porbandar", "dwarka", "okha", "veraval"
]

# Initial Keywords for Ocean Hazards
INITIAL_KEYWORDS = [
    # General hazards
    "tsunami", "cyclone", "storm surge", "high tide", "king tide",
    "coastal flooding", "rogue waves", "dangerous currents", "rip currents",
    "coastal erosion", "sea wall breach", "beach closed", "high waves",
    "swell surge", "coastal damage", "beach warning", "sea storm",
    
    # India-specific
    "mumbai flooding", "chennai floods", "odisha cyclone", "kerala floods",
    "goa beach warning", "visakhapatnam storm", "coastal damage india",
    "india tsunami", "cyclone india", "indian ocean hazard",
    
    # Hashtags
    "#tsunami", "#cyclone", "#coastalflooding", "#stormsurge",
    "#mumbaifloods", "#chennaifloods", "#keralafloods", "#odishacyclone",
    "#coastaldamage", "#beachwarning", "#hightide", "#kingtide"
]