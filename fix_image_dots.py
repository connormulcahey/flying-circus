#!/usr/bin/env python3
import json
import re

def fix_image_dots_in_content(content):
    """Replace dots with underscores in image filenames within HTML content"""
    
    # Pattern to find img src attributes with our domain
    pattern = r'(src=["\']https?://[^"\']*hvflyingcircus\.com[^"\']*?)([^"/]+\.[a-zA-Z]{3,4})(["\'])'
    
    def replace_filename(match):
        prefix = match.group(1)  # Everything before the filename
        filename = match.group(2)  # The actual filename with extension
        suffix = match.group(3)   # The closing quote
        
        # Split filename and extension
        name_parts = filename.rsplit('.', 1)
        if len(name_parts) == 2:
            name, extension = name_parts
            # Replace dots with underscores in the name part only
            clean_name = name.replace('.', '_')
            new_filename = f"{clean_name}.{extension}"
            
            if name != clean_name:
                print(f"    {filename} → {new_filename}")
                return f"{prefix}{new_filename}{suffix}"
        
        return match.group(0)  # Return original if no change needed
    
    return re.sub(pattern, replace_filename, content)

def main():
    # Load posts.json
    print("Loading posts.json...")
    with open('posts.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    updated_count = 0
    total_changes = 0
    
    print(f"Processing {len(data['posts'])} posts...\n")
    
    for i, post in enumerate(data['posts'], 1):
        content = post.get('Content', '')
        
        # Check if there are any image URLs with dots in filenames
        img_with_dots = re.findall(r'src=["\']https?://[^"\']*hvflyingcircus\.com[^"\']*?[^"/]*\.[^./]+\.[a-zA-Z]{3,4}["\']', content, re.IGNORECASE)
        
        if img_with_dots:
            print(f"Post ID {post['Id']} - Found {len(img_with_dots)} images with dots in filename:")
            
            # Update the content
            new_content = fix_image_dots_in_content(content)
            
            if new_content != content:
                post['Content'] = new_content
                updated_count += 1
                total_changes += len(img_with_dots)
            
            print()
    
    if updated_count > 0:
        # Create backup
        print(f"Creating backup: posts_backup_before_dot_fix.json")
        with open('posts_backup_before_dot_fix.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        
        # Save updated posts.json
        print("Saving updated posts.json...")
        with open('posts.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        
        print(f"\n✓ Updated {updated_count} posts")
        print(f"✓ Fixed {total_changes} image filenames")
        print("✓ Backup saved as posts_backup_before_dot_fix.json")
        
        print("\nNext steps:")
        print("1. Run the image download script to get images with new names:")
        print("   python3 download_images.py")
        print("2. Deploy to server:")
        print("   ./deploy-posts.sh")
        
    else:
        print("✓ No image filenames with dots found")

if __name__ == "__main__":
    main()