import urllib.request
import re
import json

apps = [
    ('com.music.audio.equalizer.mp3.player.app', 'Music Player - Audio Equalizer'),
    ('com.gpscamera.geosnap.timestamp', 'GPS Camera - GeoSnap Timestamp'),
    ('com.findmyphone.clapfinder', 'Clap to Find My Phone: Flash'),
    ('com.ziksol.secretdiary.dailynotes', 'Secret Diary: Daily Notes'),
    ('com.muslimmoon.prayertimes', 'Prayer Times - Qibla & Quran'),
    ('com.cameragps.location.navigation.timestamp', 'GPS Camera - Photo Location')
]

results = []

for pkg, name in apps:
    url = f"https://play.google.com/store/apps/details?id={pkg}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        html = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')
        
        # Extract icon URL
        img_match = re.search(r'https://play-lh\.googleusercontent\.com/[a-zA-Z0-9_-]+', html)
        icon_url = img_match.group(0) + "=w240-h240-rw" if img_match else ""
        
        # Extract meta description
        desc_match = re.search(r'<meta name="description" content="([^"]+)"', html)
        desc = desc_match.group(1) if desc_match else f"Professional Android application: {name} developed for high performance and smooth user experience."
        
        results.append({
            'pkg': pkg,
            'name': name,
            'url': url,
            'icon': icon_url,
            'desc': desc
        })
        print(f"Fetched {name}: icon -> {icon_url[:60]}")
    except Exception as e:
        print(f"Error fetching {pkg}: {e}")
        results.append({
            'pkg': pkg,
            'name': name,
            'url': url,
            'icon': '',
            'desc': f"Professional Android application: {name} developed with modern architecture."
        })

with open('playstore_apps.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2)

print("Saved playstore_apps.json successfully!")
