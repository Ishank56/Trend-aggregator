import { useQuery } from '@tanstack/react-query';
import { YouTubeVideo } from '@/lib/youtube';
import { RedditPost } from '@/lib/reddit';

interface TrendsResponse {
  youtube: YouTubeVideo[];
  reddit: RedditPost[];
}

export function useTrends(query: string, platform: 'all' | 'youtube' | 'reddit' = 'all') {
  return useQuery<TrendsResponse>({
    queryKey: ['trends', query, platform],
    queryFn: async () => {
      if (!query) {
        console.log('No query provided, returning empty results');
        return { youtube: [], reddit: [] };
      }

      console.log('Fetching trends for query:', query, 'platform:', platform);
      const response = await fetch(
        `/api/trends?query=${encodeURIComponent(query)}&platform=${platform}`
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