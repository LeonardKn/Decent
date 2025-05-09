// misskey_client.js
// A modular Misskey client with local/global timeline support

// EX: node misskey_client.js https://misskey.io 5 true

const axios = require('axios');

/**
 * Fetch posts from a Misskey instance (local or global timeline).
 * @param {string} instanceUrl - e.g. https://misskey.io
 * @param {number} limit - Number of posts to fetch
 * @param {boolean} globalTimeline - True for global timeline, false for local
 * @returns {Promise<Array<Object>>}
 */
async function fetchMisskeyPosts(instanceUrl, limit = 5, globalTimeline = false) {
  const base = instanceUrl.replace(/\/+$/, '');
  const endpoint = globalTimeline ? '/api/notes/global-timeline' : '/api/notes/local-timeline';
  const url = `${base}${endpoint}`;
  try {
    const response = await axios.post(url, { limit });
    return response.data;
  } catch (err) {
    console.error('Error fetching Misskey posts:', err.response?.statusText || err.message);
    return [];
  }
}

/**
 * Print Misskey notes to the console.
 * @param {Array<Object>} notes
 */
function printMisskeyNotes(notes) {
  if (!notes.length) {
    console.log('No notes found.');
    return;
  }
  notes.forEach(note => {
    const user = note.user?.username || 'unknown';
    const text = note.text || '';
    console.log(`@${user}: ${text}\n`);
  });
}

/**
 * CLI entry point
 */
async function main() {
  const [,, instanceUrl, rawLimit, rawScope] = process.argv;
  if (!instanceUrl) {
    console.error('Usage: node misskey_client.js <instance_url> [limit] [scope]');
    console.error('  scope: "global" or "local" (default: local)');
    process.exit(1);
  }
  const limit = Number(rawLimit) || 5;
  const globalTimeline = rawScope === 'global';
  const notes = await fetchMisskeyPosts(instanceUrl, limit, globalTimeline);
  printMisskeyNotes(notes);
}

// if (require.main === module) {
//   main();
// }

// module.exports = {
//   fetchMisskeyPosts,
//   printMisskeyNotes
// };
