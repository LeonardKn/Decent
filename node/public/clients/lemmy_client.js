// lemmy_client.js
// Simple Lemmy client to fetch latest posts from a given instance
// Usage: node lemmy_client.js <instance_url> [community] [limit]

// EX: node lemmy_client.js https://lemmy.ml programming 5




/**
 * Fetch latest posts from a Lemmy instance.
 * @param {string} instanceUrl - Base URL of the Lemmy instance (e.g. https://lemmy.ml)
 * @param {string|null} community - Community name to filter by (e.g. 'programming'), or null for site-wide.
 * @param {number} limit - Number of posts to fetch (default: 10)
 * @returns {Promise<Array<Object>>} - Resolves to an array of post objects
 */
async function fetchPosts(instanceUrl, community = null, limit = 10) {
  const base = instanceUrl.replace(/\/+$/, '');
  const url = `${base}/api/v3/post/list`;
  const params = { limit };
  if (community) params.community_name = community;

  const response = await axios.get(url, { params });
  return response.data.posts || [];
}

/**
 * Print posts in readable form.
 * @param {Array<Object>} posts
 */
function printPosts(posts) {
  posts.forEach(({ post }) => {
    console.log('Title :', post.name);
    console.log('Author:', post.author);
    console.log('URL   :', post.url);
    console.log(post);
    console.log('---');
  });
}

/**
 * CLI entry point
 */
async function main() {
  const [,, instance, communityArg, limitArg] = process.argv;
  if (!instance) {
    console.error('Usage: node lemmy_client.js <instance_url> [community] [limit]');
    process.exit(1);
  }
  const community = communityArg || null;
  const limit = Number(limitArg) || 10;

  try {
    const posts = await fetchPosts(instance, community, limit);
    if (posts.length === 0) {
      console.log('No posts found.');
    } else {
      printPosts(posts);
    }
  } catch (error) {
    console.error('Error fetching posts:', error.message);
  }
}

// if (require.main === module) {
//   main();
// }

// module.exports = { fetchPosts, printPosts };
