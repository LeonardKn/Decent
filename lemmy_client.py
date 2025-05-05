from pprint import pprint
import requests

# Simple Lemmy client to fetch latest posts from a given instance
# Usage: python lemmy_client.py <instance_url> [community] [limit]
# EX: python lemmy_client.py https://lemmy.ml programming 5

import sys

def fetch_posts(instance_url, community=None, limit=10):
    """
    Fetch latest posts from Lemmy instance.
    If community is None, fetch site-wide posts.
    """
    base = instance_url.rstrip('/')
    url = f"{base}/api/v3/post/list"
    params = {
        'limit': limit,
        # 'sort': 'New',  # other options: Hot, Top, etc.
    }
    if community:
        params['community_name'] = community

    resp = requests.get(url, params=params)
    resp.raise_for_status()
    data = resp.json()
    return data.get('posts', [])


def main():
    if len(sys.argv) < 2:
        print("Usage: python lemmy_client.py <instance_url> [community] [limit]")
        sys.exit(1)

    instance = sys.argv[1]
    community = None
    limit = 10
    if len(sys.argv) >= 3:
        community = sys.argv[2]
    if len(sys.argv) == 4:
        try:
            limit = int(sys.argv[3])
        except ValueError:
            pass

    posts = fetch_posts(instance, community, limit)
    for post in posts:
        p = post['post']
        pprint(p)
        #print(f"{p['name']} \n  by {p['author']} - {p['url']}\n")

if __name__ == '__main__':
    main()
