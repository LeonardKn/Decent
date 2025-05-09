// nostr_client.js
// A modular Nostr client that fetches latest text notes (kind 1) from a relay
// Usage: node nostr_client.js <relay_url> [limit]
// Example: node nostr_client.js wss://relay.damus.io 5

// const ws = new WebSocket("wss://example.com");
// ws.onmessage = e => console.log(e.data);

/**
 * Fetch latest Nostr text notes (kind 1) events from a relay.
 * @param {string} relayUrl - WebSocket URL of the Nostr relay (e.g. wss://relay.damus.io)
 * @param {number} limit - Number of events to fetch (default: 5)
 * @returns {Promise<Array<Object>>} - Resolves to an array of event objects
 */
/**
 * Fetch latest Nostr text notes (kind 1) events from a relay.
 */
export function fetchNostrEvents(relayUrl, limit = 5) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(relayUrl);
    const events = [];
    const subId = 'sub1';

    ws.addEventListener('open', () => {
      ws.send(JSON.stringify(["REQ", subId, { kinds: [1], limit }]));
    });

    ws.addEventListener('message', e => {
      let msg;
      try { msg = JSON.parse(e.data) } catch { return }
      if (msg[0]==='EVENT') {
        events.push(msg[2]);
        if (events.length >= limit) {
          ws.send(JSON.stringify(["CLOSE", subId]));
          ws.close();
          resolve(events);
        }
      }
    });

    ws.addEventListener('error', reject);
    ws.addEventListener('close', () => {
      if (events.length < limit) resolve(events);
    });
  });
}


/**
 * Print Nostr events to console.
 * @param {Array<Object>} events - Array of Nostr event objects
 */
function printEvents(events) {
  if (!events.length) {
    console.log('No events found.');
    return;
  }
  events.forEach((event) => {
    const ts = event.created_at;
    const pubkey = event.pubkey ? event.pubkey.slice(0, 8) : 'unknown';
    const content = event.content || '';
    console.log(`${ts} | ${pubkey}: ${content}\n`);
  });
}

/**
 * CLI entry point
 */
async function main() {
  const [,, relayUrl, rawLimit] = process.argv;
  if (!relayUrl) {
    console.error('Usage: node nostr_client.js <relay_url> [limit]');
    process.exit(1);
  }
  const limit = Number(rawLimit) || 5;
  try {
    const events = await fetchNostrEvents(relayUrl, limit);
    printEvents(events);
  } catch (err) {
    console.error('Error fetching Nostr events:', err.message);
  }
}

// Run CLI if invoked directly
// if (require.main === module) {
//   main();
// }

// module.exports = { fetchNostrEvents, printEvents };
