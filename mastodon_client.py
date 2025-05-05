import requests
import sys

#Ex: python mastodon_client.py https://mastodon.social gargron 3
#prints the 3 most recent toots from user @gargron.

def fetch_user_posts(instance, username, limit=5):
    base = instance.rstrip('/')
    # 1) lookup the account ID
    r = requests.get(f"{base}/api/v1/accounts/lookup", params={'acct': username})
    r.raise_for_status()
    acct_id = r.json()['id']
    # 2) fetch their statuses
    r2 = requests.get(f"{base}/api/v1/accounts/{acct_id}/statuses", params={'limit': limit})
    r2.raise_for_status()
    return r2.json()

def main():
    if len(sys.argv) < 3:
        print("Usage: python mastodon_client.py <instance_url> <username> [limit]")
        sys.exit(1)

    instance = sys.argv[1]           # e.g. https://mastodon.social
    username = sys.argv[2]           # e.g. gargron
    limit = int(sys.argv[3]) if len(sys.argv) > 3 else 5

    posts = fetch_user_posts(instance, username, limit)
    for status in posts:
        print(f"- {status['content'].replace('<p>','').replace('</p>','')}\n")

if __name__ == '__main__':
    main()
