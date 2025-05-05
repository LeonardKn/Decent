import requests
import json

def get_pixelfed_posts(instance_url, timeline='local', limit=20):
    # Remove trailing slash from instance_url if present, to avoid double slashes
    instance_url = instance_url.rstrip('/') 
    
    api_url_base = f"{instance_url}/api/v1/timelines"
    params = {'limit': limit}
    api_url = "" # Initialize api_url

    if timeline == 'local':
        api_url = f"{api_url_base}/local"
    elif timeline == 'federated':
        # Use the correct endpoint for federated/public timeline
        api_url = f"{instance_url}/api/v1/timelines/public" 
    else:
        # Hashtag timelines are usually under /api/v1/timelines/tag/
        api_url = f"{api_url_base}/tag/{timeline}" # Correctly uses api_url_base

    # --- REMOVED THIS LINE ---
    # full_api_url = f"{instance_url}{api_url}" 
    
    # api_url now holds the correct full URL constructed in the if/elif/else block
    print(f"Attempting to fetch from URL: {api_url} with params: {params}") # Use api_url directly

    try:
        # Use api_url directly in the request
        response = requests.get(api_url, params=params) 
        print(f"HTTP Status Code: {response.status_code}")
        response.raise_for_status() 
        print("Raw Response:")
        print(response.text)
        posts = response.json()
        return posts
    except requests.exceptions.RequestException as e:
        print(f"Error fetching posts: {e}")
        # Check if the response object exists and has content before trying to print it
        if 'response' in locals() and response is not None:
             print(f"Response Status Code: {response.status_code}")
             print(f"Response Text: {response.text}")
        return None
    except json.JSONDecodeError:
        print("Error decoding JSON response.")
         # Check if the response object exists and has content before trying to print it
        if 'response' in locals() and response is not None:
             print(f"Response Status Code: {response.status_code}")
             print(f"Response Text: {response.text}")
        return None

# --- Keep the rest of your code the same ---
if __name__ == "__main__":
    instance = input("Enter your Pixelfed instance URL (e.g., https://pixelfed.social): ")
    timeline_choice = input("Enter timeline ('local', 'federated', or a hashtag without #): ").lower()
    
    # Basic input validation for number of posts
    while True:
        try:
            num_posts_input = input("Enter the number of posts to retrieve (e.g., 10): ")
            num_posts = int(num_posts_input)
            if num_posts > 0:
                 break
            else:
                 print("Please enter a positive number.")
        except ValueError:
            print("Invalid input. Please enter a number.")

    posts_data = get_pixelfed_posts(instance, timeline_choice, num_posts)

    if posts_data:
        print(f"\n--- Latest {len(posts_data)} posts from the '{timeline_choice}' timeline of {instance} ---")
        # Example of printing post content (adapt as needed based on actual JSON structure)
        for i, post in enumerate(posts_data):
            print(f"\nPost {i+1}:")
            print(f"  ID: {post.get('id', 'N/A')}")
            print(f"  Author: {post.get('account', {}).get('display_name', 'N/A')} (@{post.get('account', {}).get('acct', 'N/A')})")
            # Pixelfed might use 'content' (HTML) or 'spoiler_text'
            content = post.get('content', '') or post.get('spoiler_text', '')
            # Basic HTML tag removal for cleaner console output (optional)
            import re
            clean_content = re.sub('<[^<]+?>', '', content) 
            print(f"  Content: {clean_content[:200]}...") # Print first 200 chars
            print(f"  URL: {post.get('url', 'N/A')}")
            if post.get('media_attachments'):
                print(f"  Media: {len(post.get('media_attachments'))} attachment(s)")
    else:
        print("Failed to retrieve posts.")