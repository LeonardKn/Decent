// bluesky_client.js
// A modular Bluesky client with callable functions and CLI support

// EX: node bluesky_client.js jay 5

const axios = require('axios');

/**
 * Fetch recent posts from a Bluesky user feed.
 * @param {string} handle - Bluesky handle (e.g. 'jay.bsky.social')
 * @param {number} limit - Number of posts to fetch (default: 5)
 * @returns {Promise<Array>} - Resolves to list of post records
 */
async function fetchBlueskyPosts(handle, limit = 5) {
  const baseUrl = 'https://public.api.bsky.app';
  const endpoint = '/xrpc/app.bsky.feed.getAuthorFeed';
  try {
    const response = await axios.get(`${baseUrl}${endpoint}`, {
      params: { actor: handle, limit }
    });
    const feed = response.data.feed || [];
    return feed.map(item => item.post?.record || {});
  } catch (error) {
    console.error('Error fetching Bluesky posts:', error.response?.statusText || error.message);
    return [];
  }
}

/**
 * Print posts to console.
 * @param {Array} posts - List of post records
 */
function printPosts(posts) {
  posts.forEach(post => {
    const text = post.text || '';
    console.log(`- ${text}\n`);
  });
}

/**
 * CLI entry point
 */
async function main() {
  const [,, rawHandle, rawLimit] = process.argv;
  if (!rawHandle) {
    console.error('Usage: node bluesky_client.js <username> [limit]');
    console.error("  Example: node bluesky_client.js jay 5");
    process.exit(1);
  }
  const handle = rawHandle.includes('.') ? rawHandle : `${rawHandle}.bsky.social`;
  const limit = Number(rawLimit) || 5;
  const posts = await fetchBlueskyPosts(handle, limit);
  console.log(posts);
  printPosts(posts);
}

// if (require.main === module) {
//   main();
// }

// module.exports = {
//   fetchBlueskyPosts,
//   printPosts,
// };
