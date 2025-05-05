import sys
import requests

# EX: python bluesky_client.py jay
def fetch_bluesky_posts(handle, limit=5):
    base_url = "https://public.api.bsky.app"
    endpoint = "/xrpc/app.bsky.feed.getAuthorFeed"
    params = {
        "actor": handle,
        "limit": limit
    }

    response = requests.get(f"{base_url}{endpoint}", params=params)
    response.raise_for_status()
    data = response.json()

    for item in data.get("feed", []):
        post = item.get("post", {}).get("record", {})
        text = post.get("text", "")
        print(f"- {text}\n")

if __name__ == "__main__":
    fetch_bluesky_posts(f"{sys.argv[1]}.bsky.social", limit=5)
