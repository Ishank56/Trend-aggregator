'use client';

import { useState } from 'react';
import { useTrends } from '@/hooks/use-trends';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import SearchBar from './SearchBar';

export function TrendsSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlatform, setActivePlatform] = useState<'all' | 'youtube' | 'reddit'>('all');
  const [summarize, setSummarize] = useState(false);
  const { data, isLoading, error } = useTrends(searchQuery, activePlatform, summarize);

  // Fix: Only pass handleSearch to SearchBar, not to form
  const handleSearch = (term: string, summarizeParam?: boolean) => {
    setSearchQuery(term);
    setSummarize(!!summarizeParam);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <SearchBar onSearch={handleSearch} />
      {data?.summary && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-blue-700 mb-2">AI Summary</h3>
          <div className="text-blue-900 whitespace-pre-line">{data.summary}</div>
        </div>
      )}
      <Tabs defaultValue="all" onValueChange={(value) => setActivePlatform(value as any)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="youtube">YouTube</TabsTrigger>
          <TabsTrigger value="reddit">Reddit</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="text-red-500">Error: {error.message}</div>
          ) : (
            <>
              <YouTubeResults videos={data?.youtube || []} />
              <RedditResults posts={data?.reddit || []} />
            </>
          )}
        </TabsContent>

        <TabsContent value="youtube" className="space-y-4">
          {isLoading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="text-red-500">Error: {error.message}</div>
          ) : (
            <YouTubeResults videos={data?.youtube || []} />
          )}
        </TabsContent>

        <TabsContent value="reddit" className="space-y-4">
          {isLoading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="text-red-500">Error: {error.message}</div>
          ) : (
            <RedditResults posts={data?.reddit || []} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function YouTubeResults({ videos }: { videos: any[] }) {
  if (videos.length === 0) return <div>No YouTube videos found</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">YouTube Videos</h2>
      {videos.map((video) => (
        <Card key={video.id}>
          <CardHeader>
            <CardTitle>{video.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              {video.channelTitle} • {new Date(video.publishedAt).toLocaleDateString()}
            </p>
            <p className="mt-2">{video.description}</p>
            <div className="mt-4 flex gap-4 text-sm text-gray-500">
              <span>👁️ {video.viewCount} views</span>
              <span>👍 {video.likeCount} likes</span>
              <span>💬 {video.commentCount} comments</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function RedditResults({ posts }: { posts: any[] }) {
  if (posts.length === 0) return <div>No Reddit posts found</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Reddit Posts</h2>
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <CardTitle>{post.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Posted by u/{post.author} • {new Date(post.created_utc * 1000).toLocaleDateString()}
            </p>
            <p className="mt-2">{post.selftext}</p>
            <div className="mt-4 flex gap-4 text-sm text-gray-500">
              <span>⬆️ {post.score} points</span>
              <span>💬 {post.num_comments} comments</span>
            </div>
            <a
              href={`https://reddit.com${post.permalink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-blue-500 hover:underline block"
            >
              View on Reddit
            </a>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}