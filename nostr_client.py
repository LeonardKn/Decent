import asyncio
import json
import sys

from pprint import pprint
import websockets

async def fetch_nostr_posts(relay_url="wss://relay.damus.io", limit=5):
    async with websockets.connect(relay_url) as ws:
        # Subscribe to text notes (kind 1)
        req = ["REQ", "sub1", {"kinds": [1], "limit": limit}]
        await ws.send(json.dumps(req))

        count = 0
        while count < limit:
            msg = await ws.recv()
            data = json.loads(msg)
            if data[0] == "EVENT":
                event = data[2]
                ts      = event.get("created_at")
                sender  = event.get("pubkey")[:8]  # short pubkey
                content = event.get("content")
                pprint(f"{event}\n")
                print("==============")
                count += 1

        # Close subscription
        await ws.send(json.dumps(["CLOSE", "sub1"]))

if __name__ == "__main__":
    if len(sys.argv) < 3:
            print("Usage: python nostr_client.py <relay_url> <limit>")
            print("Example: python nostr_client.py wss://relay.damus.io 5")
            sys.exit(1)
    
    asyncio.run(fetch_nostr_posts(sys.argv[1], int(sys.argv[2])))