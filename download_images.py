#!/usr/bin/env python3
import json
import re
import os
import urllib.request
from urllib.parse import urlparse, unquote
import time

def extract_image_urls(content):
    """Extract all image URLs from HTML content"""
    # Find img src attributes
    img_pattern = r'<img[^>]+src=["\']([^"\']+)["\']'
    urls = re.findall(img_pattern, content, re.IGNORECASE)
    
    # Also find URLs in WordPress image blocks
    wp_pattern = r'(https?://[^\s<>"]+(?:\.jpg|\.jpeg|\.png|\.gif|\.webp|\.bmp))'
    urls.extend(re.findall(wp_pattern, content, re.IGNORECASE))
    
    # Filter for wp-content URLs AND hvflyingcircus domain
    wp_urls = [url for url in urls if 'wp-content' in url and 'hvflyingcircus' in url]
    return list(set(wp_urls))  # Remove duplicates

def get_filepath_from_url(url, base_folder):
    """Extract file path preserving WordPress directory structure"""
    parsed = urlparse(url)
    path = unquote(parsed.path)
    
    # Extract the wp-content/uploads part and everything after
    if 'wp-content/uploads' in path:
        # Get everything after wp-content/
        parts = path.split('wp-content/')
        if len(parts) > 1:
            relative_path = parts[1]  # e.g., "uploads/2016/03/img_0675.jpg"
        else:
            relative_path = os.path.basename(path)
    else:
        # Fallback to just filename if not standard WordPress structure
        relative_path = os.path.basename(path)
    
    # Clean up filename only (preserve directory structure)
    dir_path = os.path.dirname(relative_path)
    filename = os.path.basename(relative_path)
    
    # Clean up filename but preserve extension
    name, ext = os.path.splitext(filename)
    name = re.sub(r'[^\w\-_]', '_', name)
    filename = name + ext
    
    # Ensure it has an extension
    if not any(filename.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp']):
        filename += '.jpg'
    
    # Combine base folder with preserved path structure
    full_dir = os.path.join(base_folder, dir_path)
    full_path = os.path.join(full_dir, filename)
    
    return full_path, full_dir, os.path.join(dir_path, filename)

def download_image(url, folder):
    """Download image from URL and save to folder preserving path structure"""
    try:
        filepath, dirpath, relative_path = get_filepath_from_url(url, folder)
        
        # Skip if already downloaded
        if os.path.exists(filepath):
            print(f"  Already exists: {relative_path}")
            return relative_path
        
        # Create directory structure if it doesn't exist
        if not os.path.exists(dirpath):
            os.makedirs(dirpath)
            print(f"  Created directory: {dirpath}")
        
        # Download the image
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        
        with urllib.request.urlopen(req, timeout=10) as response:
            content = response.read()
        
        # Save the image
        with open(filepath, 'wb') as f:
            f.write(content)
        
        print(f"  Downloaded: {relative_path}")
        return relative_path
        
    except Exception as e:
        print(f"  Failed to download {url}: {str(e)}")
        return None

def main():
    # Create images folder if it doesn't exist
    images_folder = 'images'
    if not os.path.exists(images_folder):
        os.makedirs(images_folder)
        print(f"Created folder: {images_folder}")
    
    # Load posts.json
    with open('posts.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    all_image_urls = set()
    url_to_post_map = {}
    
    # Extract all image URLs from posts
    print("Extracting image URLs from posts...")
    for post in data['posts']:
        content = post.get('Content', '')
        urls = extract_image_urls(content)
        
        for url in urls:
            all_image_urls.add(url)
            if url not in url_to_post_map:
                url_to_post_map[url] = []
            url_to_post_map[url].append(post['Id'])
    
    print(f"Found {len(all_image_urls)} unique hvflyingcircus wp-content image URLs")
    
    # Download all images
    downloaded_count = 0
    failed_urls = []
    url_mapping = {}
    
    print("\nDownloading images...")
    for i, url in enumerate(sorted(all_image_urls), 1):
        print(f"\n[{i}/{len(all_image_urls)}] Processing: {url}")
        print(f"  Used in posts: {url_to_post_map[url]}")
        
        relative_path = download_image(url, images_folder)
        if relative_path:
            downloaded_count += 1
            url_mapping[url] = f"/images/{relative_path}"
            # Small delay to be polite to the server
            time.sleep(0.5)
        else:
            failed_urls.append(url)
    
    # Summary
    print("\n" + "="*50)
    print(f"Download complete!")
    print(f"Successfully downloaded: {downloaded_count}/{len(all_image_urls)} images")
    
    if failed_urls:
        print(f"\nFailed to download {len(failed_urls)} images:")
        for url in failed_urls[:10]:  # Show first 10 failures
            print(f"  - {url}")
        if len(failed_urls) > 10:
            print(f"  ... and {len(failed_urls) - 10} more")
    
    # Save URL mapping for reference
    with open('image_url_mapping.json', 'w', encoding='utf-8') as f:
        json.dump(url_mapping, f, indent=2)
    print(f"\nURL mapping saved to image_url_mapping.json")
    
    # Optional: Create updated posts.json with local image paths
    print("\nDo you want to create an updated posts.json with local image paths? (y/n)")
    if input().lower() == 'y':
        # Create a copy of the data
        updated_data = json.loads(json.dumps(data))
        
        # Replace URLs in posts
        for post in updated_data['posts']:
            content = post['Content']
            for old_url, new_path in url_mapping.items():
                content = content.replace(old_url, new_path)
            post['Content'] = content
        
        # Save updated posts
        with open('posts_local_images.json', 'w', encoding='utf-8') as f:
            json.dump(updated_data, f, indent=2)
        print("Updated posts saved to posts_local_images.json")

if __name__ == "__main__":
    main()