
// const fetchNostrEvents = require('./clients/nostr_client.js');
// const fetchMastodonPosts = require('./clients/mastodon_client.js');
async function collectNostr () {
  const relayUrl = 'wss://relay.damus.io';
  const limit = 5;
  try {
    const events = await fetchNostrEvents(relayUrl, limit);
    console.log(events);
  } catch (err) {
    console.error('Failed to fetch Nostr events:', err);
  }
}

async function collectMastodon () {
  const instanceUrl = 'https://mastodon.social';
  const username = 'gargron';
  const limit = 5;
  try {
    const posts = await fetchMastodonPosts(instanceUrl, username, limit);
    if (posts.length === 0) {
      console.log('No posts found.');
    } else {
      printPosts(posts);
    }
  } catch (error) {
    console.log(error);
  }
}

export function fetchNostrEvents() {
  const ws = new WebSocket('ws://localhost:3000');
  ws.onmessage = e => console.log('Server says:', e.data);
  return ws;
}
