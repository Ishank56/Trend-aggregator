import { NextResponse } from 'next/server';
import { youtubeClient } from '@/lib/youtube';
import { redditClient } from '@/lib/reddit';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const platform = searchParams.get('platform') || 'all';

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    const results = {
      youtube: [],
      reddit: [],
    };

    // Fetch YouTube results
    if (platform === 'all' || platform === 'youtube') {
      try {
        const youtubeResults = await youtubeClient.searchVideos(query);
        results.youtube = youtubeResults;
      } catch (error) {
        console.error('YouTube API error:', error);
      }
    }

    // Fetch Reddit results
    if (platform === 'all' || platform === 'reddit') {
      try {
        const redditResults = await redditClient.searchPosts(query);
        results.reddit = redditResults;
      } catch (error) {
        console.error('Reddit API error:', error);
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 