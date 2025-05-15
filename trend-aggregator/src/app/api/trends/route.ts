import { NextResponse } from 'next/server';
import { youtubeClient } from '@/lib/youtube';
import { redditClient } from '@/lib/reddit';
import { summarizeText } from '@/lib/utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const platform = searchParams.get('platform') || 'all';
    const summarize = searchParams.get('summarize') === 'true';

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    const results: {
      youtube: Awaited<ReturnType<typeof youtubeClient.searchVideos>>;
      reddit: Awaited<ReturnType<typeof redditClient.searchPosts>>;
    } = {
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

    let summary: string | undefined = undefined;
    if (summarize) {
      // Combine all text content for summarization
      const combinedText = [
        ...results.youtube.map((v: any) => v.title + ' ' + (v.description || '')),
        ...results.reddit.map((p: any) => p.title + ' ' + (p.selftext || '')),
      ].join('\n');
      summary = await summarizeText(combinedText);
    }

    return NextResponse.json(summary ? { ...results, summary } : results);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}