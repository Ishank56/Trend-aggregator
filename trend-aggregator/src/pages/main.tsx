import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { useTrends } from '../hooks/use-trends'

createRoot(document.getElementById("root")!).render(<App />);

function TrendsList() {
  const { data, isLoading, error } = useTrends('your search query');

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>YouTube Videos</h2>
      {data?.youtube.map(video => (
        <div key={video.id}>
          <h3>{video.title}</h3>
          <p>{video.description}</p>
        </div>
      ))}

      <h2>Reddit Posts</h2>
      {data?.reddit.map(post => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.selftext}</p>
        </div>
      ))}
    </div>
  );
}