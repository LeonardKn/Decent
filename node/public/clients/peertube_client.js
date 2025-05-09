const axios = require('axios');

//US: node peertube_client.js <instance_url> [scope] [limit]

/**
 * Fetch the latest videos from a PeerTube instance.
 * @param {string} instanceUrl - Base URL of the PeerTube instance (e.g. https://peertube.social)
 * @param {string} scope - 'local' or 'trending' (default: 'trending')
 * @param {number} limit - Number of videos to fetch (default: 5)
 * @returns {Promise<Array>} - List of video objects
 */
async function fetchPeerTubeVideos(instanceUrl, scope = 'trending', limit = 5) {
  const base = instanceUrl.replace(/\/+$/, '');
  const url = `${base}/api/v1/videos`;
  try {
    const response = await axios.get(url, {
      params: {
        scope,
        limit
      }
    });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching videos:', error.response ? error.response.statusText : error.message);
    if (error.response) {
      console.error('Status code:', error.response.status);
      console.error('Response:', error.response.data);
    }
    return [];
  }
}

// CLI entry point
// if (require.main === module) {
//   const [,, instance, cliScope, cliLimit] = process.argv;
//   if (!instance) {
//     console.error('Usage: node peertube_client.js <instance_url> [scope] [limit]');
//     console.error("  scope: 'local' or 'trending' (default: 'trending')");
//     process.exit(1);
//   }
//   const scope = cliScope || 'trending';
//   const limit = parseInt(cliLimit, 10) || 5;

//   (async () => {
//     const videos = await fetchPeerTubeVideos(instance, scope, limit);
//     videos.forEach(vid => {
//       const title = vid.name || vid.title || 'untitled';
//       const link = vid.videoUrl || vid.url || '';
//       console.log(`${title}\n${link}\n`);
//     });
//   })();
// }
