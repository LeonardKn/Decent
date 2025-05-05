import requests
import sys

# 5 trending videos on peertube.social
# python peertube_client.py https://peertube.tv trending 5

def fetch_peertube_videos(instance_url, scope='trending', limit=5):
    """
    scope: one of 'local', 'trending', 'subscriptions' (subscriptions needs auth), 
           'recommended', etc.—but 'trending' and 'local' work without login.
    """
    base = instance_url.rstrip('/')
    url = f"{base}/api/v1/videos"
    params = {
        'scope': scope,
        'limit': limit
    }
    resp = requests.get(url, params=params)
    resp.raise_for_status()
    return resp.json()

def main():
    if len(sys.argv) < 2:
        print("Usage: python peertube_client.py <instance_url> [scope] [limit]")
        print("  scope: local or trending (default: trending)")
        sys.exit(1)

    instance = sys.argv[1]             # e.g. https://peertube.social
    scope    = sys.argv[2] if len(sys.argv) > 2 else 'trending'
    limit    = int(sys.argv[3]) if len(sys.argv) > 3 else 5

    videos = fetch_peertube_videos(instance, scope, limit)
    for vid in videos.get('data', videos):
        title = vid.get('name', vid.get('title', 'untitled'))
        link  = vid.get('videoUrl') or vid.get('url')
        print(f"{title}\n{link}\n")

if __name__ == '__main__':
    main()
