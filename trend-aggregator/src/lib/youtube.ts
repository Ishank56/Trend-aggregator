import { google } from 'googleapis';

const youtube = google.youtube('v3');

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  channelTitle: string;
  viewCount: string;
  likeCount: string;
  commentCount: string;
}

export interface YouTubeComment {
  id: string;
  authorDisplayName: string;
  textDisplay: string;
  likeCount: number;
  publishedAt: string;
}

export const youtubeClient = {
  async searchVideos(query: string): Promise<YouTubeVideo[]> {
    if (!process.env.YOUTUBE_API_KEY) {
      console.warn('YouTube API key not configured');
      return [];
    }

    try {
      const response = await youtube.search.list({
        key: process.env.YOUTUBE_API_KEY,
        part: ['snippet'],
        q: query,
        type: ['video'],
        maxResults: 10,
        order: 'relevance',
      });

      const videoIds = (response.data.items?.map(item => item.id?.videoId).filter((id): id is string => !!id)) || [];
      
      if (videoIds.length === 0) return [];

      const videoDetailsResponse = await youtube.videos.list({
        key: process.env.YOUTUBE_API_KEY,
        part: ['snippet', 'statistics'],
        id: videoIds,
      });

      const videoDetails = videoDetailsResponse.data;

      return (videoDetails.items ?? []).map((item: any) => ({
        id: item.id!,
        title: item.snippet?.title || '',
        description: item.snippet?.description || '',
        publishedAt: item.snippet?.publishedAt || '',
        channelTitle: item.snippet?.channelTitle || '',
        viewCount: item.statistics?.viewCount || '0',
        likeCount: item.statistics?.likeCount || '0',
        commentCount: item.statistics?.commentCount || '0',
      }));
    } catch (error) {
      console.error('Error searching YouTube videos:', error);
      return [];
    }
  },

  async getComments(videoId: string): Promise<YouTubeComment[]> {
    if (!process.env.YOUTUBE_API_KEY) {
      console.warn('YouTube API key not configured');
      return [];
    }

    try {
      const response = await youtube.commentThreads.list({
        key: process.env.YOUTUBE_API_KEY,
        part: ['snippet'],
        videoId: videoId,
        maxResults: 100,
        order: 'relevance',
      });

      return response.data.items?.map(item => ({
        id: item.id!,
        authorDisplayName: item.snippet?.topLevelComment?.snippet?.authorDisplayName || '',
        textDisplay: item.snippet?.topLevelComment?.snippet?.textDisplay || '',
        likeCount: item.snippet?.topLevelComment?.snippet?.likeCount || 0,
        publishedAt: item.snippet?.topLevelComment?.snippet?.publishedAt || '',
      })) || [];
    } catch (error) {
      console.error('Error fetching YouTube comments:', error);
      return [];
    }
  },
}; 