// friendica_client.js
// A robust Friendica/Mastodon-compatible client that fetches the public timeline

const axios = require('axios');

/**
 * Fetch recent public posts from a Friendica- or Mastodon-compatible instance.
 * @param {string} instanceUrl - Base URL of the instance (e.g. https://inne.city)
 * @param {number} [limit=20] - Number of posts to fetch (default: 20)
 * @returns {Promise<Array<Object>>} - Resolves to an array of status objects
 */
async function fetchPublicTimeline(instanceUrl, limit = 20) {
  // Normalize and ensure protocol
  let base = instanceUrl.trim().replace(/\/+$/, '');
  if (!/^https?:\/\//i.test(base)) {
    base = 'https://' + base;
  }
  const url = `${base}/api/v1/timelines/public`;

  try {
    const response = await axios.get(url, { params: { limit } });
    const data = response.data;
    if (Array.isArray(data)) {
      return data;
    }
    console.error('Unexpected response format, expected an array.');
    return [];
  } catch (error) {
    if (error.code === 'ERR_INVALID_URL') {
      console.error('Invalid URL:', url);
    } else {
      const statusText = error.response?.statusText || error.message;
      console.error('Error fetching public timeline:', statusText);
      console.error('Requested URL:', url);
      if (error.response?.data) {
        console.error('Response snippet:', JSON.stringify(error.response.data).substring(0, 200));
      }
    }
    return [];
  }
}

/**
 * Clean HTML tags from a string.
 * @param {string} html
 * @returns {string}
 */
function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Print posts to the console.
 * @param {Array<Object>} statuses
 */
function printPosts(statuses) {
  if (!statuses.length) {
    console.log('No posts found.');
    return;
  }
  statuses.forEach(status => {
    const account = status.account || {};
    const displayName = account.display_name || account.username || 'unknown';
    const username = account.acct || account.username || 'unknown';
    const createdAt = status.created_at || '';
    const contentHtml = status.content || '';
    const content = stripHtml(contentHtml).trim();

    console.log(`[${createdAt}] ${displayName} (@${username}):`);
    console.log(content);
    console.log('---\n');
  });
}

/**
 * CLI entry point
 */
async function main() {
  const [, , instanceUrl, rawLimit] = process.argv;
  if (!instanceUrl) {
    console.error('Usage: node friendica_client.js <instance_url> [limit]');
    console.error('Example: node friendica_client.js https://inne.city 10');
    process.exit(1);
  }
  const limit = Number(rawLimit) || 20;
  const statuses = await fetchPublicTimeline(instanceUrl, limit);
  printPosts(statuses);
}

if (require.main === module) {
  main();
}

module.exports = {
  fetchPublicTimeline,
  stripHtml,
  printPosts
};
