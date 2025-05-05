from pprint import pprint
import requests

def fetch_misskey_posts(instance_url, limit=5, global_timeline=False):
    url = f"{instance_url}/api/notes/local-timeline"
    if global_timeline:
        url = f"{instance_url}/api/notes/global-timeline"
    payload = {
        "limit": limit
    }
    response = requests.post(url, json=payload)
    response.raise_for_status()
    notes = response.json()
    for note in notes:
        user = note.get("user", {}).get("username", "unknown")
        content = note.get("text", "")
        pprint(f"{note}")
        print()

if __name__ == "__main__":
    # Example: 'https://misskey.io'
    fetch_misskey_posts(instance_url="https://misskey.io", limit=5, global_timeline=True)
