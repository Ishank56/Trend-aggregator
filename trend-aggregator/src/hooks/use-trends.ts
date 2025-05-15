import { useQuery } from '@tanstack/react-query';
import { YouTubeVideo } from '@/lib/youtube';
import { RedditPost } from '@/lib/reddit';

interface TrendsResponse {
  youtube: YouTubeVideo[];
  reddit: RedditPost[];
  summary?: string;
}

export function useTrends(query: string, platform: 'all' | 'youtube' | 'reddit' = 'all', summarize?: boolean) {
  return useQuery<TrendsResponse>({
    queryKey: ['trends', query, platform, summarize],
    queryFn: async () => {
      if (!query) {
        console.log('No query provided, returning empty results');
        return { youtube: [], reddit: [] };
      }

      console.log('Fetching trends for query:', query, 'platform:', platform, 'summarize:', summarize);
      const response = await fetch(
        `/api/trends?query=${encodeURIComponent(query)}&platform=${platform}${summarize ? '&summarize=true' : ''}`
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error:', errorText);
        throw new Error(`Failed to fetch trends: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      return data;
    },
    enabled: !!query,
  });
}