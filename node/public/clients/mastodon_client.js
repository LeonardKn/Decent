// mastodon_client.js
// A modular Mastodon-compatible client with callable functions and CLI support

// EX: node mastodon_client.js https://mastodon.social gargron 5
import axios from 'axios';

/**
 * Fetch recent statuses for a user from a Mastodon/Friendica-compatible instance.
 * @param {string} instanceUrl - Base URL of the instance (e.g. https://mastodon.social)
 * @param {string} username - Username or acct (e.g. 'gargron')
 * @param {number} [limit=5] - Number of statuses to fetch
 * @returns {Promise<Array<Object>>} - Resolves to an array of status objects
 */
async function fetchMastodonPosts(instanceUrl, username, limit = 5) {
  const base = instanceUrl.replace(/\/+$/, '');
  // 1) lookup the account ID
  const lookupUrl = `${base}/api/v1/accounts/lookup`;
  const lookupResp = await axios.get(lookupUrl, { params: { acct: username } });
  const acctId = lookupResp.data.id;
  // 2) fetch the statuses
  const statusesUrl = `${base}/api/v1/accounts/${acctId}/statuses`;
  const statusesResp = await axios.get(statusesUrl, { params: { limit } });
  return statusesResp.data;
}

/**
 * Print statuses to console (stripping common HTML tags).
 * @param {Array<Object>} statuses - Array of status objects
 */
function printStatuses(statuses) {
  if (!statuses.length) {
    console.log('No posts found.');
    return;
  }
  statuses.forEach(status => {
    const content = (status.content || '')
      .replace(/<p>/g, '')
      .replace(/<\/p>/g, '\n')
      .replace(/<[^>]+>/g, '');
    console.log(`- ${content}\n`);
  });
}

/**
 * CLI entry point
 */
async function main() {
  const [, , instanceUrl, username, rawLimit] = process.argv;
  if (!instanceUrl || !username) {
    console.error('Usage: node mastodon_client.js <instance_url> <username> [limit]');
    process.exit(1);
  }
  const limit = Number(rawLimit) || 5;
  try {
    const statuses = await fetchMastodonPosts(instanceUrl, username, limit);
    printStatuses(statuses);
  } catch (err) {
    console.error('Error fetching posts:', err.response?.statusText || err.message);
  }
}

// // Run CLI if invoked directly
// if (require.main === module) {
//   main();
// }

// module.exports = { fetchUserPosts: fetchMastodonPosts, printStatuses };
