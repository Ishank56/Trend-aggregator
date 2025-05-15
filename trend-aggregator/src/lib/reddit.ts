import Snoowrap from 'snoowrap';

export interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  author: string;
  score: number;
  created_utc: number;
  num_comments: number;
  permalink: string;
  url: string;
}

let reddit: Snoowrap | null = null;

try {
  const userAgent = process.env.REDDIT_USER_AGENT;
  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;
  const username = process.env.REDDIT_USERNAME;
  const password = process.env.REDDIT_PASSWORD;

  if (!userAgent || !clientId || !clientSecret || !username || !password) {
    console.warn('Missing Reddit API credentials. Reddit features will be disabled.');
  } else {
    reddit = new Snoowrap({
      userAgent,
      clientId,
      clientSecret,
      username,
      password,
    });
  }
} catch (error) {
  console.error('Error initializing Reddit client:', error);
}

export const redditClient = {
  async searchPosts(query: string): Promise<RedditPost[]> {
    if (!reddit) {
      console.warn('Reddit API credentials not configured');
      return [];
    }

    try {
      const posts = await reddit.search({
        query,
        sort: 'relevance',
        time: 'all',
        limit: 10,
      });

      return posts.map(post => ({
        id: post.id,
        title: post.title,
        selftext: post.selftext,
        author: post.author.name,
        score: post.score,
        created_utc: post.created_utc,
        num_comments: post.num_comments,
        permalink: post.permalink,
        url: post.url,
      }));
    } catch (error) {
      console.error('Error searching Reddit posts:', error);
      return [];
    }
  },
};
